import { type RouteProps, type RouteConfig } from '@medusajs/admin'
import { BuildingStorefront } from '@medusajs/icons'
import { Container, Heading, Button } from '@medusajs/ui'
import { type ReactNode, useState } from 'react'
import SalonsGrid from '../../components/salons/salons-grid'
import { SalonNewForm } from '../../components/salons/salon-new-form'

const SalonsPage = ({ notify }: RouteProps): ReactNode => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <SalonNewForm open={open} onOpenChange={setOpen} notify={notify} />
      <Container>
        <header className="flex justify-between items-center">
          <Heading level="h1">Salons</Heading>
          <Button variant="secondary" size="base" onClick={() => { setOpen(true) }}>Add salon</Button>
        </header>
        <main className="my-4">
          <SalonsGrid notify={notify} />
        </main>
      </Container>
    </>
  )
}

export const config: RouteConfig = {
  link: {
    label: 'Salons',
    icon: BuildingStorefront
  }
}

export default SalonsPage
