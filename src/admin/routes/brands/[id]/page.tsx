import { Container, DropdownMenu, Heading, IconButton, useToggleState } from '@medusajs/ui'
import BackButton from '../../../components/ui/back-button'
import { EllipsisHorizontal, PencilSquare, Trash } from '@medusajs/icons'
import SectionTitle from '../../../components/ui/section-title'
import Spinner from '../../../components/ui/spinner'
import { useParams } from 'react-router-dom'
import { useAdminCustomPost, useAdminCustomQuery } from 'medusa-react'
import { type Brand } from 'src/models/brand'
import BrandsEditForm from '../../../components/brands/brands-edit-form'
import BrandsEditLogo from '../../../components/brands/brands-edit-logo'
import clsx from 'clsx'
import StatusSelector from '../../../components/shared/status-selector'
import useNotification from '../../../hooks/use-notification'
import { type ReactNode } from 'react'

interface BrandResponse {
  brand: Brand
}

const BrandsEditPage = (): ReactNode => {
  const [state, open, close] = useToggleState()
  const [stateLogoEdit, openLogoEdit, closeLogoEdit] = useToggleState()
  const { id } = useParams()
  const { data, isLoading } = useAdminCustomQuery<BrandResponse>(`/brands/${id}`, ['brand'])

  const notification = useNotification()
  const brandPost = useAdminCustomPost<Partial<Brand>, BrandResponse>(
    `/brands/${id}`,
    ['brands']
  )
  const onStatusChange = (status: boolean): void => {
    brandPost.mutate({ is_active: status }, {
      onSuccess: (res) => {
        notification(
          status ? 'Brand published' : 'Brand unpublished',
          `Successfully ${status ? 'published' : 'unpublished'} ${res.brand.name}`,
          'success'
        )
      }
    })
  }

  if (isLoading || !data?.brand) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  const { brand } = data

  return (
    <>
      <BrandsEditForm brand={brand} open={state} onOpenChange={(modalOpened) => {
        if (!modalOpened) {
          close()
        }
      }} />

      <BrandsEditLogo brand={brand} open={stateLogoEdit} onOpenChange={(modalOpened) => {
        if (!modalOpened) {
          closeLogoEdit()
        }
      }} />
      <BackButton url='/a/brands'>Back to brands</BackButton>
      <div className='grid grid-cols-3 gap-4'>
        <Container className='col-span-2'>
          <header className="flex justify-between items-center">
            <SectionTitle>{brand.name}</SectionTitle>
            <div className='flex gap-4'>
              <StatusSelector
                isDraft={!brand.is_active}
                activeState='Published'
                draftState='Draft'
                onChange={() => { onStatusChange(!brand.is_active) }}
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
                    Delete brand
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex flex-col gap-y-3 mt-8">
            <Heading level="h2">Details</Heading>
            <div className='flex items-center justify-between text-grey-50'>
              <p>Slug</p>
              <p>{brand.handle}</p>
            </div>
            <div className='flex items-center justify-between text-grey-50'>
              <p>Is featured?</p>
              <p>{ brand.is_featured ? 'True' : 'False' }</p>
            </div>
          </main>
        </Container>
        <Container>
          <header className="flex justify-between items-center">
            <SectionTitle>Logo</SectionTitle>
            <div>
              <IconButton variant='transparent'>
                <PencilSquare onClick={openLogoEdit} />
              </IconButton>
            </div>
          </header>
          <div
            className={clsx('gap-xsmall mt-base grid grid-cols-3', {
              hidden: !brand.logo
            })}
          >
            {brand.logo && (
              <div className="flex aspect-square items-center justify-center">
                <img
                  src={brand.logo}
                  alt={`Thumbnail for ${brand.name}`}
                  className="rounded-rounded max-h-full max-w-full object-contain"
                />
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  )
}

export default BrandsEditPage
