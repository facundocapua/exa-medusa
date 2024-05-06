import {
  type SubscriberConfig,
  type SubscriberArgs,
  TokenService
} from '@medusajs/medusa'

export default async function handleOrderClaim ({
  data, eventName, container, pluginOptions
}: SubscriberArgs<Record<string, string>>): Promise<void> {
  // TODO: handle event
  const customerSerivce = container.resolve('customerService')
  const tokenService = container.resolve(TokenService.RESOLUTION_KEY)
  const manager = container.resolve('manager')
  const orderService = container.resolve('orderService')

  await manager.transaction(async (transactionManager) => {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    const { old_email, token } = data
    const { claimingCustomerId, orders: orderIds } = tokenService.verifyToken(
      token,
      {
        maxAge: '15m'
      }
    ) as {
      claimingCustomerId: string
      orders: string[]
    }

    const customer = await customerSerivce
      .withTransaction(transactionManager)
      .retrieve(claimingCustomerId)

    if (old_email !== customer.email) {
      throw new Error('Email does not match')
    }

    const orders = await orderService.list({ id: orderIds })
    await Promise.all(
      orders.map((order) => {
        return orderService.update(order.id, {
          customer_id: claimingCustomerId
        })
      })
    )
  })
}

export const config: SubscriberConfig = {
  event: 'order-update-token.created',
  context: {
    subscriberId: 'customer-created-handler'
  }
}
