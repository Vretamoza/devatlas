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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {resources.map((r) => (
        <ResourceCard key={r.id} resource={r} onClick={onSelect} />
      ))}
    </div>
  )
}
