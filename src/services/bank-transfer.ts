import { AbstractPaymentProcessor, PaymentSessionStatus, type PaymentProcessorContext, type PaymentProcessorSessionResponse } from '@medusajs/medusa'

class BankTransferService extends AbstractPaymentProcessor {
  static identifier: string = 'banktransfer'

  /**
    * Returns the currently held status.
    */
  async getStatus (paymentData: { status: string }): Promise<string> {
    const { status } = paymentData
    return status
  }

  async initiatePayment (context: PaymentProcessorContext): Promise<PaymentProcessorSessionResponse> {
    return {
      session_data: {
        status: 'pending'
      }
    }
  }

  async createPayment (): Promise<{ status: string }> {
    return { status: 'pending' }
  }

  async retrievePayment (data: Record<string, string>): Promise<Record<string, string>> {
    return data
  }

  async authorizePayment (): Promise<{ status: PaymentSessionStatus, data: { status: string } }> {
    return { status: PaymentSessionStatus.AUTHORIZED, data: { status: 'authorized' } }
  }

  async updatePayment (sessionData: object): Promise<void> {

  }

  async updatePaymentData (sessionId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    return { ...data }
  }

  async deletePayment (): Promise<Record<string, unknown>> {
    return {}
  }

  async capturePayment (): Promise<{ status: string }> {
    return { status: 'captured' }
  }

  async getPaymentData (session: { data: object }): Promise<object> {
    return session.data
  }

  async refundPayment (data): Promise<Record<string, unknown>> {
    return { ...data }
  }

  async cancelPayment (): Promise<{ status: string }> {
    return { status: 'canceled' }
  }

  async getPaymentStatus (paymentSessionData: Record<string, unknown>): Promise<PaymentSessionStatus> {
    return PaymentSessionStatus.AUTHORIZED
  }
}

export default BankTransferService
