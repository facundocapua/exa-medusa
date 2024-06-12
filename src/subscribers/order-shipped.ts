import {
  type SubscriberConfig,
  type SubscriberArgs,
  OrderService
} from '@medusajs/medusa'

export default async function handleOrderShipped ({
  data, eventName, container, pluginOptions
}: SubscriberArgs<Record<string, string>>): Promise<void> {
  const sendGridService = container.resolve('sendgridService')

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
  console.log('[Order Shipment Created] Tracking', tracking)

  const salonService = container.resolve('salonService')
  const salon = await salonService.retrieveBySalesChannelId(order.sales_channel_id)
  const medusaSettings = salon?.medusa_settings ?? {}

  const emailData = {
    first_name: order.shipping_address.first_name,
    display_id: order.display_id,
    tracking_code: tracking.tracking_number
  }

  const templateId = medusaSettings.order_shipped_template ?? process.env.SENDGRID_ORDER_SHIPPED_ID
  const fromName = medusaSettings.email_from ?? process.env.SENDGRID_FROM

  console.log('[Sendgrid] Sending email with template', templateId)

  sendGridService.sendEmail({
    templateId,
    from: fromName,
    to: order.email,
    dynamic_template_data: emailData
  })
}

export const config: SubscriberConfig = {
  event: OrderService.Events.SHIPMENT_CREATED,
  context: {
    subscriberId: 'order-shipped-handler'
  }
}
