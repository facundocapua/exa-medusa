import { EllipsisHorizontal, EyeSlashMini, PencilSquare, Trash } from '@medusajs/icons'
import { DropdownMenu, IconButton, Prompt, useToggleState } from '@medusajs/ui'
import { useAdminCustomDelete, useAdminCustomPost } from 'medusa-react'
import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { type Salon } from '../../../models/salon'
import { type RouteProps } from '@medusajs/admin'

type Props = RouteProps & {
  salon: Salon
}

export default function SalonItemActions ({ salon, notify }: Props): ReactNode {
  const [state, open, close] = useToggleState()
  const navigate = useNavigate()
  const salonPost = useAdminCustomPost<Partial<Salon>, { salon: Salon }>(
    `/salons/${salon.id}`,
    ['salons']
  )
  const salonDelete = useAdminCustomDelete(`/salons/${salon.id}`, ['salons'])
  const handleChangeStatus = (status: boolean): void => {
    salonPost.mutate({ is_active: status }, {
      onSuccess: (res) => {
        notify.success(
          status ? 'Salon published' : 'Salon unpublished',
          `Successfully ${status ? 'published' : 'unpublished'} ${res.salon.name}`
        )
      }
    })
  }

  const handleDelete = (): void => {
    close()
    salonDelete.mutate(undefined, {
      onSuccess: () => {
        notify.success('Salon deleted', `Successfully deleted ${salon.name}`)
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
            onClick={() => { navigate(`/a/salons/${salon.id}`) }}
          >
            <PencilSquare />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className='flex items-center gap-1'
            onClick={() => { handleChangeStatus(!salon.is_active) }}
          >
            <EyeSlashMini />
            {salon.is_active ? 'Unpublish' : 'Publish'}
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
            <Prompt.Title>Delete salon</Prompt.Title>
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
