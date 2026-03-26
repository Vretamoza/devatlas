import { useFilterStore } from '../store/filterStore'

export function useAdmin() {
  const isAdmin = useFilterStore((s) => s.isAdmin)
  const setAdmin = useFilterStore((s) => s.setAdmin)

  const login = (pass: string) => {
    if (pass === import.meta.env.VITE_ADMIN_PASS) {
      setAdmin(true)
      sessionStorage.setItem('isAdmin', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setAdmin(false)
    sessionStorage.removeItem('isAdmin')
  }

  return { isAdmin, login, logout }
}
