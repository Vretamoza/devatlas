import { useEffect, useRef, useState } from 'react'
import { useSearch } from '../../hooks/useSearch'
import { SearchModal } from './SearchModal'

export function SearchBar({ placeholder = 'Search resources...' }: { placeholder?: string }) {
  const { local, handleChange } = useSearch()
  const [modalOpen, setModalOpen] = useState(false)
  const [focused, setFocused] = useState(false)
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
      <div
        className="da-input"
        style={{
          /* Emil: border-color transition on the wrapper, not outline on inner input */
          borderColor: focused
            ? 'oklch(0.78 0.17 75 / 0.65)'
            : 'oklch(0.28 0.022 265)',
          boxShadow: focused
            ? '0 0 0 3px oklch(0.78 0.17 75 / 0.13)'
            : 'none',
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 16 16"
          fill="currentColor"
          style={{
            color: focused ? 'oklch(0.78 0.17 75 / 0.7)' : 'oklch(0.40 0.018 265)',
            flexShrink: 0,
            transition: 'color 150ms var(--ease-ui)',
          }}
        >
          <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={local}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ flex: 1, minWidth: 0 }}
        />

        <kbd
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.1rem 0.4rem',
            borderRadius: '0.25rem',
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            color: 'oklch(0.38 0.018 265)',
            background: 'oklch(0.20 0.016 265)',
            border: '1px solid oklch(0.25 0.018 265)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          className="hidden sm:inline-flex"
        >
          ⌘K
        </kbd>
      </div>

      <SearchModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
