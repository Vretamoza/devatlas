import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'
import { FilterBar } from '../components/filter/FilterBar'
import { ResourceGrid } from '../components/resource/ResourceGrid'
import { ResourceDrawer } from '../components/resource/ResourceDrawer'
import { SearchBar } from '../components/search/SearchBar'
import { useResources } from '../hooks/useResources'
import { useFilterStore } from '../store/filterStore'
import type { Resource } from '../types'

export function Explore() {
  const { data: resources, isLoading } = useResources()
  const [selected, setSelected] = useState<Resource | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const { setCategory, setSort, sort } = useFilterStore()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
  }, [searchParams, setCategory])

  const handleSelect = (r: Resource) => {
    setSelected(r)
    setDrawerOpen(true)
  }

  return (
    <PageWrapper>
      {/* Mobile filter drawer */}
      {filterDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'oklch(0.04 0.01 265 / 0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setFilterDrawerOpen(false)}
          />
          <div
            className="fixed left-0 top-0 h-full w-72 z-50 overflow-y-auto p-5 md:hidden"
            style={{
              background: 'oklch(0.11 0.018 265)',
              borderRight: '1px solid oklch(0.22 0.02 265 / 0.7)',
              animation: 'fadeUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <span
                className="font-bold text-sm"
                style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.88 0.012 265)' }}
              >
                Filters
              </span>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-150"
                style={{
                  color: 'oklch(0.45 0.02 265)',
                  background: 'oklch(0.18 0.015 265)',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>
            <FilterBar />
          </div>
        </>
      )}

      <div className="flex min-h-[calc(100vh-var(--spacing-nav))]">
        {/* Desktop sidebar */}
        <aside
          className="hidden md:block w-60 shrink-0 sticky top-[--spacing-nav] h-[calc(100vh-var(--spacing-nav))] overflow-y-auto px-4 py-5"
          style={{
            borderRight: '1px solid oklch(0.16 0.015 265)',
            background: 'oklch(0.09 0.018 265 / 0.6)',
          }}
        >
          <FilterBar />
        </aside>

        {/* Main content */}
        <div className="flex-1 p-5 sm:p-7 min-w-0">
          {/* Top bar */}
          <div className="flex items-center gap-3 mb-6">
            {/* Mobile: search + filter toggle */}
            <div className="flex-1 md:hidden">
              <SearchBar />
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 md:hidden shrink-0"
              onClick={() => setFilterDrawerOpen(true)}
              style={{
                background: 'oklch(0.15 0.015 265)',
                border: '1px solid oklch(0.22 0.02 265)',
                color: 'oklch(0.62 0.02 265)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
            </button>

            {/* Desktop: resource count */}
            <span
              className="text-sm hidden md:inline"
              style={{ color: 'oklch(0.40 0.02 265)', fontFamily: 'var(--font-mono)' }}
            >
              {isLoading ? '—' : resources?.length ?? 0} resources
            </span>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <span
                className="text-xs hidden md:inline"
                style={{ color: 'oklch(0.35 0.02 265)', fontFamily: 'var(--font-mono)' }}
              >
                SORT
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="text-sm rounded-lg px-3 py-1.5 appearance-none cursor-pointer transition-all duration-150"
                style={{
                  background: 'oklch(0.13 0.016 265)',
                  border: '1px solid oklch(0.22 0.02 265)',
                  color: 'oklch(0.70 0.02 265)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                }}
              >
                <option value="newest">Newest</option>
                <option value="title">Title A–Z</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <ResourceGrid resources={resources} isLoading={isLoading} onSelect={handleSelect} />
        </div>
      </div>

      <ResourceDrawer resource={drawerOpen ? selected : null} onClose={() => setDrawerOpen(false)} />
    </PageWrapper>
  )
}
