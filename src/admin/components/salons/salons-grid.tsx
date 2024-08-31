import { Table } from '@medusajs/ui'
import { useAdminCustomQuery } from 'medusa-react'
import { type Salon } from 'src/models/salon'
import { type ReactNode } from 'react'
import SalonItemActions from './salon-item-actions'
import clsx from 'clsx'
import { type RouteProps } from '@medusajs/admin'

interface SalonResponse {
  salons: Salon[]
}

export default function SalonsGrid ({ notify }: RouteProps): ReactNode {
  const { data, isLoading } = useAdminCustomQuery<SalonResponse>('/salons', ['salons'])

  if (isLoading) return (<div>Loading...</div>)

  if (!data || data.salons.length === 0) return (<div>No data</div>)

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Web</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell className='w-[32px]'></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
      {
        data.salons.map((salon) => (
          <Table.Row key={salon.id}>
            <Table.Cell>{salon.name}</Table.Cell>
            <Table.Cell>
              {salon.website ? (<a href={salon.website} target='_blank' rel='noreferrer'>{salon.website}</a>) : 'N/A'}
            </Table.Cell>
            <Table.Cell>
              <div className='flex items-center gap-2'>
                <div className={clsx(
                  'h-1.5 w-1.5 self-center rounded-full',
                  { 'bg-emerald-40': salon.is_active },
                  { 'bg-grey-40': !salon.is_active }
                )}></div>
                <span className='inter-small-regular text-xs'>{salon.is_active ? 'Published' : 'Unpublished'}</span>
              </div>
            </Table.Cell>
            <Table.Cell className='w-[32px]'>
              <SalonItemActions salon={salon} notify={notify} />
            </Table.Cell>
          </Table.Row>
        ))
      }
      </Table.Body>
    </Table>
  )
}
