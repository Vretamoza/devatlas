import { useEffect, useRef, useState } from 'react'
import { useSearch } from '../../hooks/useSearch'
import { SearchModal } from './SearchModal'

export function SearchBar({ placeholder = 'Search resources...' }: { placeholder?: string }) {
  const { local, handleChange } = useSearch()
  const [modalOpen, setModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setModalOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <label className="input input-bordered flex items-center gap-2 w-full">
        <svg className="size-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={local}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="grow text-sm"
        />
        <kbd className="kbd kbd-sm hidden sm:inline-flex">⌘K</kbd>
      </label>
      <SearchModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
