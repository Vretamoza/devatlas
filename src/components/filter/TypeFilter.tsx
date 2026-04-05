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
      setTypes(allValues.filter((v) => v !== value))
    } else {
      const next = selectedTypes.includes(value)
        ? selectedTypes.filter((v) => v !== value)
        : [...selectedTypes, value]
      setTypes(next.length === allValues.length ? [] : next)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-7 rounded-md" style={{ width: `${60 + i * 12}%` }} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      {resourceTypes.map(({ value, label, emoji }) => {
        const isActive = isAllSelected || selectedTypes.includes(value)
        return (
          <button
            key={value}
            onClick={() => handleToggle(value)}
            className="sidebar-item"
            style={{
              color: isActive ? 'var(--color-base-content)' : 'oklch(0.45 0.02 265)',
            }}
          >
            <span
              className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-150"
              style={{
                border: `1.5px solid ${isActive ? 'var(--color-primary)' : 'oklch(0.28 0.02 265)'}`,
                background: isActive ? 'oklch(0.78 0.17 75 / 0.15)' : 'transparent',
              }}
            >
              {isActive && (
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M2 5l2.5 2.5L8 2.5" />
                </svg>
              )}
            </span>
            <span className="text-sm">{emoji} {label}</span>
          </button>
        )
      })}
    </div>
  )
}
