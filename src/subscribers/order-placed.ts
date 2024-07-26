import {
  type SubscriberConfig,
  type SubscriberArgs,
  OrderService
} from '@medusajs/medusa'

export default async function handleOrderPlaced ({
  data, eventName, container, pluginOptions
}: SubscriberArgs<Record<string, string>>): Promise<void> {
  const sendGridService = container.resolve('sendgridService')
  console.log('[Order Placed]', data)

  const orderService: OrderService = container.resolve(
    'orderService'
  )
  const order = await orderService.retrieve(data.id)

  const salonService = container.resolve('salonService')
  const salon = await salonService.retrieveBySalesChannelId(order.sales_channel_id)
  const medusaSettings = salon?.medusa_settings ?? {}

  const emailData = await sendGridService.orderPlacedData(data)

  const templateId = medusaSettings.order_placed_template ?? process.env.SENDGRID_ORDER_PLACED_ID
  const fromName = medusaSettings.email_from ?? process.env.SENDGRID_FROM

  console.log('[Sendgrid] Sending email with template', templateId)

  sendGridService.sendEmail({
    templateId,
    from: fromName,
    to: order.email,
    dynamic_template_data: emailData
  })

  // Send copy to eXa
  console.log('[Sendgrid] Sending copy to eXa')
  if (process.env.NODE_ENV !== 'development') {
    sendGridService.sendEmail({
      templateId,
      from: fromName,
      to: 'info@exabeauty.com.ar',
      dynamic_template_data: emailData
    })

    if (salon?.email) {
      console.log('[Sendgrid] Sending copy to Salon')
      sendGridService.sendEmail({
        templateId,
        from: fromName,
        to: salon.email,
        dynamic_template_data: emailData
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
