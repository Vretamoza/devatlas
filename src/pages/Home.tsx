import { Link, useNavigate } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'
import { SearchBar } from '../components/search/SearchBar'
import { ResourceCard } from '../components/resource/ResourceCard'
import { useResources } from '../hooks/useResources'
import { useCategories } from '../hooks/useCategories'
import { useFilterStore } from '../store/filterStore'
import { ResourceDrawer } from '../components/resource/ResourceDrawer'
import type { Resource, ResourceType } from '../types'
import { useState } from 'react'

const CATEGORY_ICONS: Record<string, string> = {
  frontend: '🎨', backend: '⚙️', devops: '🚀', ai: '🤖',
  mobile: '📱', database: '🗄️', security: '🔒', design: '✏️',
}

const TYPE_FILTERS: { value: ResourceType; label: string; icon: string }[] = [
  { value: 'documentation', label: 'Documentation', icon: '📄' },
  { value: 'tool', label: 'Tool', icon: '🔧' },
  { value: 'article', label: 'Article', icon: '📝' },
  { value: 'video', label: 'Video', icon: '🎬' },
]

export function Home() {
  const { data: recent, isLoading } = useResources()
  const { data: categories } = useCategories()
  const setCategory = useFilterStore((s) => s.setCategory)
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Resource | null>(null)

  const handleTypeFilter = (type: ResourceType) => {
    navigate(`/explore?type=${type}`)
  }

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="badge badge-outline badge-lg gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse inline-block" />
          Curated by devs, for devs
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight max-w-2xl leading-[1.1]">
          The curated<br />
          <span className="text-primary">tech dictionary.</span>
        </h1>

        <p className="text-base-content/55 max-w-md text-lg leading-relaxed">
          Documentation, tools, articles and videos —<br />
          organized so you find what actually matters.
        </p>

        <div className="w-full max-w-lg">
          <SearchBar placeholder="Search anything..." />
        </div>
      </section>

      {/* Category grid */}
      {categories && categories.length > 0 && (
        <section className="px-4 sm:px-8 max-w-5xl mx-auto mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/40 mb-4">Browse by category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.id}`}
                className="card border-2 border-base-200 hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-1 transition-all duration-200 cursor-pointer rounded-2xl"
                onClick={() => setCategory(cat.id)}
              >
                <div className="card-body p-6 gap-1">
                  <span className="text-3xl mb-1">{CATEGORY_ICONS[cat.name.toLowerCase()] ?? '📁'}</span>
                  <h3 className="font-bold text-base tracking-tight">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Type quick filters */}
      <section className="px-4 sm:px-8 max-w-5xl mx-auto mb-16">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/40 mb-4">Browse by type</h2>
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map(({ value, label, icon }) => (
            <button
              key={value}
              className="btn btn-outline btn-sm gap-2"
              onClick={() => handleTypeFilter(value)}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>
      </section>

      {/* Recently added */}
      <section className="px-4 sm:px-8 max-w-5xl mx-auto mb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/40">Recently added</h2>
          <Link to="/explore" className="btn btn-ghost btn-xs">View all →</Link>
        </div>
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton w-56 h-36 shrink-0 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recent?.slice(0, 4).map((r) => (
              <ResourceCard key={r.id} resource={r} onClick={setSelected} />
            ))}
          </div>
        )}
      </section>

      <ResourceDrawer resource={selected} onClose={() => setSelected(null)} />
    </PageWrapper>
  )
}
