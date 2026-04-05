import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import type { Resource } from '../../types'
import { ResourceCard } from './ResourceCard'
import { LoadingSkeleton } from '../ui/LoadingSkeleton'
import { EmptyState } from '../ui/EmptyState'
import { useFilterStore } from '../../store/filterStore'

interface ResourceGridProps {
  resources: Resource[] | undefined
  isLoading: boolean
  onSelect: (resource: Resource) => void
}

export function ResourceGrid({ resources, isLoading, onSelect }: ResourceGridProps) {
  const clearFilters = useFilterStore((s) => s.clearFilters)
  const gridRef = useRef<HTMLDivElement>(null)
  const prevCountRef = useRef(0)

  useEffect(() => {
    if (!gridRef.current || !resources?.length) return

    const cards = gridRef.current.querySelectorAll('.resource-card')
    if (!cards.length) return

    // Only animate newly rendered cards (count changed)
    const newCount = resources.length
    if (newCount === prevCountRef.current) return
    prevCountRef.current = newCount

    // Emil: use `transform` string (not shorthand y/scale) for hardware acceleration.
    // Cap stagger at 8 items × 40ms = max 320ms total wait for large lists.
    const staggerDelay = Math.min(0.04, 0.32 / cards.length)

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        transform: 'translateY(18px) scale(0.97)',
      },
      {
        opacity: 1,
        transform: 'translateY(0px) scale(1)',
        duration: 0.38,
        ease: 'power3.out',
        stagger: {
          each: staggerDelay,
          from: 'start',
        },
        clearProps: 'transform,opacity',
      }
    )
  }, [resources?.length])

  if (isLoading) return <LoadingSkeleton />

  if (!resources || resources.length === 0) {
    return (
      <EmptyState
        title="No resources found"
        description="Try adjusting your filters or search query."
        action={{ label: 'Clear filters', onClick: clearFilters }}
      />
    )
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {resources.map((r) => (
        <ResourceCard key={r.id} resource={r} onClick={onSelect} />
      ))}
    </div>
  )
}
