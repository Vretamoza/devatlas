import { useFilterStore } from '../../store/filterStore'
import { CategoryTree } from './CategoryTree'
import { TypeFilter } from './TypeFilter'
import { LanguageFilter } from './LanguageFilter'
import { TagCloud } from './TagCloud'

export function FilterBar() {
  const { query, category, subcategory, types, language, tags, clearFilters } = useFilterStore()
  const hasFilters = !!(query || category || subcategory || types.length || language || tags.length)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-2">Categories</p>
        <CategoryTree />
      </div>
      <div className="divider my-0" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-2">Type</p>
        <TypeFilter />
      </div>
      <div className="divider my-0" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-2">Language</p>
        <LanguageFilter />
      </div>
      <div className="divider my-0" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-2">Tags</p>
        <TagCloud />
      </div>
      {hasFilters && (
        <>
          <div className="divider my-0" />
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            Clear all filters
          </button>
        </>
      )}
    </div>
  )
}
