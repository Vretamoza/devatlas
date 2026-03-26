import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useCategories, useSubcategories } from '../../hooks/useCategories'
import type { Resource, ResourceType } from '../../types'

const TYPES: ResourceType[] = ['documentation', 'tool', 'article', 'video']

interface ResourceFormProps {
  resource?: Resource
  onSuccess: () => void
  onCancel: () => void
}

export function ResourceForm({ resource, onSuccess, onCancel }: ResourceFormProps) {
  const qc = useQueryClient()
  const { data: categories } = useCategories()
  const [categoryId, setCategoryId] = useState(resource?.category_id ?? '')
  const { data: subcategories } = useSubcategories(categoryId || null)

  const [form, setForm] = useState({
    title: resource?.title ?? '',
    url: resource?.url ?? '',
    type: (resource?.type ?? 'documentation') as ResourceType,
    description: resource?.description ?? '',
    category_id: resource?.category_id ?? '',
    subcategory_id: resource?.subcategory_id ?? '',
    notes: resource?.notes ?? '',
    rating: resource?.rating ?? null as number | null,
  })

  const set = (field: string, value: unknown) => setForm((f) => ({ ...f, [field]: value }))

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
      } else {
        const { error } = await supabase.from('resources').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resources'] })
      onSuccess()
    },
  })

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
          className="select select-bordered"
          value={form.type}
          onChange={(e) => set('type', e.target.value)}
        >
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
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
