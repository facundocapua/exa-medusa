import { Button, Drawer } from '@medusajs/ui'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useAdminCustomPost } from 'medusa-react'
import useNotification from '../../hooks/use-notification'
import { type ReactNode } from 'react'
import { type SalonFormType } from './types'
import { type Salon } from 'src/models/salon'
import SalonForm from './salon-form'

type SalonRequest = SalonFormType
interface SalonResponse {
  salon: Salon
}

interface Props {
  salon: Salon
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SalonEditForm ({ salon, open, onOpenChange }: Props): ReactNode {
  const { register, handleSubmit, formState: { errors, isDirty }, reset, control } = useForm<SalonFormType>({
    defaultValues: salon as SalonFormType
  })
  const customPost = useAdminCustomPost<SalonRequest, SalonResponse>(
    `/salons/${salon.id}`,
    ['salons']
  )

  const notification = useNotification()

  const onSubmit: SubmitHandler<SalonFormType> = (data) => {
    customPost.mutate(data, {
      onSuccess: (res) => {
        reset(res.salon as SalonFormType)
        notification(
          'Salon updated',
          `Successfully updated ${res.salon.name}`,
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
            <Drawer.Title>Edit Salon</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="w-full overflow-y-auto">
            <SalonForm
              title={salon.name}
              register={register}
              errors={errors}
              control={control}
            />
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
