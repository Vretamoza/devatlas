import { useFilterStore } from '../../store/filterStore'

const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
]

export function LanguageFilter() {
  const language = useFilterStore((s) => s.language)
  const setLanguage = useFilterStore((s) => s.setLanguage)

  return (
    <div className="flex flex-col gap-1">
      {LANGUAGES.map(({ value, label, flag }) => (
        <label key={value} className="flex items-center gap-2 cursor-pointer py-0.5">
          <input
            type="radio"
            name="language-filter"
            className="radio radio-sm radio-primary"
            checked={language === value}
            onChange={() => setLanguage(language === value ? null : value)}
            onClick={() => { if (language === value) setLanguage(null) }}
          />
          <span className="text-sm">{flag} {label}</span>
        </label>
      ))}
    </div>
  )
}
