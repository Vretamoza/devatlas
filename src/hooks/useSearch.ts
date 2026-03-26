import { useState, useCallback } from 'react'
import { useFilterStore } from '../store/filterStore'

export function useSearch() {
  const setQuery = useFilterStore((s) => s.setQuery)
  const query = useFilterStore((s) => s.query)
  const [local, setLocal] = useState(query)

  const handleChange = useCallback(
    (value: string) => {
      setLocal(value)
      const timer = setTimeout(() => setQuery(value), 200)
      return () => clearTimeout(timer)
    },
    [setQuery]
  )

  return { local, handleChange }
}
