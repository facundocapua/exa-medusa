import { Heading } from '@medusajs/ui'

export default function SectionTitle ({ children }: { children: React.ReactNode }) {
  return (
    <Heading level="h1" className='text-2xl font-semibold text-grey-90'>{children}</Heading>
  )
}
