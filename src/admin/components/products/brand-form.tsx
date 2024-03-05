import { Button, FocusModal, Heading, Select } from '@medusajs/ui'
import { useState, type ReactNode } from 'react'
import useNotification from '../../hooks/use-notification'
import { useAdminCustomQuery, useAdminUpdateProduct } from 'medusa-react'
import { type Brand } from 'src/models/brand'
import { type Product } from 'src/models/product'

interface Props {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BrandForm ({ product, open, onOpenChange }: Props): ReactNode {
  const [brand, setBrand] = useState<string>(product.brand_id ?? '')
  const notification = useNotification()
  const { data } = useAdminCustomQuery<{ brands: Brand[] }>('/brands', ['brands'])
  const { brands } = data || {}

  const updateProduct = useAdminUpdateProduct(
    product.id
  )

  const handleSubmit = (): void => {
    if (!brand) return
    updateProduct.mutate({
      // @ts-expect-error brand_id is not in the original type
      brand_id: brand
    }, {
      onSuccess: ({ product }) => {
        notification(
          'Product updated',
          `Successfully updated ${product.title}`,
          'success'
        )
        onOpenChange(false)
      }
    })
  }

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content className='max-w-xl mx-auto'>
        <FocusModal.Header>
          <Button
            size="base"
            variant="secondary"
            onClick={handleSubmit}
          >
            Save and close
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className="mx-5">
          <form>
            <Heading level="h2" className='text-grey-40'>Brand</Heading>
            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <label className="text-grey-50 font-semibold text-small">Name <small className="text-rose-50">*</small></label>
                <Select onValueChange={setBrand} value={brand}>
                  <Select.Trigger>
                    <Select.Value placeholder="Select a brand" />
                  </Select.Trigger>
                  <Select.Content>
                    {brands?.map((item) => (
                      <Select.Item key={item.id} value={item.id}>
                        {item.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
            </div>
          </form>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}
