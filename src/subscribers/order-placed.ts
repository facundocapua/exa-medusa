import {
  type SubscriberConfig,
  type SubscriberArgs,
  OrderService
} from '@medusajs/medusa'
import { Resend } from 'resend';
import NewOrderEmail from '../emails/new-order';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handleOrderPlaced ({
  data, eventName, container, pluginOptions
}: SubscriberArgs<Record<string, string>>): Promise<void> {
  console.log('[Order Placed]', data)

  const orderService: OrderService = container.resolve(
    'orderService'
  )
  const order = await orderService.retrieveWithTotals(data.id, {
    relations: ['payments', 'shipping_address', 'billing_address', 'items', 'items.variant', 'items.variant.product']
  })

  console.log('[Order Placed] Processing order', order.id)

  const salonService = container.resolve('salonService')
  const salon = await salonService.retrieveBySalesChannelId(order.sales_channel_id)
  const medusaSettings = salon?.medusa_settings ?? {}

  const fromName = medusaSettings.email_from ?? process.env.RESEND_FROM ?? 'onboarding@resend.dev'
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Construct Email HTML
  const isBankTransfer = order.payments?.some(p => p.provider_id === 'banktransfer')

  console.log('[Resend] Sending order confirmed email to', order.email)
  
  const props = {
    id: order.id,
    shippingAddress: order.shipping_address,
    isBankTransfer,
    orderNumber: order.display_id,
    items: order.items,
    subtotal: order.subtotal,
    shippingTotal: order.shipping_total,
    total: order.total
  }

  await resend.emails.send({
    to: order.email,
    from: fromName,
    subject: `Estamos procesando tu pedido`,
    react: NewOrderEmail(props),
    
  })

  await sleep(1000)

  // Send copy to eXa
  if (process.env.NODE_ENV !== 'development') {
    console.log('[Resend] Sending copy to eXa')
    await resend.emails.send({
      to: 'facundocapua@gmail.com',
      from: fromName,
      subject: `[Copy] Estamos procesando tu pedido`,
      react: NewOrderEmail(props),
    })

    await sleep(1000)

    if (salon?.email) {
      await resend.emails.send({
        to: salon.email,
        from: fromName,
        subject: `[Salon Copy] Estamos procesando tu pedido`,
        react: NewOrderEmail(props),
      })
    }
  }
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
  context: {
    subscriberId: 'order-placed-handler'
  }
}
