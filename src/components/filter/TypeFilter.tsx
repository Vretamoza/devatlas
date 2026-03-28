import { useFilterStore } from '../../store/filterStore'
import { useResourceTypes } from '../../hooks/useResourceTypes'

export function TypeFilter() {
  const selectedTypes = useFilterStore((s) => s.types)
  const setTypes = useFilterStore((s) => s.setTypes)
  const { data: resourceTypes = [], isLoading } = useResourceTypes()

  const allValues = resourceTypes.map((rt) => rt.value)
  const isAllSelected = selectedTypes.length === 0

  const handleToggle = (value: string) => {
    if (isAllSelected) {
      // Deselecting one: show all except this one
      setTypes(allValues.filter((v) => v !== value))
    } else {
      const next = selectedTypes.includes(value)
        ? selectedTypes.filter((v) => v !== value)
        : [...selectedTypes, value]
      // If all types are now checked, reset to "all" (empty)
      setTypes(next.length === allValues.length ? [] : next)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-5 w-32 rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {resourceTypes.map(({ value, label, emoji }) => (
        <label key={value} className="flex items-center gap-2 cursor-pointer py-0.5">
          <input
            type="checkbox"
            className="checkbox checkbox-sm checkbox-primary"
            checked={isAllSelected || selectedTypes.includes(value)}
            onChange={() => handleToggle(value)}
          />
          <span className="text-sm">{emoji} {label}</span>
        </label>
      ))}
    </div>
  )
}
