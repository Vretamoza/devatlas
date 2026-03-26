import { useCategories, useSubcategories } from '../../hooks/useCategories'
import { useFilterStore } from '../../store/filterStore'

export function CategoryTree() {
  const { data: categories } = useCategories()
  const { data: subcategories } = useSubcategories()
  const { category, subcategory, setCategory, setSubcategory } = useFilterStore()

  return (
    <ul className="menu menu-sm p-0 gap-0.5">
      <li>
        <button
          className={!category ? 'active' : ''}
          onClick={() => { setCategory(null); setSubcategory(null) }}
        >
          All categories
        </button>
      </li>
      {categories?.map((cat) => {
        const isOpen = category === cat.id
        const subs = subcategories?.filter((s) => s.category_id === cat.id) ?? []

        return (
          <li key={cat.id}>
            <button
              className={isOpen ? 'font-medium' : ''}
              onClick={() => setCategory(isOpen ? null : cat.id)}
            >
              {cat.name}
              {subs.length > 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`ml-auto size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
            {isOpen && subs.length > 0 && (
              <ul>
                {subs.map((sub) => (
                  <li key={sub.id}>
                    <button
                      className={subcategory === sub.id ? 'active' : ''}
                      onClick={() => {
                        setCategory(cat.id)
                        setSubcategory(sub.id)
                      }}
                    >
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}
