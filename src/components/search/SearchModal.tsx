import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Resource } from '../../types'
import { useFilterStore } from '../../store/filterStore'

const TYPE_BADGE: Record<string, string> = {
  documentation: 'badge-info',
  tool: 'badge-primary',
  article: 'badge-secondary',
  video: 'badge-accent',
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const setStoreQuery = useFilterStore((s) => s.setQuery)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) { setQuery(''); setResults([]) }
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
    }, 200)
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

  // group by type
  const grouped = results.reduce<Record<string, Resource[]>>((acc, r) => {
    acc[r.type] = acc[r.type] ?? []
    acc[r.type].push(r)
    return acc
  }, {})

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-lg p-0 overflow-hidden">
        <div className="p-4 border-b border-base-200">
          <label className="input input-bordered flex items-center gap-2">
            <svg className="size-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources..."
              className="grow text-sm"
            />
            {loading && <span className="loading loading-spinner loading-xs" />}
          </label>
        </div>

        {Object.keys(grouped).length > 0 && (
          <ul className="menu menu-sm max-h-80 overflow-y-auto py-2">
            {Object.entries(grouped).map(([type, items]) => (
              <li key={type}>
                <h2 className="menu-title capitalize">{type}</h2>
                <ul>
                  {items.slice(0, 5).map((r) => (
                    <li key={r.id}>
                      <a onClick={() => handleSelect(r)} className="flex items-center gap-2">
                        <span className={`badge badge-xs ${TYPE_BADGE[type] ?? ''}`} />
                        <span className="text-sm truncate">{r.title}</span>
                        {r.category && <span className="text-xs text-base-content/40 ml-auto shrink-0">{(r.category as any).name}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && !loading && (
          <p className="text-center text-sm text-base-content/50 py-8">No results for "{query}"</p>
        )}

        {results.length > 0 && (
          <div className="p-3 border-t border-base-200">
            <button onClick={handleSeeAll} className="btn btn-ghost btn-sm w-full">
              See all results for "{query}"
            </button>
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  )
}
