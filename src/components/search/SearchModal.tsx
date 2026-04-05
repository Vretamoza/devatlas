import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Resource } from '../../types'
import { useFilterStore } from '../../store/filterStore'

const TYPE_COLORS: Record<string, string> = {
  documentation: 'oklch(0.66 0.18 280)',
  tool:          'oklch(0.78 0.17 75)',
  article:       'oklch(0.72 0.17 162)',
  video:         'oklch(0.65 0.22 25)',
  course:        'oklch(0.68 0.15 215)',
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const setStoreQuery = useFilterStore((s) => s.setQuery)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
    } else {
      // Focus after mount
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase
        .from('resources')
        .select('*, category:categories(name)')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(15)
      setResults(data ?? [])
      setLoading(false)
    }, 180)
    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (_r: Resource) => {
    setStoreQuery(query)
    navigate('/explore')
    onClose()
  }

  const handleSeeAll = () => {
    setStoreQuery(query)
    navigate('/explore')
    onClose()
  }

  if (!open) return null

  const grouped = results.reduce<Record<string, Resource[]>>((acc, r) => {
    acc[r.type] = acc[r.type] ?? []
    acc[r.type].push(r)
    return acc
  }, {})

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{
        background: 'oklch(0.04 0.01 265 / 0.75)',
        backdropFilter: 'blur(6px)',
        animation: 'fadeIn 150ms var(--ease-ui) both',
      }}
      onClick={onClose}
    >
      {/* Modal box — scales from 0.95 (Emil rule: never from 0) */}
      <div
        className="w-full max-w-lg overflow-hidden flex flex-col"
        style={{
          background: 'oklch(0.12 0.017 265)',
          border: '1px solid oklch(0.22 0.018 265)',
          borderRadius: '0.875rem',
          boxShadow: '0 24px 64px -12px oklch(0.04 0.01 265 / 0.8)',
          animation: 'modalIn 200ms var(--ease-out) both',
          maxHeight: '70vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input — always visible */}
        <div
          style={{
            padding: '0.875rem 1rem',
            borderBottom: `1px solid oklch(0.18 0.016 265)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'oklch(0.16 0.016 265)',
              border: `1px solid ${focused ? 'oklch(0.78 0.17 75 / 0.6)' : 'oklch(0.28 0.022 265)'}`,
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
              transition: 'border-color 150ms var(--ease-ui), box-shadow 150ms var(--ease-ui)',
              boxShadow: focused ? '0 0 0 3px oklch(0.78 0.17 75 / 0.12)' : 'none',
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="currentColor"
              style={{
                color: 'oklch(0.45 0.018 265)',
                flexShrink: 0,
              }}
            >
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search resources..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--color-base-content)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-sans)',
              }}
            />
            {loading ? (
              /* Fast spinner = perceived performance */
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  border: '2px solid oklch(0.78 0.17 75 / 0.3)',
                  borderTopColor: 'var(--color-primary)',
                  animation: 'spin 0.5s linear infinite',
                  flexShrink: 0,
                }}
              />
            ) : (
              <kbd style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.1rem 0.35rem',
                borderRadius: '0.25rem',
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                color: 'oklch(0.35 0.018 265)',
                background: 'oklch(0.20 0.016 265)',
                border: '1px solid oklch(0.26 0.018 265)',
                flexShrink: 0,
              }}>
                ESC
              </kbd>
            )}
          </div>
        </div>

        {/* Results */}
        {Object.keys(grouped).length > 0 && (
          <div style={{ overflowY: 'auto', maxHeight: '50vh', padding: '0.5rem' }}>
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type} style={{ marginBottom: '0.25rem' }}>
                <p style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'oklch(0.40 0.018 265)',
                  fontFamily: 'var(--font-mono)',
                  padding: '0.4rem 0.5rem 0.2rem',
                }}>
                  {type}
                </p>
                {items.slice(0, 5).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(r)}
                    className="da-btn"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: '0.6rem',
                      padding: '0.55rem 0.65rem',
                      borderRadius: '0.5rem',
                      background: 'transparent',
                      textAlign: 'left',
                      transition: 'background-color 120ms var(--ease-ui)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'oklch(0.17 0.016 265)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: TYPE_COLORS[type] ?? 'oklch(0.45 0.02 265)',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'oklch(0.85 0.012 265)',
                      fontFamily: 'var(--font-sans)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}>
                      {r.title}
                    </span>
                    {(r as any).category && (
                      <span style={{
                        fontSize: '0.7rem',
                        color: 'oklch(0.38 0.018 265)',
                        fontFamily: 'var(--font-mono)',
                        flexShrink: 0,
                      }}>
                        {(r as any).category.name}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {query && results.length === 0 && !loading && (
          <p style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'oklch(0.42 0.018 265)',
            padding: '2rem 1rem',
            fontFamily: 'var(--font-sans)',
          }}>
            No results for <span style={{ color: 'oklch(0.65 0.018 265)' }}>"{query}"</span>
          </p>
        )}

        {/* Footer — see all */}
        {results.length > 0 && (
          <div style={{
            padding: '0.625rem',
            borderTop: '1px solid oklch(0.18 0.016 265)',
          }}>
            <button
              className="da-btn"
              onClick={handleSeeAll}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                color: 'oklch(0.55 0.018 265)',
                background: 'transparent',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.03em',
                transition: 'background-color 120ms var(--ease-ui), color 120ms var(--ease-ui)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.17 0.016 265)'
                e.currentTarget.style.color = 'var(--color-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'oklch(0.55 0.018 265)'
              }}
            >
              See all results for "{query}" →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
