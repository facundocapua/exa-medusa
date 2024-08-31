export interface hours {
  open: string
  close: string
}

export interface SalonFormType {
  name: string
  lat: string
  lng: string
  address: string
  city: string
  state: string
  hours: {
    mon?: hours
    tue?: hours
    wed?: hours
    thu?: hours
    fri?: hours
    sat?: hours
    sun?: hours
  }
  website: string
  social_networks: {
    facebook?: string
    instagram?: string
    tiktok?: string
    whatsapp?: string
  }
  map: string
  phone: string
  email: string
  map_link: string
  is_active?: boolean
  medusa_settings?: {
    email_from?: string
    order_placed_template?: string
    order_shipped_template?: string
    mercadopago_success_backurl?: string
  }
  sales_channel_id: string
}
