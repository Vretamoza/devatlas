import { useFilterStore } from '../../store/filterStore'

const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
]

export function LanguageFilter() {
  const language = useFilterStore((s) => s.language)
  const setLanguage = useFilterStore((s) => s.setLanguage)

  return (
    <div className="flex flex-col gap-0.5">
      {LANGUAGES.map(({ value, label, flag }) => {
        const isActive = language === value
        return (
          <button
            key={value}
            className="sidebar-item"
            style={{ color: isActive ? 'var(--color-base-content)' : 'oklch(0.45 0.02 265)' }}
            onClick={() => setLanguage(isActive ? null : value)}
          >
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-150"
              style={{
                border: `1.5px solid ${isActive ? 'var(--color-primary)' : 'oklch(0.28 0.02 265)'}`,
                background: isActive ? 'var(--color-primary)' : 'transparent',
              }}
            >
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--color-primary-content)' }}
                />
              )}
            </span>
            <span className="text-sm">{flag} {label}</span>
          </button>
        )
      })}
    </div>
  )
}
