import { Button, Drawer, Heading } from '@medusajs/ui'
import { useForm, type SubmitHandler, useFieldArray, type FieldArrayWithId } from 'react-hook-form'
import { useAdminCustomPost, useAdminUploadFile } from 'medusa-react'
import { type Brand } from 'src/models/brand'
import useNotification from '../../hooks/use-notification'
import { type FormImage } from '../../types/images'
import FileUploadField from '../ui/file-upload-field'
import { Trash } from '@medusajs/icons'
import Actionables, { type ActionType } from '../ui/actionables'
import { prepareImages } from '../../utils/images'

interface BrandForm {
  logo: FormImage[]
}

interface BrandRequest {
  logo: Brand['logo']
}
interface BrandResponse {
  brand: Brand
}

interface Props {
  brand: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BrandsEditLogo ({ brand, open, onOpenChange }: Props) {
  const { control, handleSubmit, formState: { isDirty }, reset } = useForm<BrandForm>({
    defaultValues: {
      logo: [
        {
          url: brand.logo ?? '',
          name: '',
          size: 0
        }
      ]
    }
  })
  const customPost = useAdminCustomPost<BrandRequest, BrandResponse>(
    `/brands/${brand.id}`,
    ['brands']
  )
  const uploadFile = useAdminUploadFile()
  const notification = useNotification()

  const { fields, remove, replace, append } = useFieldArray({
    control,
    name: 'logo'
  })

  const onSubmit: SubmitHandler<BrandForm> = async (data) => {
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

      const payload = {
        logo: urls[0]
      }

      customPost.mutate(payload, {
        onSuccess: (res) => {
          reset({
            logo: [{
              url: res.brand.logo
            }]
          })
          notification(
            'Brand updated',
            `Successfully updated ${res.brand.name}`,
            'success'
          )
          onOpenChange(false)
        }
      })
    }
  }

  const handleFilesChosen = (files: File[]) => {
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
      <Drawer open={open} onOpenChange={onOpenChange}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit Brand Logo</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="w-full">
            <Heading level="h2" className='text-grey-40'>{brand.name}</Heading>
            <div className="flex flex-col gap-y-4 mt-4">
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

interface ThumbnailProps {
  image: FieldArrayWithId<BrandForm, 'logo', 'id'>
  index: number
  remove: (index: number) => void
}

const Image = ({ image, index, remove }: ThumbnailProps) => {
  const actions: ActionType[] = [
    {
      label: 'Delete',
      onClick: () => { remove(index) },
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
