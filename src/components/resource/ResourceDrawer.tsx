import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import type { Resource } from '../../types'
import { useFilterStore } from '../../store/filterStore'
import { useNavigate } from 'react-router-dom'
import { useResourceTypes } from '../../hooks/useResourceTypes'

interface ResourceDrawerProps {
  resource: Resource | null
  onClose: () => void
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  documentation: { bg: 'oklch(0.66 0.18 280 / 0.18)', text: 'oklch(0.75 0.16 280)' },
  tool:          { bg: 'oklch(0.78 0.17 75 / 0.18)',  text: 'oklch(0.85 0.14 75)'  },
  article:       { bg: 'oklch(0.72 0.17 162 / 0.18)', text: 'oklch(0.78 0.14 162)' },
  video:         { bg: 'oklch(0.65 0.22 25 / 0.18)',  text: 'oklch(0.72 0.18 25)'  },
  course:        { bg: 'oklch(0.68 0.15 215 / 0.18)', text: 'oklch(0.75 0.13 215)' },
}

export function ResourceDrawer({ resource, onClose }: ResourceDrawerProps) {
  const toggleTag = useFilterStore((s) => s.toggleTag)
  const navigate = useNavigate()
  const { data: resourceTypes = [] } = useResourceTypes()
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const prevResourceRef = useRef<Resource | null>(null)

  const typeRecord = resource ? resourceTypes.find((rt) => rt.value === resource.type) : null
  const typeColors = resource ? (TYPE_COLORS[resource.type] ?? { bg: 'oklch(0.22 0.015 265)', text: 'oklch(0.65 0.02 265)' }) : null

  useEffect(() => {
    const panel = panelRef.current
    const backdrop = backdropRef.current
    if (!panel || !backdrop) return

    if (resource) {
      // Animate IN — Emil: drawer enter uses iOS curve, stays under 300ms
      gsap.set(panel, { transform: 'translateX(100%)' })
      gsap.set(backdrop, { opacity: 0 })
      gsap.to(backdrop, { opacity: 1, duration: 0.22, ease: 'power2.out' })
      gsap.to(panel, {
        transform: 'translateX(0%)',
        duration: 0.26,  // 260ms — fast but perceptible
        ease: 'power3.out', // cubic-bezier(0.32, 0.72, 0, 1) equivalent
      })
      prevResourceRef.current = resource
    } else if (prevResourceRef.current) {
      // Animate OUT — Emil: exit must be FASTER than enter (system responding)
      gsap.to(backdrop, { opacity: 0, duration: 0.16, ease: 'power2.in' })
      gsap.to(panel, {
        transform: 'translateX(100%)',
        duration: 0.18,  // 180ms — noticeably snappier than 260ms open
        ease: 'power2.in', // ease-in on exit: starts fast, slows as it leaves
      })
      prevResourceRef.current = null
    }
  }, [resource])

  const handleTagClick = (tagName: string) => {
    toggleTag(tagName)
    onClose()
    navigate('/explore')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-40"
        style={{
          background: 'oklch(0.04 0.01 265 / 0.7)',
          backdropFilter: 'blur(4px)',
          opacity: 0,
          pointerEvents: resource ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="drawer-panel fixed top-0 right-0 h-full w-full max-w-[420px] z-50 overflow-y-auto"
        style={{ transform: 'translateX(100%)' }}
      >
        {resource && (
          <div className="p-6 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <span
                className="type-badge"
                style={{
                  background: typeColors?.bg,
                  color: typeColors?.text,
                  fontSize: '0.7rem',
                  padding: '0.3rem 0.75rem',
                }}
              >
                {typeRecord?.emoji} {resource.type}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="da-btn flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'var(--color-primary-content)',
                    boxShadow: '0 0 16px oklch(0.78 0.17 75 / 0.3)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  Open
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M2 10L10 2M10 2H5M10 2v5"/>
                  </svg>
                </a>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150"
                  style={{
                    color: 'oklch(0.45 0.02 265)',
                    background: 'oklch(0.18 0.015 265)',
                  }}
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3 3l10 10M13 3L3 13"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Title */}
            <h2
              className="text-2xl font-bold leading-tight"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.95 0.01 265)',
                letterSpacing: '-0.02em',
              }}
            >
              {resource.title}
            </h2>

            {/* Meta breadcrumb */}
            <div
              className="flex items-center gap-1.5 text-xs flex-wrap"
              style={{ color: 'oklch(0.45 0.02 265)' }}
            >
              {resource.category && (
                <span
                  className="px-2 py-0.5 rounded-md"
                  style={{ background: 'oklch(0.18 0.015 265)' }}
                >
                  {resource.category.name}
                </span>
              )}
              {resource.subcategory && (
                <>
                  <span>›</span>
                  <span
                    className="px-2 py-0.5 rounded-md"
                    style={{ background: 'oklch(0.18 0.015 265)' }}
                  >
                    {resource.subcategory.name}
                  </span>
                </>
              )}
              <span className="ml-auto flex items-center gap-2">
                <span>{resource.language === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}</span>
                <span style={{ color: 'oklch(0.30 0.02 265)' }}>·</span>
                <span>{new Date(resource.created_at).toLocaleDateString()}</span>
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'oklch(0.20 0.015 265)' }} />

            {/* Description */}
            {resource.description && (
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'oklch(0.68 0.02 265)' }}
              >
                {resource.description}
              </p>
            )}

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.name)}
                    className="tag-pill"
                  >
                    # {tag.name}
                  </button>
                ))}
              </div>
            )}

            {/* Notes */}
            {resource.notes && (
              <div
                className="rounded-lg p-4 text-sm"
                style={{
                  background: 'oklch(0.66 0.18 280 / 0.08)',
                  border: '1px solid oklch(0.66 0.18 280 / 0.2)',
                }}
              >
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: 'oklch(0.66 0.18 280)', fontFamily: 'var(--font-mono)' }}
                >
                  <span>📝</span> Note
                </div>
                <p style={{ color: 'oklch(0.72 0.02 265)' }}>{resource.notes}</p>
              </div>
            )}

            {/* Rating */}
            {resource.rating && (
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-medium"
                  style={{ color: 'oklch(0.45 0.02 265)', fontFamily: 'var(--font-mono)' }}
                >
                  RATING
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <svg
                      key={n}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={n <= resource.rating! ? 'var(--color-primary)' : 'oklch(0.22 0.015 265)'}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
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
