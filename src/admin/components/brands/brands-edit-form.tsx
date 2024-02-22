import { Button, Drawer, Heading, Input } from '@medusajs/ui'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useAdminCustomPost } from 'medusa-react'
import { type Brand } from 'src/models/brand'
import useNotification from '../../hooks/use-notification'

interface BrandForm {
  name: string
  handle: string
}

type BrandRequest = BrandForm
interface BrandResponse {
  brand: Brand
}

interface Props {
  brand: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BrandsEditForm ({ brand, open, onOpenChange }: Props) {
  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<BrandForm>({
    defaultValues: brand
  })
  const customPost = useAdminCustomPost<BrandRequest, BrandResponse>(
    `/brands/${brand.id}`,
    ['brands']
  )
  const notification = useNotification()

  const onSubmit: SubmitHandler<BrandForm> = (data) => {
    console.log(data)
    customPost.mutate(data, {
      onSuccess: (res) => {
        reset(res.brand)
        notification(
          'Brand updated',
          `Successfully updated ${res.brand.name}`,
          'success'
        )
        onOpenChange(false)
      }
    })
  }

  return (
    <form>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit Brand</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="w-full">
            <Heading level="h2" className='text-grey-40'>{brand.name}</Heading>
            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <label className="text-grey-50 font-semibold text-small">Name <small className="text-rose-50">*</small></label>
                <Input {...register('name', {
                  required: true

                })} />
                {errors.name && <span className="text-rose-50 py block text-small">This field is required</span>}
              </div>

              <div>
                <label className="text-grey-50 font-semibold text-small">Handle <small className="text-rose-50">*</small></label>
                <Input {...register('handle', {
                  required: true
                })} />
                {errors.handle && <span className="text-rose-50 py block text-small">This field is required</span>}
              </div>

            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Button
              size="base"
              variant="secondary"
              onClick={() => { onOpenChange(false) }}
            >
              Close
            </Button>
            <Button
              size="base"
              variant="primary"
              disabled={!isDirty}
              onClick={handleSubmit(onSubmit)}
            >
              Save and close
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </form>
  )
}
