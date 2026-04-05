import { useCategories, useSubcategories } from '../../hooks/useCategories'
import { useFilterStore } from '../../store/filterStore'

const CATEGORY_ICONS: Record<string, string> = {
  frontend: '🎨', backend: '⚙️', devops: '🚀', ai: '🤖',
  mobile: '📱', database: '🗄️', security: '🔒', design: '✏️',
}

export function CategoryTree() {
  const { data: categories } = useCategories()
  const { data: subcategories } = useSubcategories()
  const { category, subcategory, setCategory, setSubcategory } = useFilterStore()

  return (
    <div className="flex flex-col gap-0.5">
      <button
        className={`sidebar-item ${!category ? 'active' : ''}`}
        onClick={() => { setCategory(null); setSubcategory(null) }}
      >
        <span style={{ fontSize: '0.8rem' }}>◈</span>
        All categories
      </button>

      {categories?.map((cat) => {
        const isOpen = category === cat.id
        const subs = subcategories?.filter((s) => s.category_id === cat.id) ?? []
        const icon = CATEGORY_ICONS[cat.name.toLowerCase()] ?? '📁'

        return (
          <div key={cat.id}>
            <button
              className={`sidebar-item ${isOpen && !subcategory ? 'active' : ''}`}
              onClick={() => setCategory(isOpen ? null : cat.id)}
            >
              <span style={{ fontSize: '0.85rem' }}>{icon}</span>
              <span className="flex-1">{cat.name}</span>
              {subs.length > 0 && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    opacity: 0.4,
                  }}
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {isOpen && subs.length > 0 && (
              <div
                className="pl-4 flex flex-col gap-0.5 mt-0.5 mb-0.5"
                style={{
                  animation: 'fadeUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
                }}
              >
                {subs.map((sub) => (
                  <button
                    key={sub.id}
                    className={`sidebar-item text-xs ${subcategory === sub.id ? 'active' : ''}`}
                    style={{ paddingLeft: '0.75rem' }}
                    onClick={() => {
                      setCategory(cat.id)
                      setSubcategory(sub.id)
                    }}
                  >
                    <span style={{ color: 'oklch(0.35 0.02 265)', fontSize: '0.6rem' }}>◆</span>
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
