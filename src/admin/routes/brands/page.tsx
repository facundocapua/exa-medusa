import { type RouteConfig } from '@medusajs/admin'
import { Container, Heading, Button } from '@medusajs/ui'
import BrandsForm from '../../components/brands/brands-form'
import { useState } from 'react'
import BrandsGrid from '../../components/brands/brands-grid'

const BrandsPage = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <BrandsForm open={open} onOpenChange={setOpen} />
      <Container>
        <header className="flex justify-between items-center">
          <Heading level="h1">Brands</Heading>
          <Button variant="secondary" size="base" onClick={() => { setOpen(true) }}>Add brand</Button>
        </header>
        <main className="my-4">
          <BrandsGrid />
        </main>
      </Container>
    </>
  )
}

export const config: RouteConfig = {
  link: {
    label: 'Brands'
  }
}

export default BrandsPage
