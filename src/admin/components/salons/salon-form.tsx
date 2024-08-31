import { Heading, Input, Select } from '@medusajs/ui'
import { type UseFormRegister, type FieldPath, Controller } from 'react-hook-form'
import { useAdminSalesChannels } from 'medusa-react'
import { type ReactNode } from 'react'
import { type SalonFormType } from './types'

interface DayInputsProps {
  label: string
  register: UseFormRegister<SalonFormType>
  openInput: FieldPath<SalonFormType>
  closeInput: FieldPath<SalonFormType>
}

const DayInputs = ({ label, register, openInput, closeInput }: DayInputsProps) => {
  return (
    <div>
      <label className="text-grey-50 font-semibold text-small">{label}</label>
      <div className='flex gap-4'>
        <Input type='time' size='small' step={1800} {...register(openInput)} />
        <span className='text-xl'> - </span>
        <Input type='time' size='small' step={1800} {...register(closeInput)} />
      </div>
    </div>
  )
}

interface Props {
  title: string
  register: UseFormRegister<SalonFormType>
  errors: any
  control: any
}

export default function SalonForm ({ title, register, errors, control }: Props): ReactNode {
  const { sales_channels: salesChannels, isLoading } = useAdminSalesChannels()

  return (
    <section className='grid grid-cols-2 gap-8'>
      <div>
        <Heading level="h2" className='text-grey-40'>{title}</Heading>
        <div className="grid grid-cols-2 gap-4 w-full my-4">
          <div>
            <label className="text-grey-50 font-semibold text-small">Name <small className="text-rose-50">*</small></label>
            <Input {...register('name', {
              required: true
            })} />
            {errors.name && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">Website <small className="text-rose-50">*</small></label>
            <Input {...register('website', {
              required: true
            })} />
            {errors.website && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">Phone <small className="text-rose-50">*</small></label>
            <Input {...register('phone', {
              required: true
            })} />
            {errors.phone && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">Email <small className="text-rose-50">*</small></label>
            <Input {...register('email', {
              required: true
            })} />
            {errors.email && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>
        </div>
        <Heading level="h2" className='mt-8'>Google Maps</Heading>
        <hr />
        <div className="grid grid-cols-2 gap-4 w-full my-4">
          <div>
            <label className="text-grey-50 font-semibold text-small">Latitude <small className="text-rose-50">*</small></label>
            <Input {...register('lat', {
              required: true
            })} />
            {errors.lat && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">Longitude <small className="text-rose-50">*</small></label>
            <Input {...register('lng', {
              required: true
            })} />
            {errors.lng && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">Map <small className="text-rose-50">*</small></label>
            <Input {...register('map', {
              required: true
            })} />
            {errors.map && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">Map link <small className="text-rose-50">*</small></label>
            <Input {...register('map_link', {
              required: true
            })} />
            {errors.map_link && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>

        </div>

        <Heading level="h2" className='mt-8'>Social Networks</Heading>
        <hr />
        <div className="grid grid-cols-2 gap-4 w-full my-4">
          <div>
            <label className="text-grey-50 font-semibold text-small">Facebook</label>
            <Input {...register('social_networks.facebook')} />
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">Instagram</label>
            <Input {...register('social_networks.instagram')} />
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">Tiktok</label>
            <Input {...register('social_networks.tiktok')} />
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">Whatsapp</label>
            <Input {...register('social_networks.whatsapp')} />
          </div>
        </div>

        <Heading level="h2" className='mt-8'>Medusa Settings</Heading>
        <hr />
        <div className="grid grid-cols-2 gap-4 w-full my-4">
          <div>
            <label className="text-grey-50 font-semibold text-small">Email From</label>
            <Input {...register('medusa_settings.email_from')} />
          </div>
          <div>
            <label className="text-grey-50 font-semibold text-small">Mercado Pago Success URL</label>
            <Input {...register('medusa_settings.mercadopago_success_backurl')} />
          </div>
          <div>
            <label className="text-grey-50 font-semibold text-small">New Order Template</label>
            <Input {...register('medusa_settings.order_placed_template')} />
          </div>
          <div>
            <label className="text-grey-50 font-semibold text-small">Order Shipped Template</label>
            <Input {...register('medusa_settings.order_shipped_template')} />
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">Sales Channel Id</label>
            {!isLoading && (
              <Controller
                  control={control}
                  name="sales_channel_id"
                  render={({ field }) => {
                    return (
                      <Select onValueChange={field.onChange} {...field}>
                        <Select.Trigger>
                          <Select.Value placeholder="Select a sales channel" />
                        </Select.Trigger>
                        <Select.Content>
                          {salesChannels?.map((item) => (
                            <Select.Item key={item.id} value={item.id}>
                              {item.name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    )
                  }}
              />
            )}

            {errors.map_link && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>
        </div>
      </div>

      <div>
        <Heading level="h2" className='mt-8'>Address</Heading>
        <hr />
        <div className="grid grid-cols-2 gap-4 w-full my-4">
          <div>
            <label className="text-grey-50 font-semibold text-small">Address <small className="text-rose-50">*</small></label>
            <Input {...register('address', {
              required: true
            })} />
            {errors.address && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">City <small className="text-rose-50">*</small></label>
            <Input {...register('city', {
              required: true
            })} />
            {errors.city && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>

          <div>
            <label className="text-grey-50 font-semibold text-small">State <small className="text-rose-50">*</small></label>
            <Input {...register('state', {
              required: true
            })} />
            {errors.state && <span className="text-rose-50 py block text-small">This field is required</span>}
          </div>
        </div>

        <Heading level="h2" className='mt-8'>Hours</Heading>
        <hr />
        <div className="grid grid-cols-3 gap-4 w-full my-4">
          <DayInputs label='Monday' register={register} openInput='hours.mon.open' closeInput='hours.mon.close' />
          <DayInputs label='Tuesday' register={register} openInput='hours.tue.open' closeInput='hours.tue.close' />
          <DayInputs label='Wednesday' register={register} openInput='hours.wed.open' closeInput='hours.wed.close' />
          <DayInputs label='Thursday' register={register} openInput='hours.thu.open' closeInput='hours.thu.close' />
          <DayInputs label='Friday' register={register} openInput='hours.fri.open' closeInput='hours.fri.close' />
          <DayInputs label='Saturday' register={register} openInput='hours.sat.open' closeInput='hours.sat.close' />
          <DayInputs label='Sunday' register={register} openInput='hours.sun.open' closeInput='hours.sun.close' />
        </div>
      </div>
    </section>
  )
}
