import { ArrowLongLeft } from '@medusajs/icons'
import { useNavigate } from 'react-router-dom'

interface Props {
  url: string
  children: React.ReactNode
}
export default function BackButton ({ url, children }: Props) {
  const navigate = useNavigate()
  return (
    <button
      className='flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4'
      onClick={() => { navigate(url) }}>
        <ArrowLongLeft />
        {children}
    </button>
  )
}
