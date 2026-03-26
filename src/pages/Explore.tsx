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
      <div className={`drawer drawer-end md:hidden ${filterDrawerOpen ? 'drawer-open' : ''}`}>
        <input
          type="checkbox"
          className="drawer-toggle"
          checked={filterDrawerOpen}
          onChange={() => setFilterDrawerOpen((v) => !v)}
          readOnly
        />
        <div className="drawer-side z-40">
          <label className="drawer-overlay" onClick={() => setFilterDrawerOpen(false)} />
          <div className="w-72 bg-base-100 h-full p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Filters</span>
              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setFilterDrawerOpen(false)}
              >
                ✕
              </button>
            </div>
            <FilterBar />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-base-200 sticky top-[--spacing-nav] h-[calc(100vh-var(--spacing-nav))] overflow-y-auto p-4">
          <FilterBar />
        </aside>

        {/* Main */}
        <div className="flex-1 p-4 sm:p-6 min-w-0">
          {/* Top bar */}
          <div className="flex items-center gap-3 mb-6">
            {/* Mobile: search + filter button */}
            <div className="flex-1 md:hidden">
              <SearchBar />
            </div>
            <button
              className="btn btn-ghost btn-sm gap-1 md:hidden"
              onClick={() => setFilterDrawerOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
            </button>

            {/* Desktop: count + sort */}
            <span className="text-sm text-base-content/50 whitespace-nowrap hidden md:inline">
              {resources?.length ?? 0} resources
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-base-content/50 whitespace-nowrap md:hidden">
                {resources?.length ?? 0}
              </span>
              <select
                className="select select-sm select-bordered"
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
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
