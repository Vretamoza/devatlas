import { useFilterStore } from '../../store/filterStore'
import type { ResourceType } from '../../types'

const TYPES: { value: ResourceType; label: string }[] = [
  { value: 'documentation', label: 'Documentation' },
  { value: 'tool', label: 'Tool' },
  { value: 'article', label: 'Article' },
  { value: 'video', label: 'Video' },
]

export function TypeFilter() {
  const types = useFilterStore((s) => s.types)
  const toggleType = useFilterStore((s) => s.toggleType)

  return (
    <div className="flex flex-col gap-1">
      {TYPES.map(({ value, label }) => (
        <label key={value} className="flex items-center gap-2 cursor-pointer py-0.5">
          <input
            type="checkbox"
            className="checkbox checkbox-sm checkbox-primary"
            checked={types.includes(value)}
            onChange={() => toggleType(value)}
          />
          <span className="text-sm">{label}</span>
        </label>
      ))}
    </div>
  )
}
