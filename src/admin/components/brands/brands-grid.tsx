import { Table } from '@medusajs/ui'
import { useAdminCustomQuery } from 'medusa-react'
import { type Brand } from 'src/models/brand'
import { type ReactNode } from 'react'
import BrandItemActions from './brands-item-actions'
import clsx from 'clsx'

interface BrandResponse {
  brands: Brand[]
}

export default function BrandsGrid (): ReactNode {
  const { data, isLoading } = useAdminCustomQuery<BrandResponse>('/brands', ['brands'])

  if (isLoading) return (<div>Loading...</div>)

  if (!data || data.brands.length === 0) return (<div>No data</div>)

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Handle</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Featured</Table.HeaderCell>
          <Table.HeaderCell className='w-[32px]'></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
      {
        data.brands.map((brand) => (
          <Table.Row key={brand.id}>
            <Table.Cell>
              {brand.logo ? <img src={brand.logo} width="60" /> : brand.name}
            </Table.Cell>
            <Table.Cell>{brand.handle}</Table.Cell>
            <Table.Cell>
              <div className='flex items-center gap-2'>
                <div className={clsx(
                  'h-1.5 w-1.5 self-center rounded-full',
                  { 'bg-emerald-40': brand.is_active },
                  { 'bg-grey-40': !brand.is_active }
                )}></div>
                <span className='inter-small-regular text-xs'>{brand.is_active ? 'Published' : 'Unpublished'}</span>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className='flex items-center gap-2'>
                <div className={clsx(
                  'h-1.5 w-1.5 self-center rounded-full',
                  { 'bg-emerald-40': brand.is_featured },
                  { 'bg-grey-40': !brand.is_featured }
                )}></div>
                <span className='inter-small-regular text-xs'>{brand.is_featured ? 'Featured' : 'Not featured'}</span>
              </div>
            </Table.Cell>
            <Table.Cell className='w-[32px]'>
              <BrandItemActions brand={brand} />
            </Table.Cell>
          </Table.Row>
        ))
      }
      </Table.Body>
    </Table>
  )
}
