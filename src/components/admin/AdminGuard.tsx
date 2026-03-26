import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilterStore } from '../../store/filterStore'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAdmin = useFilterStore((s) => s.isAdmin)
  const setAdmin = useFilterStore((s) => s.setAdmin)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = sessionStorage.getItem('isAdmin')
    if (stored === 'true') setAdmin(true)
    else if (!isAdmin) navigate('/admin')
  }, [isAdmin, navigate, setAdmin])

  if (!isAdmin) return null
  return <>{children}</>
}
