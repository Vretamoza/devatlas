import { useFilterStore } from '../../store/filterStore'
import { CategoryTree } from './CategoryTree'
import { TypeFilter } from './TypeFilter'
import { LanguageFilter } from './LanguageFilter'
import { TagCloud } from './TagCloud'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-bold uppercase tracking-widest mb-2"
      style={{
        color: 'oklch(0.38 0.02 265)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.1em',
      }}
    >
      {children}
    </p>
  )
}

function Divider() {
  return <div style={{ height: '1px', background: 'oklch(0.18 0.015 265)', margin: '0.25rem 0' }} />
}

export function FilterBar() {
  const { query, category, subcategory, types, language, tags, clearFilters } = useFilterStore()
  const hasFilters = !!(query || category || subcategory || types.length || language || tags.length)

  return (
    <div className="flex flex-col gap-4 py-2">
      <div>
        <SectionLabel>Categories</SectionLabel>
        <CategoryTree />
      </div>

      <Divider />

      <div>
        <SectionLabel>Type</SectionLabel>
        <TypeFilter />
      </div>

      <Divider />

      <div>
        <SectionLabel>Language</SectionLabel>
        <LanguageFilter />
      </div>

      <Divider />

      <div>
        <SectionLabel>Tags</SectionLabel>
        <TagCloud />
      </div>

      {hasFilters && (
        <>
          <Divider />
          <button
            onClick={clearFilters}
            className="w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
              color: 'oklch(0.65 0.22 25)',
              background: 'oklch(0.65 0.22 25 / 0.08)',
              border: '1px solid oklch(0.65 0.22 25 / 0.2)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.05em',
            }}
          >
            ✕ Clear all filters
          </button>
        </>
      )}
    </div>
  )
}
