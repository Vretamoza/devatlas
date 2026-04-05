import { useTags } from '../../hooks/useResources'
import { useFilterStore } from '../../store/filterStore'

export function TagCloud() {
  const { data: tags } = useTags()
  const { tags: activeTags, toggleTag } = useFilterStore()

  if (!tags || tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => toggleTag(tag.name)}
          className={`tag-pill ${activeTags.includes(tag.name) ? 'active' : ''}`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  )
}
