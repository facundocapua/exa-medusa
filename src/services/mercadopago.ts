import { AbstractPaymentProcessor, PaymentSessionStatus, type PaymentProcessorError, type PaymentProcessorContext, type PaymentProcessorSessionResponse } from '@medusajs/medusa'
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

class MercadopagoService extends AbstractPaymentProcessor {
  static identifier: string = 'mercadopago'

  protected client_: MercadoPagoConfig
  protected options_: Record<string, string>

  protected cartService_
  protected salonService_
  protected salesChannelService_

  constructor (container: Record<string, string>) {
    super(container)

    this.options_ = {
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? '',
      webhook_url: process.env.MERCADOPAGO_WEBHOOK_URL ?? '',
      success_backurl: process.env.MERCADOPAGO_SUCCESS_BACKURL ?? ''
    }

    this.client_ = new MercadoPagoConfig({ accessToken: this.options_.accessToken })
    this.cartService_ = container.cartService
    this.salonService_ = container.salonService
    this.salesChannelService_ = container.salesChannelService
  }

  async createPreferenceReq (data): Promise<any> {
    const { amount, currencyCode, email, name, surname, referenceId } = data

    const cart = await this.cartService_.retrieve(referenceId)
    const salesChannel = await this.salesChannelService_.retrieve(cart.sales_channel_id)

    const settings = await this.salonService_.getMedusaSettings({ salesChannelId: cart.sales_channel_id })
    const successUrl = settings.mercadopago_success_backurl ?? this.options_.success_backurl

    const body = {
      items: [
        {
          id: referenceId,
          title: salesChannel.name,
          quantity: 1,
          unit_price: amount,
          currency_id: currencyCode
        }
      ] /** REQUIRED */,
      payer: {
        name,
        surname,
        email
      },
      notification_url: `${this.options_.webhook_url}/store/mp`,
      external_reference: referenceId, // This field will allow you to relate the payment with the cartid
      back_urls: {
        // Return the cardId in the url to get the order from the client side
        success: `${successUrl}/mercadopago/${referenceId}`
      }
    }

    return body
  }

  async capturePayment (
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    if (paymentSessionData.captured === true) {
      return paymentSessionData
    }

    return {
      error: 'Payment not captured',
      code: 'mercadopago_payment_not_captured'
    }
  }

  async authorizePayment (
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    PaymentProcessorError |
    {
      status: PaymentSessionStatus
      data: Record<string, unknown>
    }
    > {
    // Get payment status
    const status = await this.getPaymentStatus(context)
    try {
      return {
        data: {
          ...paymentSessionData,
          id: context.id // payment id
        },
        status
      }
    } catch (error) {
      console.error(error)
      return {
        error: `[MercadoPago] Payment not authorized: ${error.message}`,
        code: 'mercadopago_payment_not_authorized'
      }
    }
  }

  async cancelPayment (
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    const paymentId = paymentSessionData.id

    // assuming client is an initialized client
    // communicating with a third-party service.
    const cancelData = {}// this.client_.cancel(paymentId)

    return {
      id: paymentId,
      ...cancelData
    }
  }

  async refundPayment (paymentSessionData: Record<string, unknown>, refundAmount: number): Promise<PaymentProcessorError | any> {
    throw new Error('refundPayment not implemented.')
  }

  async initiatePayment (context: PaymentProcessorContext): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    const { billing_address: billingAddress, currency_code: currencyCode, email, resource_id: referenceId } = context
    const body = await this.createPreferenceReq({
      referenceId,
      amount: context.amount / 100,
      currencyCode: currencyCode.toUpperCase(),
      email,
      name: billingAddress?.first_name ?? '',
      surname: billingAddress?.last_name ?? ''
    })

    const preferenceClient = new Preference(this.client_)
    const preference = await preferenceClient.create({ body })

    return {
      session_data: {
        preferenceId: preference.id,
        url: preference.init_point,
        urlSandbox: preference.sandbox_init_point
      }
    }
  }

  async deletePayment (paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse['session_data']> {
    return paymentSessionData
  }

  async getPaymentStatus (paymentSessionData: Record<string, unknown>): Promise<PaymentSessionStatus> {
    const paymentIntent = await this.retrievePayment(paymentSessionData)
    switch (paymentIntent.status) {
      case 'approved':
      case 'authorized':
        return PaymentSessionStatus.AUTHORIZED
      case 'refunded':
      case 'charged_back':
      case 'cancelled':
        return PaymentSessionStatus.CANCELED
      case 'rejected':
        return PaymentSessionStatus.ERROR
      case 'pending':
      case 'in_process':
      case 'in_mediation':
        return PaymentSessionStatus.PENDING
      default:
        return PaymentSessionStatus.PENDING
    }
  }

  async retrievePayment (paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | any> {
    const { id } = paymentSessionData
    if (!id) {
      return {
        error: 'Payment not found',
        code: 'mercadopago_payment_not_found'
      }
    }

    try {
      const payment = new Payment(this.client_)
      return await payment.get({ id: id as string })
    } catch (error) {
      console.log('[MercadoPago] Error retrieving payment')
      console.error(error)
      // throw error
    }
  }

  async updatePayment (context: PaymentProcessorContext): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    const { billing_address: billingAddress, currency_code: currencyCode, email, resource_id: referenceId } = context
    const body = await this.createPreferenceReq({
      referenceId,
      amount: context.amount / 100,
      currencyCode: currencyCode.toUpperCase(),
      email,
      name: billingAddress?.first_name ?? '',
      surname: billingAddress?.last_name ?? ''
    })
    const { preferenceId } = context.paymentSessionData
    console.log('[MercadoPago] Update prefrence', preferenceId)

    const preferenceClient = new Preference(this.client_)
    const preference = await preferenceClient.update({
      id: preferenceId as string,
      updatePreferenceRequest: body
    })

    return {
      session_data: {
        preferenceId: preference.id,
        url: preference.init_point,
        urlSandbox: preference.sandbox_init_point
      }
    }
  }

  async updatePaymentData (sessionId: string, data: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse['session_data']> {
    return data
  }
}

export default MercadopagoService
