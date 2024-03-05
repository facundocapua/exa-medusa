import { EllipsisHorizontal, EyeSlashMini, PencilSquare, Trash } from '@medusajs/icons'
import { DropdownMenu, IconButton, Prompt, useToggleState } from '@medusajs/ui'
import { useAdminCustomDelete, useAdminCustomPost } from 'medusa-react'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import useNotification from '../../hooks/use-notification'
import { Brand } from '../../../models/brand'

export default function BrandItemActions ({ brand }: {brand: Brand}): ReactNode {
  const [state, open, close] = useToggleState()
  const navigate = useNavigate()
  const notification = useNotification()
  const brandPost = useAdminCustomPost<Partial<Brand>, {brand: Brand}>(
    `/brands/${brand.id}`,
    ['brands']
  )
  const brandDelete = useAdminCustomDelete(`/brands/${brand.id}`, ['brands'])
  const handleChangeStatus = (status: boolean): void => {
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

  const handleDelete = (): void => {
    close()
    brandDelete.mutate(undefined, {
      onSuccess: () => {
        notification('Brand deleted', `Successfully deleted ${brand.name}`, 'success')
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className='gap-2'>
          <DropdownMenu.Item
            className='flex items-center gap-1'
            onClick={() => { navigate(`/a/brands/${brand.id}`) }}
          >
            <PencilSquare />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className='flex items-center gap-1'
            onClick={() => { handleChangeStatus(!brand.is_active) }}
          >
            <EyeSlashMini />
            {brand.is_active ? 'Unpublish' : 'Publish'}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className='flex items-center gap-1 text-red-500'
            onClick={open}
          >
            <Trash />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <Prompt open={state}>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>Delete brand</Prompt.Title>
            <Prompt.Description>Are you sure?</Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={close}>Cancel</Prompt.Cancel>
            <Prompt.Action onClick={handleDelete}>Delete</Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>

  )
}
