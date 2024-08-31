import { Button, FocusModal } from '@medusajs/ui'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useAdminCustomPost } from 'medusa-react'
import { type Salon } from '../../../models/salon'
import { type ReactNode } from 'react'
import { type RouteProps } from '@medusajs/admin'
import { type hours, type SalonFormType } from './types'
import SalonForm from './salon-form'

export interface SalonRequest {
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
}
interface SalonResponse {
  salon: Salon
}

type Props = RouteProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const createBlank = (): SalonFormType => {
  return {
    name: '',
    lat: '',
    lng: '',
    address: '',
    city: '',
    state: '',
    hours: {},
    website: '',
    social_networks: {},
    map: '',
    phone: '',
    email: '',
    map_link: '',
    medusa_settings: {
    },
    sales_channel_id: ''
  }
}

export const SalonNewForm = ({ open, onOpenChange, notify }: Props): ReactNode => {
  const { register, handleSubmit, formState: { errors, isDirty }, reset, control } = useForm<SalonFormType>({
    defaultValues: createBlank()
  })
  const customPost = useAdminCustomPost<SalonRequest, SalonResponse>(
    '/salons',
    ['salons']
  )

  const onSubmit: SubmitHandler<SalonFormType> = async (data) => {
    const payload: SalonRequest = {
      ...data
    }
    customPost.mutate(payload, {
      onSuccess: (res) => {
        console.log(res)
        onOpenChange(false)
        notify.success(
          'Salon created',
          `Successfully create ${res.salon.name}`
        )
        reset(createBlank())
      }
    })
  }

  return (
    <form>
      <FocusModal open={open} onOpenChange={onOpenChange}>
        <FocusModal.Content>
          <FocusModal.Header>
            <div className='flex gap-4'>
              <Button
                size="base"
                variant="secondary"
                disabled={!isDirty}
                onClick={handleSubmit((data) => onSubmit({ ...data, is_active: false }))}
              >
                Save draft
              </Button>
              <Button
                size="base"
                variant="primary"
                disabled={!isDirty}
                onClick={handleSubmit((data) => onSubmit({ ...data, is_active: true }))}
              >
                Save salon
              </Button>
            </div>
          </FocusModal.Header>
          <FocusModal.Body className="fixed flex justify-center items-center overflow-y-auto my-4 w-full bottom-[40px] top-[70px]">
            <SalonForm
              title='New Salon'
              register={register}
              errors={errors}
              control={control}
            />
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </form>
  )
}

export default SalonNewForm
