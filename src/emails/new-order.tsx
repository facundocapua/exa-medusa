import { BankTransferInfo } from './components/bank-transfer-info'
import { Footer } from './components/footer'
import { Header } from './components/header'
import { Html, Tailwind, Container, Img, Section, Row, Column, Hr, Text, Button } from '@react-email/components'

const formatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  maximumFractionDigits: 0,
  currency: "ARS"
})

const formatShipping = (shippingTotal) => {
  if (!shippingTotal) return 'Gratis'
  const shippingNumber = shippingTotal / 100

  return shippingNumber < 10 ? 'Gratis' : formatter.format(shippingNumber)
}

export default function NewOrderEmail(props) {
  const {
    id,
    shippingAddress,
    isBankTransfer,
    orderNumber,
    items,
    subtotal,
    shippingTotal,
    total
  } = props;

  return (
    <Html lang="es" dir="ltr">
      <Tailwind>
        <Section className='bg-neutral-600 font-sans text-white'>
          <Container className='my-4 p-4 max-w-[600px]'>
            <Header title='¡Gracias por tu compra!' />
            <Section>
              <p className='text-xl my-8'>Hola {shippingAddress?.first_name},</p>
              {isBankTransfer ? <BankTransferInfo /> : <p>Tu orden ha sido recibida y está siendo procesada.</p>}
            </Section>
            <Section>
              <h2 className='text-neutral-200'>Número de pedido: {orderNumber}</h2>
            </Section>
            <Section>
              <h3 className='text-neutral-300 font-semibold'>Resumen</h3>
              {items?.map((item) => (
                <Row className='mb-4'>
                  <Column className='w-[40px] pr-4'>
                    <Img src={item.thumbnail} width="40" />
                  </Column>
                  <Column className='w-3/5 align-top'>
                    <Text className='m-0'>{item.title}</Text>
                    <Text className='text-neutral-400 m-0'>{item.variant.title}</Text>
                  </Column>
                  <Column className='text-right align-top'>
                    <Text className='text-xs text-neutral-400'>{item.price} x {item.quantity}</Text>
                  </Column>
                </Row>
              ))}
              <Hr />
              <Row>
                <Column className='w-2/5'>
                  <Text>Subtotal</Text>
                </Column>
                <Column className='text-right'>
                  <Text>{subtotal && formatter.format(subtotal / 100)}</Text>
                </Column>
              </Row>
              <Row>
                <Column className='w-2/5'>
                  <Text>Envío</Text>
                </Column>
                <Column className='text-right'>
                  <Text>{formatShipping(shippingTotal)}</Text>
                </Column>
              </Row>
              <Row>
                <Column className='w-2/5'>
                  <Text className='text-xl'>Total</Text>
                </Column>
                <Column className='text-right'>
                  <Text className='text-xl'>{total && formatter.format(total / 100)}</Text>
                </Column>
              </Row>
            </Section>
            <Hr className='border-neutral-500' />
            <Section>
              <h3 className='text-neutral-300 font-semibold'>Envío</h3>
              <Row>
                <Column className='w-1/2 align-top'>
                  <Text className='text-neutral-300 font-semibold text-base'>Dirección de envío</Text>
                  <Text>Nombre: {shippingAddress?.first_name} {shippingAddress?.last_name}</Text>
                  <Text>Dirección: {shippingAddress?.address_1} - {shippingAddress?.city}, {shippingAddress?.province} - CP: {shippingAddress?.postal_code}</Text>
                </Column>
              </Row>
            </Section>
            <Section className='text-center my-12'>
              <Button className='bg-neutral-800 text-white px-4 py-2' href={`https://www.fernandagutierrez.com.ar/order/confirmed/${id}`}>Ver pedido</Button>
            </Section>
            <Footer />
          </Container>
        </Section>
      </Tailwind>
    </Html>
  )
}
