import { Button, FocusModal, Heading, Input, Switch } from '@medusajs/ui'
import { useForm, type SubmitHandler, useFieldArray, type FieldArrayWithId, Controller } from 'react-hook-form'
import { useAdminCustomPost, useAdminUploadFile } from 'medusa-react'
import { type Brand } from 'src/models/brand'
import FileUploadField from '../ui/file-upload-field'
import Actionables, { type ActionType } from '../ui/actionables'
import { Trash } from '@medusajs/icons'
import { type FormImage } from '../../types/images'
import { prepareImages } from '../../utils/images'
import useNotification from '../../hooks/use-notification'
import { type ReactNode } from 'react'

interface NewBrandForm {
  name: string
  handle: string
  logo: FormImage[]
  is_featured: boolean
  is_active?: boolean
}

export interface BrandRequest {
  name: string
  handle: string
  is_featured: boolean
  is_active?: boolean
  logo?: string

}
interface BrandResponse {
  brand: Brand
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const createBlank = (): NewBrandForm => {
  return {
    name: '',
    handle: '',
    logo: [],
    is_featured: true
  }
}

export default function BrandsForm ({ open, onOpenChange }: Props): ReactNode {
  const { control, register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<NewBrandForm>({
    defaultValues: createBlank()
  })
  const customPost = useAdminCustomPost<BrandRequest, BrandResponse>(
    '/brands',
    ['brands']
  )

  const uploadFile = useAdminUploadFile()
  const notification = useNotification()

  const { fields, remove, replace, append } = useFieldArray({
    control,
    name: 'logo'
  })

  const onSubmit: SubmitHandler<NewBrandForm> = async (data) => {
    const payload: BrandRequest = {
      name: data.name,
      handle: data.handle,
      is_featured: data.is_featured,
      is_active: data.is_active
    }
    if (data.logo?.length) {
      let preppedImages: FormImage[] = []

      try {
        preppedImages = await prepareImages(data.logo, uploadFile)
      } catch (error) {
        let errorMessage = 'Something went wrong while trying to upload the thumbnail.'
        const response = (error).response as Response

        if (response.status === 500) {
          errorMessage =
            errorMessage +
            ' ' +
            'You might not have a file service configured. Please contact your administrator'
        }

        // notification(t('new-error', 'Error'), errorMessage, 'error')
        notification(
          'Brand creation error',
          errorMessage,
          'error'
        )
        return
      }
      const urls = preppedImages.map((image) => image.url)

      payload.logo = urls[0]
    }
    customPost.mutate(payload, {
      onSuccess: (res) => {
        console.log(res)
        onOpenChange(false)
        notification(
          'Brand created',
          `Successfully create ${res.brand.name}`,
          'success'
        )
        reset(createBlank())
      }
    })
  }

  const handleFilesChosen = (files: File[]): void => {
    const toAppend = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      nativeFile: file,
      selected: false
    }))

    if (files.length) {
      replace(toAppend)
    } else {
      append(toAppend)
    }
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
                Save brand
              </Button>
            </div>
          </FocusModal.Header>
          <FocusModal.Body className="small:w-4/5 medium:w-7/12 large:w-6/12 max-w-[700px] mx-auto mt-12">
            <Heading level="h2">General</Heading>
            <hr />

            <div className="grid grid-cols-2 gap-4 w-full my-4">
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

              <div className='flex items-center gap-1'>
                  <Controller
                    control={control}
                    name="is_featured"
                    render={({ field: { value, onChange } }) => {
                      return <Switch id='is_featured' checked={value} onCheckedChange={onChange} />
                    }}
                  />
                <label className="text-grey-50 font-semibold text-small" htmlFor="is_featured">Featured</label>
              </div>
            </div>
            <div>
              <Heading level="h2">Logo</Heading>
              <hr />
              <div className="mt-large">
                <FileUploadField
                  onFileChosen={handleFilesChosen}
                  placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
                  filetypes={['image/gif', 'image/jpeg', 'image/png', 'image/webp']}
                  className="py-large"
                />
              </div>
              {fields.length > 0 && (
                <div className="mt-large">
                  <h2 className="inter-large-semibold mb-small">Upload</h2>

                  <div className="gap-y-2xsmall flex flex-col">
                    {fields.map((field, index) => {
                      return (
                        <Image
                          key={field.id}
                          image={field}
                          index={index}
                          remove={remove}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </form>
  )
}

interface ThumbnailProps {
  image: FieldArrayWithId<NewBrandForm, 'logo', 'id'>
  index: number
  remove: (index: number) => void
}

const Image = ({ image, index, remove }: ThumbnailProps): ReactNode => {
  const actions: ActionType[] = [
    {
      label: 'Delete',
      onClick: (): void => { remove(index) },
      icon: <Trash />,
      variant: 'danger'
    }
  ]

  return (
    <div className="px-base py-xsmall hover:bg-grey-5 rounded-rounded group flex items-center justify-between">
      <div className="gap-x-large flex items-center">
        <div className="flex h-16 w-16 items-center justify-center">
          <img
            src={image.url}
            alt={image.name ?? 'Uploaded image'}
            className="rounded-rounded max-h-[64px] max-w-[64px]"
          />
        </div>
        <div className="inter-small-regular flex flex-col text-left">
          <p>{image.name}</p>
          <p className="text-grey-50">
            {image.size ? `${(image.size / 1024).toFixed(2)} KB` : ''}
          </p>
        </div>
      </div>

      <Actionables actions={actions} forceDropdown />
    </div>
  )
}
