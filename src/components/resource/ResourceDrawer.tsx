import type { Resource } from '../../types'
import { useFilterStore } from '../../store/filterStore'
import { useNavigate } from 'react-router-dom'

const TYPE_BADGE: Record<string, string> = {
  documentation: 'badge-info',
  tool: 'badge-primary',
  article: 'badge-secondary',
  video: 'badge-accent',
}

interface ResourceDrawerProps {
  resource: Resource | null
  onClose: () => void
}

export function ResourceDrawer({ resource, onClose }: ResourceDrawerProps) {
  const toggleTag = useFilterStore((s) => s.toggleTag)
  const navigate = useNavigate()

  const handleTagClick = (tagName: string) => {
    toggleTag(tagName)
    onClose()
    navigate('/explore')
  }

  return (
    <>
      {/* Backdrop */}
      {resource && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-base-100 z-50 shadow-2xl overflow-y-auto transition-transform duration-300 ${
          resource ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {resource && (
          <div className="p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <span className={`badge badge-lg font-bold uppercase tracking-wide rounded-lg ${TYPE_BADGE[resource.type] ?? 'badge-ghost'}`}>
                {resource.type}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open ↗
                </a>
                <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>✕</button>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold leading-snug tracking-tight">{resource.title}</h2>

            {/* Meta */}
            <div className="flex items-center gap-1 text-xs text-base-content/50">
              {resource.category && <span>{resource.category.name}</span>}
              {resource.subcategory && (
                <>
                  <span>›</span>
                  <span>{resource.subcategory.name}</span>
                </>
              )}
              <span className="ml-auto">
                {new Date(resource.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="divider my-0" />

            {/* Description */}
            {resource.description && (
              <p className="text-sm text-base-content/80 leading-relaxed">{resource.description}</p>
            )}

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <button
                    key={tag.id}
                    className="badge badge-outline cursor-pointer transition-colors hover:bg-primary hover:text-primary-content hover:border-primary"
                    onClick={() => handleTagClick(tag.name)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}

            {/* Notes */}
            {resource.notes && (
              <div className="alert alert-info text-sm">
                <span>📝</span>
                <div>
                  <div className="font-semibold text-xs uppercase tracking-wide mb-1">Admin note</div>
                  <p>{resource.notes}</p>
                </div>
              </div>
            )}

            {/* Rating */}
            {resource.rating && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-base-content/50">Rating</span>
                <div className="rating rating-sm">
                  {[1,2,3,4,5].map((n) => (
                    <input
                      key={n}
                      type="radio"
                      name={`rating-${resource.id}`}
                      className="mask mask-star-2 bg-warning"
                      defaultChecked={n === resource.rating}
                      disabled
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
