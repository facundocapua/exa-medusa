import { Button } from '@medusajs/ui'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import React from 'react'

interface StatusSelectorProps {
  isDraft: boolean
  activeState: string
  draftState: string
  onChange: () => void
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  isDraft,
  draftState,
  activeState,
  onChange
}) => {
  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant='transparent' size="small" className='self-center'>
            <div className='flex items-center gap-2'>
              <div className={clsx(
                'h-1.5 w-1.5 self-center rounded-full',
                { 'bg-emerald-40': !isDraft },
                { 'bg-grey-40': isDraft }
              )}></div>
              <span className='inter-small-regular text-xs'>{isDraft ? draftState : activeState}</span>
            </div>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={5}
          className="bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall z-30 min-w-[200px] border"
        >
          <DropdownMenu.Item>
            {
              <Button
                size="small"
                variant='transparent'
                className="w-full justify-start"
                onClick={onChange}
              >
                <div className='flex items-center gap-2'>
                  <div className={clsx(
                    'h-1.5 w-1.5 self-center rounded-full',
                    { 'bg-emerald-40': isDraft },
                    { 'bg-grey-40': !isDraft }
                  )}></div>
                  <span className='inter-small-regular text-xs'>{!isDraft ? draftState : activeState}</span>
                </div>
              </Button>
            }
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export default StatusSelector
