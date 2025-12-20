import { Link, Section, Text } from '@react-email/components'

export const Footer = () => {
  return (
    <>
      <Section>
        <Text className='text-center'>Si tienes alguna pregunta, por favor responde a este correo.</Text>
        <Text className='text-center'>Gracias por confiar en <Link href="https://www.fernandagutierrez.com.ar/" className='text-neutral-400'>Fer Gutierrez Makeup Studio</Link>.</Text>
      </Section>
    </>
  )
}
