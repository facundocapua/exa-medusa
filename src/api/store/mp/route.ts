import type {
  MedusaRequest,
  MedusaResponse
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
      const order = await orderService
        .retrieveByCartId(cartId, {
          relations: ['payments']
        })
        .catch(() => undefined)

      await manager.transaction(async (m) => {
        if (!order) {
          const cartServiceTx = cartService.withTransaction(manager)
          await cartServiceTx.setPaymentSession(cartId, 'mercadopago')
          await cartServiceTx.authorizePayment(cartId, {
            id: mercadoPagoPayment.id
          })
          const newOrder = await orderService
            .withTransaction(manager)
            .createFromCart(cartId)

          if (mercadoPagoPayment.captured) {
            await orderService.capturePayment(newOrder.id)
          }
        }
      })
    }
  }

  return res.status(200).json(data)
}
