import { Container, DropdownMenu, Heading, IconButton, useToggleState } from '@medusajs/ui'
import BackButton from '../../../components/ui/back-button'
import { EllipsisHorizontal, PencilSquare, Trash } from '@medusajs/icons'
import SectionTitle from '../../../components/ui/section-title'
import Spinner from '../../../components/ui/spinner'
import { useParams } from 'react-router-dom'
import { useAdminCustomPost, useAdminCustomQuery } from 'medusa-react'
import StatusSelector from '../../../components/shared/status-selector'
import useNotification from '../../../hooks/use-notification'
import { type ReactNode } from 'react'
import { type Salon } from 'src/models/salon'
import SalonEditForm from '../../../components/salons/salon-edit-form'
import { capitalize } from '../../../utils/strings'

interface SalonResponse {
  salon: Salon
}

interface Hour { open: string, close: string }

type SocialNetworks = Record<string, string>

const printHours = (day: string, hours: Hour | null): ReactNode => {
  return (
    <article className='flex justify-between'>
      <p>{day}</p>
      <p>{hours ? (<>{hours.open} - {hours.close}</>) : '-'}</p>
    </article>
  )
}

const printMedusaSettings = (settings: Record<string, string>): ReactNode => {
  if (Object.keys(settings).length === 0) {
    return <p>No settings</p>
  }

  return (Object.entries(settings).map((data: string[]) => (
    <div key={data[0]} className='flex flex-col'>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */}
      <p className='text-neutral-800'>{capitalize((data[0]).replaceAll('_', ' '))}</p>
      <p className='text-grey-50'>{data[1] ?? 'N/A'}</p>
    </div>
  )))
}

const SalonsEditPage = (): ReactNode => {
  const [state, open, close] = useToggleState()
  const { id } = useParams()
  const { data, isLoading } = useAdminCustomQuery<SalonResponse>(`/salons/${id}`, ['salons'])

  const notification = useNotification()
  const salonPost = useAdminCustomPost<Partial<Salon>, SalonResponse>(
    `/salons/${id}`,
    ['salons']
  )
  const onStatusChange = (status: boolean): void => {
    salonPost.mutate({ is_active: status }, {
      onSuccess: (res) => {
        notification(
          status ? 'Salon published' : 'Salon unpublished',
          `Successfully ${status ? 'published' : 'unpublished'} ${res.salon.name}`,
          'success'
        )
      }
    })
  }

  if (isLoading || !data?.salon) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  const { salon } = data

  return (
    <>
      <SalonEditForm salon={salon} open={state} onOpenChange={(modalOpened) => {
        if (!modalOpened) {
          close()
        }
      }} />

      <BackButton url='/a/salons'>Back to salons</BackButton>
      <div className='grid grid-cols-3 gap-4'>
        <Container className='col-span-2'>
          <header className="flex justify-between items-center">
            <SectionTitle>{salon.name}</SectionTitle>
            <div className='flex gap-4'>
              <StatusSelector
                isDraft={!salon.is_active}
                activeState='Published'
                draftState='Draft'
                onChange={() => { onStatusChange(!salon.is_active) }}
              />
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
                  <DropdownMenu.Item className='flex items-center gap-1 text-red-500'>
                    <Trash />
                    Delete salon
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex flex-col gap-y-3 mt-8">
            <Heading level="h2">Details</Heading>
            <div className='flex items-center justify-between text-grey-50'>
              <p>Website</p>
              {salon.website ? (<a href={salon.website} target='_blank' rel="noreferrer">{salon.website}</a>) : 'N/A'}
            </div>
            <div className='flex items-center justify-between text-grey-50'>
              <p>Phone</p>
              <p>{salon.phone ?? 'N/A'}</p>
            </div>
            <div className='flex items-center justify-between text-grey-50'>
              <p>Email</p>
              <p>{salon.email ?? 'N/A'}</p>
            </div>
            {salon.social_networks && (
              <>
                {Object.entries(salon.social_networks as SocialNetworks).map((data) => (
                <div key={data[0]} className='flex items-center justify-between text-grey-50'>
                  <p>{capitalize(data[0])}</p>
                  {data[1] ? (<a href={data[1]} target='_blank' rel='noreferrer'>{data[1]}</a>) : 'N/A'}
                </div>
                ))}
              </>
            )}

            <hr />

            <Heading level="h2">Address</Heading>
            <div className='flex items-center justify-between text-grey-50'>
              <p>Address</p>
              <p>{salon.address} - {salon.city}, {salon.state}</p>
            </div>
            <div className='flex items-center justify-between text-grey-50'>
              <p>Coordinates</p>
              <a href={`https://www.google.com/maps/place/${salon.lat},${salon.lng}`} target='_blank' rel="noreferrer">Latitude {salon.lat} - Longitude {salon.lng}</a>
            </div>
            {salon.map && (
              <div className='flex items-center justify-between text-grey-50'>
                <div className='w-full' dangerouslySetInnerHTML={{ __html: salon.map }} />
              </div>
            )}
          </main>
        </Container>
        <Container>
          <header className="flex justify-between items-center">
            <SectionTitle>Hours</SectionTitle>
          </header>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {salon.hours
              ? (
              <>
                {printHours('Monday', salon.hours.mon as Hour)}
                {printHours('Tuesday', salon.hours.tue as Hour)}
                {printHours('Wednesday', salon.hours.wed as Hour)}
                {printHours('Thursday', salon.hours.thu as Hour)}
                {printHours('Friday', salon.hours.fri as Hour)}
                {printHours('Saturday', salon.hours.sat as Hour)}
                {printHours('Sunday', salon.hours.sun as Hour)}
              </>
                )
              : 'N/A'
            }

          </div>
          <hr className='my-4' />
          <header className="flex justify-between items-center">
            <SectionTitle>Settings</SectionTitle>
          </header>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {salon.medusa_settings && printMedusaSettings(salon.medusa_settings as Record<string, string>)}
            <div className='flex flex-col'>
              <p className='text-neutral-800'>Sales Channel Id</p>
              <p className='text-grey-50'>{salon.sales_channel_id ?? 'N/A'}</p>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default SalonsEditPage
