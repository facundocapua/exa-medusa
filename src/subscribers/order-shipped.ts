import {
  type SubscriberConfig,
  type SubscriberArgs,
  OrderService
} from '@medusajs/medusa'
import { Resend } from 'resend'
import OrderShippedEmail from '../emails/order-shipped'

export default async function handleOrderShipped ({
  data, eventName, container, pluginOptions
}: SubscriberArgs<Record<string, string>>): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const orderService: OrderService = container.resolve(
    'orderService'
  )
  const order = await orderService.retrieve(data.id, {
    relations: [
      'customer',
      'shipping_address'
    ]
  })

  const trackingLinkRepository = container.resolve('trackingLinkRepository')
  const tracking = await trackingLinkRepository.findOne({
    where: {
      fulfillment_id: data.fulfillment_id
    }
  })
  if (!tracking) {
    console.log('[Order Shipment Created] No tracking found')
    return
  }

  console.log('[Order Shipment Created] Tracking', tracking)

  const salonService = container.resolve('salonService')
  const salon = await salonService.retrieveBySalesChannelId(order.sales_channel_id)
  const medusaSettings = salon?.medusa_settings ?? {}

  const emailData = {
    firstName: order.shipping_address.first_name,
    orderNumber: order.display_id,
    trackingCode: tracking.tracking_number
  }

  const templateId = medusaSettings.order_shipped_template ?? process.env.SENDGRID_ORDER_SHIPPED_ID
  const fromName = medusaSettings.email_from ?? process.env.SENDGRID_FROM

  console.log('[Sendgrid] Sending email with template', templateId)

  await resend.emails.send({ 
    to: order.email,
    from: fromName,
    subject: '¡Tu pedido está en camino!',
    react: OrderShippedEmail(emailData),
  })

  if (process.env.NODE_ENV !== 'development') {
    console.log('[Sendgrid] Sending copy to eXa')
    await resend.emails.send({
      from: fromName,
      to: 'facundocapua@gmail.com',
      subject: '¡Tu pedido está en camino!',
      react: OrderShippedEmail(emailData),
    })
  }
}

export const config: SubscriberConfig = {
  event: OrderService.Events.SHIPMENT_CREATED,
  context: {
    subscriberId: 'order-shipped-handler'
  }
}
