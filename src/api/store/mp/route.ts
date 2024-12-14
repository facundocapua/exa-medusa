import {
  type Cart,
  type MedusaRequest,
  type MedusaResponse
} from '@medusajs/medusa'
import type MercadopagoService from 'src/services/mercadopago'

interface MercadoPagoData {
  type: string
  data: {
    id: string
  }
}

export async function GET (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<MedusaResponse> {
  return res.json({
    message: 'Hello MercadoPago'
  })
}

export async function POST (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<MedusaResponse> {
  const data = req.body as MercadoPagoData
  // console.log('[MercadoPago Hook]', data)
  if (data.type === 'payment') {
    const mercadoPagoProviderService: MercadopagoService = req.scope.resolve('mercadopagoService')
    const mercadoPagoPayment = await mercadoPagoProviderService.retrievePayment({
      id: data.data.id
    })
    const cartId = mercadoPagoPayment.external_reference
    if (cartId) {
      const manager = req.scope.resolve('manager')
      const cartService = req.scope.resolve('cartService')
      const orderService = req.scope.resolve('orderService')
      const productVariantInventoryService = req.scope.resolve('productVariantInventoryService')
      const paymentService = req.scope.resolve('paymentService')

      const order = await orderService
        .retrieveByCartId(cartId, {
          relations: ['payments']
        })
        .catch(() => undefined)

      await manager.transaction(async (m) => {
        if (!order) {
          const cartServiceTx = cartService.withTransaction(manager)
          const productVariantInventoryServiceTx = productVariantInventoryService.withTransaction(manager)
          const paymentServiceTx = paymentService.withTransaction(manager)

          await cartServiceTx.setPaymentSession(cartId, 'mercadopago')
          await cartServiceTx.authorizePayment(cartId, {
            id: mercadoPagoPayment.id
          })
          const cart: Cart = await cartService.retrieveWithTotals(cartId, {
            relations: [
              'region',
              'payment',
              'payment_sessions',
              'items.variant.product.profiles'
            ]
          })

          const reservations = await makeReservations(cart, productVariantInventoryServiceTx)
          if (reservations.some(([_, error]) => error)) {
            await removeReservations(reservations, productVariantInventoryServiceTx)
            paymentServiceTx.cancelPayment(cart.payment)

            await cartServiceTx.update(cart.id, {
              payment_authorized_at: null
            })

            throw new Error('Could not reserve inventory')
          }

          const newOrder = await orderService
            .withTransaction(manager)
            .createFromCart(cart)

          if (mercadoPagoPayment.captured) {
            await orderService.capturePayment(newOrder.id)
          }
        }
      })
    }
  }

  return res.status(200).json(data)
}

async function makeReservations (cart: Cart, productVariantInventoryServiceTx: any): Promise<any> {
  const reservations = Promise.all(
    cart.items.map(async (item) => {
      if (item.variant_id) {
        try {
          const inventoryConfirmed =
            await productVariantInventoryServiceTx.confirmInventory(
              item.variant_id,
              item.quantity,
              { salesChannelId: cart.sales_channel_id }
            )

          if (!inventoryConfirmed) {
            throw new Error(`Variant with id: ${item.variant_id} does not have the required inventory`)
          }

          return [
            await productVariantInventoryServiceTx.reserveQuantity(
              item.variant_id,
              item.quantity,
              {
                lineItemId: item.id,
                salesChannelId: cart.sales_channel_id
              }
            ),
            undefined
          ]
        } catch (error) {
          return [undefined, error]
        }
      }
      return [undefined, undefined]
    })
  )

  return await reservations
}

async function removeReservations (reservations: any, inventoryService: any): Promise<void> {
  await Promise.all(
    reservations.map(async ([reservations]) => {
      if (reservations) {
        return reservations.map(async (reservation) => {
          await inventoryService.deleteReservationsByLineItem(
            reservation.line_item_id
          )
        })
      }
      await Promise.resolve()
    })
  )
}
