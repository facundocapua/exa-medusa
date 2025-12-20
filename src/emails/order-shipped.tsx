import { Html, Tailwind, Container, Section, Button } from '@react-email/components'
import { Header } from './components/header'
import { Footer } from './components/footer'

export default function OrderShippedEmail(props) {
  const {
    firstName,
    orderNumber,
    trackingCode
  } = props

  return (
    <Html lang="es" dir="ltr">
      <Tailwind>
        <Section className='bg-neutral-600 font-sans text-white'>
          <Container className='my-4 p-4 max-w-[600px]'>
            <Header title='¡Tu pedido está en camino!' />
            <Section>
              <p className='text-xl my-8'>Hola {firstName},</p>
              <p>Tu pedido <strong>#{orderNumber}</strong> fue despachado por Andreani y pronto lo recibirás en tu domicilio.</p>
              <p>El número de seguimiento es <strong>{trackingCode}</strong>.</p>
            </Section>
            <Section className='text-center my-12'>
              <Button className='bg-neutral-800 text-white px-4 py-2' href={`https://www.andreani.com/envio/${trackingCode}`}>Ver pedido</Button>
            </Section>
            <Footer />
          </Container>
        </Section>
      </Tailwind>
    </Html>
  )
}
