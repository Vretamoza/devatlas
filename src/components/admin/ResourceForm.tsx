import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useCategories, useSubcategories } from '../../hooks/useCategories'
import { useResourceTypes } from '../../hooks/useResourceTypes'
import { useTags } from '../../hooks/useResources'
import type { Resource } from '../../types'

interface ResourceFormProps {
  resource?: Resource
  onSuccess: () => void
  onCancel: () => void
}

export function ResourceForm({ resource, onSuccess, onCancel }: ResourceFormProps) {
  const qc = useQueryClient()
  const { data: categories } = useCategories()
  const { data: resourceTypes = [] } = useResourceTypes()
  const { data: allTags = [] } = useTags()
  const [categoryId, setCategoryId] = useState(resource?.category_id ?? '')
  const { data: subcategories } = useSubcategories(categoryId || null)
  const [tagSearch, setTagSearch] = useState('')

  const [form, setForm] = useState({
    title: resource?.title ?? '',
    url: resource?.url ?? '',
    type: resource?.type ?? '',
    language: resource?.language ?? 'en',
    description: resource?.description ?? '',
    category_id: resource?.category_id ?? '',
    subcategory_id: resource?.subcategory_id ?? '',
    notes: resource?.notes ?? '',
    rating: resource?.rating ?? null as number | null,
  })

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    resource?.tags?.map((t) => t.id) ?? []
  )

  const set = (field: string, value: unknown) => setForm((f) => ({ ...f, [field]: value }))

  const toggleTag = (tagId: string) =>
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )

  const syncTags = async (resourceId: string) => {
    await supabase.from('resource_tags').delete().eq('resource_id', resourceId)
    if (selectedTagIds.length > 0) {
      const { error } = await supabase
        .from('resource_tags')
        .insert(selectedTagIds.map((tag_id) => ({ resource_id: resourceId, tag_id })))
      if (error) throw error
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        category_id: form.category_id || null,
        subcategory_id: form.subcategory_id || null,
      }
      if (resource) {
        const { error } = await supabase.from('resources').update(payload).eq('id', resource.id)
        if (error) throw error
        await syncTags(resource.id)
      } else {
        const { data, error } = await supabase
          .from('resources')
          .insert(payload)
          .select('id')
          .single()
        if (error) throw error
        await syncTags(data.id)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resources'] })
      onSuccess()
    },
  })

  const filteredTags = allTags.filter((t) =>
    t.name.toLowerCase().includes(tagSearch.toLowerCase())
  )

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}
      className="flex flex-col gap-4"
    >
      <label className="form-control">
        <div className="label"><span className="label-text">Title *</span></div>
        <input
          required
          className="input input-bordered"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
        />
      </label>

      <label className="form-control">
        <div className="label"><span className="label-text">URL *</span></div>
        <input
          required
          type="url"
          className="input input-bordered"
          value={form.url}
          onChange={(e) => set('url', e.target.value)}
        />
      </label>

      <label className="form-control">
        <div className="label"><span className="label-text">Type *</span></div>
        <select
          required
          className="select select-bordered"
          value={form.type}
          onChange={(e) => set('type', e.target.value)}
        >
          <option value="" disabled>Select a type</option>
          {resourceTypes.map(({ value, label, emoji }) => (
            <option key={value} value={value}>{emoji} {label}</option>
          ))}
        </select>
      </label>

      <label className="form-control">
        <div className="label"><span className="label-text">Language *</span></div>
        <select
          className="select select-bordered"
          value={form.language}
          onChange={(e) => set('language', e.target.value)}
        >
          <option value="en">🇺🇸 English</option>
          <option value="es">🇪🇸 Español</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="form-control">
          <div className="label"><span className="label-text">Category</span></div>
          <select
            className="select select-bordered"
            value={form.category_id}
            onChange={(e) => { set('category_id', e.target.value); setCategoryId(e.target.value); set('subcategory_id', '') }}
          >
            <option value="">None</option>
            {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>

        <label className="form-control">
          <div className="label"><span className="label-text">Subcategory</span></div>
          <select
            className="select select-bordered"
            value={form.subcategory_id}
            onChange={(e) => set('subcategory_id', e.target.value)}
            disabled={!form.category_id}
          >
            <option value="">None</option>
            {subcategories?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
      </div>

      {/* Tags */}
      <div className="form-control">
        <div className="label">
          <span className="label-text">Tags</span>
          {selectedTagIds.length > 0 && (
            <span className="label-text-alt text-primary font-medium">
              {selectedTagIds.length} selected
            </span>
          )}
        </div>
        <input
          type="text"
          className="input input-bordered input-sm mb-2"
          placeholder="Filter tags..."
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
        />
        <div className="border border-base-200 rounded-xl p-3 max-h-40 overflow-y-auto">
          {allTags.length === 0 ? (
            <p className="text-xs text-base-content/40 text-center py-2">No tags yet</p>
          ) : filteredTags.length === 0 ? (
            <p className="text-xs text-base-content/40 text-center py-2">No tags match "{tagSearch}"</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {filteredTags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer ${
                      selected
                        ? 'bg-primary text-primary-content border-primary'
                        : 'border-base-300 text-base-content/60 hover:border-primary/50 hover:text-primary hover:bg-primary/8'
                    }`}
                  >
                    {tag.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <label className="form-control">
        <div className="label"><span className="label-text">Description</span></div>
        <textarea
          className="textarea textarea-bordered"
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </label>

      <label className="form-control">
        <div className="label"><span className="label-text">Notes (admin only)</span></div>
        <textarea
          className="textarea textarea-bordered"
          rows={2}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </label>

      <label className="form-control">
        <div className="label"><span className="label-text">Rating</span></div>
        <div className="rating">
          {[1,2,3,4,5].map((n) => (
            <input
              key={n}
              type="radio"
              name="rating"
              className="mask mask-star-2 bg-warning"
              checked={form.rating === n}
              onChange={() => set('rating', n)}
            />
          ))}
          <button type="button" className="btn btn-ghost btn-xs ml-2" onClick={() => set('rating', null)}>Clear</button>
        </div>
      </label>

      {mutation.isError && (
        <div className="alert alert-error text-sm">
          Failed to save resource. Please try again.
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? <span className="loading loading-spinner loading-sm" /> : resource ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
