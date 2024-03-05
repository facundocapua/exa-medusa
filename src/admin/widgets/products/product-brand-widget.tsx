import type { WidgetConfig, ProductDetailsWidgetProps } from '@medusajs/admin'
import { Container, DropdownMenu, IconButton, useToggleState } from '@medusajs/ui'
import { type ReactNode } from 'react'
import BrandForm from '../../components/products/brand-form'
import SectionTitle from '../../components/ui/section-title'
import { EllipsisHorizontal, PencilSquare } from '@medusajs/icons'

const ProductBrandWidget = ({ product }: ProductDetailsWidgetProps): ReactNode => {
  const [state, open, close] = useToggleState()
  return (
    <>
      <BrandForm product={product} open={state} onOpenChange={(modalOpened) => {
        if (!modalOpened) {
          close()
        }
      }} />

      <Container>
        <header className="flex justify-between items-center">
          <SectionTitle>Brand</SectionTitle>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton variant='transparent'>
                <EllipsisHorizontal />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className='gap-2'>
              <DropdownMenu.Item
                className='flex items-center gap-1'
                onClick={open}
              >
                <PencilSquare />
                Edit Information
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>

        </header>
        <main className="flex flex-col gap-y-3 mt-8">
          <div className='flex items-center justify-between text-grey-50'>
            <p>Brand</p>
            <p>{product.brand?.name}</p>
          </div>
        </main>
      </Container>
    </>
  )
}

export const config: WidgetConfig = {
  zone: 'product.details.after'
}

export default ProductBrandWidget
