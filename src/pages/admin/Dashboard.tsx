import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useResources } from '../../hooks/useResources'
import { useCategories } from '../../hooks/useCategories'
import { useResourceTypes, useCreateResourceType, useDeleteResourceType } from '../../hooks/useResourceTypes'
import { ResourceForm } from '../../components/admin/ResourceForm'
import type { Resource, ResourceTypeRecord } from '../../types'

const COLOR_OPTIONS = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'accent', label: 'Accent' },
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'ghost', label: 'Ghost' },
]

type Tab = 'resources' | 'types'

export function Dashboard() {
  const [tab, setTab] = useState<Tab>('resources')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div role="tablist" className="tabs tabs-bordered mb-8">
        <button
          role="tab"
          className={`tab ${tab === 'resources' ? 'tab-active' : ''}`}
          onClick={() => setTab('resources')}
        >
          Resources
        </button>
        <button
          role="tab"
          className={`tab ${tab === 'types' ? 'tab-active' : ''}`}
          onClick={() => setTab('types')}
        >
          Resource Types
        </button>
      </div>

      {tab === 'resources' ? <ResourcesTab /> : <TypesTab />}
    </div>
  )
}

function ResourcesTab() {
  const { data: resources, isLoading } = useResources()
  const { data: categories } = useCategories()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Resource | null | 'new'>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('resources').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resources'] })
      setDeletingId(null)
    },
  })

  const filtered = resources?.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Stats */}
      <div className="stats stats-horizontal shadow mb-8 w-full overflow-x-auto">
        <div className="stat">
          <div className="stat-title">Total resources</div>
          <div className="stat-value text-2xl">{resources?.length ?? 0}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Categories</div>
          <div className="stat-value text-2xl">{categories?.length ?? 0}</div>
        </div>
      </div>

      {/* Table header */}
      <div className="flex items-center gap-3 mb-4">
        <input
          className="input input-bordered input-sm flex-1 max-w-xs"
          placeholder="Filter resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary btn-sm ml-auto" onClick={() => setEditing('new')}>
          + Add resource
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-base-200">
        <table className="table table-zebra table-sm">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Category</th>
              <th>Added</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={5} className="text-center py-8"><span className="loading loading-spinner" /></td></tr>
            )}
            {filtered?.map((r) => (
              <tr key={r.id}>
                <td className="font-medium max-w-xs truncate">{r.title}</td>
                <td><span className="badge badge-xs badge-ghost">{r.type}</span></td>
                <td className="text-base-content/50 text-xs">{r.category?.name ?? '—'}</td>
                <td className="text-base-content/50 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-xs" onClick={() => setEditing(r)}>Edit</button>
                    <button className="btn btn-ghost btn-xs text-error" onClick={() => setDeletingId(r.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resource editor modal */}
      {editing !== null && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">
              {editing === 'new' ? 'New resource' : 'Edit resource'}
            </h3>
            <ResourceForm
              resource={editing === 'new' ? undefined : editing}
              onSuccess={() => setEditing(null)}
              onCancel={() => setEditing(null)}
            />
          </div>
          <div className="modal-backdrop" onClick={() => setEditing(null)} />
        </dialog>
      )}

      {/* Delete confirm modal */}
      {deletingId && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-semibold text-lg">Delete resource?</h3>
            <p className="text-sm text-base-content/60 mt-2">This action cannot be undone.</p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setDeletingId(null)}>Cancel</button>
              <button
                className="btn btn-error"
                onClick={() => deleteMutation.mutate(deletingId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Delete'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeletingId(null)} />
        </dialog>
      )}
    </>
  )
}

const EMPTY_FORM: Omit<ResourceTypeRecord, 'created_at'> = {
  value: '',
  label: '',
  emoji: '📄',
  color: 'primary',
}

function TypesTab() {
  const { data: resourceTypes = [], isLoading } = useResourceTypes()
  const createMutation = useCreateResourceType()
  const deleteMutation = useDeleteResourceType()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deletingValue, setDeletingValue] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    createMutation.mutate(form, {
      onSuccess: () => {
        setForm(EMPTY_FORM)
        setShowForm(false)
      },
      onError: (err: any) => {
        setError(err?.message ?? 'Failed to create type. The value may already exist.')
      },
    })
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-base-content/60">
          Types drive the badge color and filter options throughout the app. Add new types here — no code changes needed.
        </p>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
          + Add type
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-base-200">
        <table className="table table-zebra table-sm">
          <thead>
            <tr>
              <th>Emoji</th>
              <th>Value (slug)</th>
              <th>Label</th>
              <th>Color</th>
              <th>Preview</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="text-center py-8"><span className="loading loading-spinner" /></td></tr>
            )}
            {resourceTypes.map((rt) => (
              <tr key={rt.value}>
                <td className="text-xl">{rt.emoji}</td>
                <td className="font-mono text-xs text-base-content/70">{rt.value}</td>
                <td className="font-medium">{rt.label}</td>
                <td className="text-xs text-base-content/60">{rt.color}</td>
                <td>
                  <span className={`badge badge-sm font-bold uppercase tracking-wide badge-${rt.color}`}>
                    {rt.emoji} {rt.value}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => setDeletingValue(rt.value)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add type modal */}
      {showForm && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-semibold text-lg mb-4">New resource type</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="form-control">
                <div className="label"><span className="label-text">Slug (value) *</span></div>
                <input
                  required
                  className="input input-bordered input-sm font-mono"
                  placeholder="e.g. course"
                  value={form.value}
                  onChange={(e) => set('value', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                />
                <div className="label"><span className="label-text-alt text-base-content/50">Lowercase, no spaces. Used in the database.</span></div>
              </label>

              <label className="form-control">
                <div className="label"><span className="label-text">Label *</span></div>
                <input
                  required
                  className="input input-bordered input-sm"
                  placeholder="e.g. Course"
                  value={form.label}
                  onChange={(e) => set('label', e.target.value)}
                />
              </label>

              <label className="form-control">
                <div className="label"><span className="label-text">Emoji *</span></div>
                <input
                  required
                  className="input input-bordered input-sm"
                  placeholder="e.g. 🎓"
                  value={form.emoji}
                  onChange={(e) => set('emoji', e.target.value)}
                />
              </label>

              <label className="form-control">
                <div className="label"><span className="label-text">Badge color *</span></div>
                <select
                  className="select select-bordered select-sm"
                  value={form.color}
                  onChange={(e) => set('color', e.target.value)}
                >
                  {COLOR_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>

              {/* Live preview */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-base-content/50">Preview:</span>
                <span className={`badge badge-sm font-bold uppercase tracking-wide badge-${form.color}`}>
                  {form.emoji} {form.value || 'type'}
                </span>
              </div>

              {error && (
                <div className="alert alert-error text-sm">{error}</div>
              )}

              <div className="flex gap-2 justify-end">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setShowForm(false); setError(null) }}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => { setShowForm(false); setError(null) }} />
        </dialog>
      )}

      {/* Delete confirm modal */}
      {deletingValue && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-semibold text-lg">Delete type "{deletingValue}"?</h3>
            <p className="text-sm text-base-content/60 mt-2">
              This will fail if any resources are currently using this type. Reassign them first.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setDeletingValue(null)}>Cancel</button>
              <button
                className="btn btn-error"
                onClick={() => deleteMutation.mutate(deletingValue, { onSuccess: () => setDeletingValue(null) })}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Delete'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeletingValue(null)} />
        </dialog>
      )}
    </>
  )
}
