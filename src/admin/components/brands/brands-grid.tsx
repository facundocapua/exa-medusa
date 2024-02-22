import { DropdownMenu, IconButton, Table } from '@medusajs/ui'
import { useAdminCustomQuery } from 'medusa-react'
import { type Brand } from 'src/models/brand'
import { EllipsisHorizontal, EyeSlashMini, PencilSquare, Trash } from '@medusajs/icons'
import { useNavigate } from 'react-router-dom'

interface BrandResponse {
  brands: Brand[]
}

export default function BrandsGrid () {
  const { data, isLoading } = useAdminCustomQuery<BrandResponse>('/brands', ['brands'])
  const navigate = useNavigate()

  if (isLoading) return (<div>Loading...</div>)

  if (!data || data.brands.length === 0) return (<div>No data</div>)

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Handle</Table.HeaderCell>
          <Table.HeaderCell className='w-[32px]'></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
      {
        data.brands.map((brand) => (
          <Table.Row key={brand.id}>
            <Table.Cell>{brand.name}</Table.Cell>
            <Table.Cell>{brand.handle}</Table.Cell>
            <Table.Cell className='w-[32px]'>
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
                  <DropdownMenu.Item className='flex items-center gap-1'>
                    <EyeSlashMini />
                    Unpublish
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className='flex items-center gap-1 text-red-500'>
                    <Trash />
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </Table.Cell>
          </Table.Row>
        ))
      }
      </Table.Body>
    </Table>
  )
}
