import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'
import { ResourceGrid } from '../components/resource/ResourceGrid'
import { ResourceDrawer } from '../components/resource/ResourceDrawer'
import { useCategories, useSubcategories } from '../hooks/useCategories'
import { useResources } from '../hooks/useResources'
import type { Resource } from '../types'

export function Category() {
  const { slug } = useParams<{ slug: string }>()
  const { data: categories } = useCategories()
  const category = categories?.find((c) => c.id === slug || c.name.toLowerCase() === slug)
  const { data: subcategories } = useSubcategories(category?.id)
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null)
  const { data: resources, isLoading } = useResources({ category: category?.id, subcategory: activeSubcat ?? undefined })
  const [selected, setSelected] = useState<Resource | null>(null)

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">{category?.name ?? 'Category'}</h1>
          <p className="text-base-content/50 mt-1 text-sm">
            {resources?.length ?? 0} resources
          </p>
        </div>

        {/* Subcategory tabs */}
        {subcategories && subcategories.length > 0 && (
          <div role="tablist" className="tabs tabs-boxed mb-6 w-fit">
            <button
              role="tab"
              className={`tab ${!activeSubcat ? 'tab-active' : ''}`}
              onClick={() => setActiveSubcat(null)}
            >
              All
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                role="tab"
                className={`tab ${activeSubcat === sub.id ? 'tab-active' : ''}`}
                onClick={() => setActiveSubcat(sub.id)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        <ResourceGrid resources={resources} isLoading={isLoading} onSelect={setSelected} />
      </div>

      <ResourceDrawer resource={selected} onClose={() => setSelected(null)} />
    </PageWrapper>
  )
}
