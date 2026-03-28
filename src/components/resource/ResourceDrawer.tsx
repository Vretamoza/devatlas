import type { Resource } from '../../types'
import { useFilterStore } from '../../store/filterStore'
import { useNavigate } from 'react-router-dom'
import { useResourceTypes } from '../../hooks/useResourceTypes'

interface ResourceDrawerProps {
  resource: Resource | null
  onClose: () => void
}

export function ResourceDrawer({ resource, onClose }: ResourceDrawerProps) {
  const toggleTag = useFilterStore((s) => s.toggleTag)
  const navigate = useNavigate()
  const { data: resourceTypes = [] } = useResourceTypes()
  const typeRecord = resource ? resourceTypes.find((rt) => rt.value === resource.type) : null
  const badgeClass = typeRecord ? `badge-${typeRecord.color}` : 'badge-ghost'

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
              <span className={`badge badge-lg font-bold uppercase tracking-wide rounded-lg ${badgeClass}`}>
                {typeRecord?.emoji} {resource.type}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-content text-sm font-semibold hover:bg-primary/85 active:scale-95 transition-all duration-150 select-none"
                >
                  Open resource
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 10L10 2M10 2H5M10 2v5"/>
                  </svg>
                </a>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-base-content/40 hover:text-base-content hover:bg-base-200 transition-all duration-150"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 3l10 10M13 3L3 13"/>
                  </svg>
                </button>
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
              <span className="ml-auto flex items-center gap-2">
                <span>{resource.language === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}</span>
                <span>·</span>
                <span>{new Date(resource.created_at).toLocaleDateString()}</span>
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
                    onClick={() => handleTagClick(tag.name)}
                    className="px-3 py-1 rounded-full text-xs font-medium border border-base-300 text-base-content/60 hover:border-primary/50 hover:text-primary hover:bg-primary/8 transition-all duration-150 cursor-pointer"
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
