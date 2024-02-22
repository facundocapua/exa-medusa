import clsx from 'clsx'

interface Props {
  size?: 'large' | 'medium' | 'small'
  variant?: 'primary' | 'secondary'
}

export default function Spinner ({
  size = 'large',
  variant = 'primary'
}: Props) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        { 'h-[24px] w-[24px]': size === 'large' },
        { 'h-[20px] w-[20px]': size === 'medium' },
        { 'h-[16px] w-[16px]': size === 'small' }
      )}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <div
          className={clsx(
            'animate-ring rounded-circle h-4/5 w-4/5 border-2 border-transparent',
            { 'border-t-grey-0': variant === 'primary' },
            { 'border-t-violet-60': variant === 'secondary' }
          )}
        />
      </div>
    </div>
  )
}
