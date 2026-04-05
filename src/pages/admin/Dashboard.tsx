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

const TAB_STYLE_BASE: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.15s ease',
  fontFamily: 'var(--font-display)',
}

export function Dashboard() {
  const [tab, setTab] = useState<Tab>('resources')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Tab header */}
      <div
        className="flex items-center gap-1 mb-8 p-1 rounded-xl w-fit"
        style={{
          background: 'oklch(0.13 0.016 265)',
          border: '1px solid oklch(0.20 0.015 265)',
        }}
      >
        {(['resources', 'types'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...TAB_STYLE_BASE,
              background: tab === t ? 'oklch(0.78 0.17 75 / 0.15)' : 'transparent',
              color: tab === t ? 'var(--color-primary)' : 'oklch(0.50 0.02 265)',
              boxShadow: tab === t ? '0 0 12px oklch(0.78 0.17 75 / 0.15)' : 'none',
            }}
          >
            {t === 'resources' ? 'Resources' : 'Resource Types'}
          </button>
        ))}
      </div>

      {tab === 'resources' ? <ResourcesTab /> : <TypesTab />}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="stat-card">
      <p
        className="text-xs font-bold uppercase tracking-widest mb-1"
        style={{ color: 'oklch(0.40 0.02 265)', fontFamily: 'var(--font-mono)' }}
      >
        {label}
      </p>
      <p
        className="text-4xl font-bold"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-primary)',
          textShadow: '0 0 20px oklch(0.78 0.17 75 / 0.3)',
        }}
      >
        {value}
      </p>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total resources" value={resources?.length ?? 0} />
        <StatCard label="Categories" value={categories?.length ?? 0} />
      </div>

      {/* Table toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-xs"
          style={{
            background: 'oklch(0.13 0.016 265)',
            border: '1px solid oklch(0.22 0.02 265)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'oklch(0.40 0.02 265)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder-shown:text-sm"
            placeholder="Filter resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              color: 'var(--color-base-content)',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ml-auto transition-all duration-150 hover:scale-105 active:scale-95"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-primary-content)',
            boxShadow: '0 0 16px oklch(0.78 0.17 75 / 0.3)',
            fontFamily: 'var(--font-display)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add resource
        </button>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-xl"
        style={{ border: '1px solid oklch(0.18 0.015 265)' }}
      >
        <table
          className="admin-table w-full text-sm"
          style={{ borderCollapse: 'collapse' }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid oklch(0.18 0.015 265)' }}>
              {['Title', 'Type', 'Category', 'Added', ''].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: 'oklch(0.38 0.02 265)',
                    fontFamily: 'var(--font-mono)',
                    background: 'oklch(0.11 0.018 265)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <div
                    className="inline-block w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
                  />
                </td>
              </tr>
            )}
            {filtered?.map((r) => (
              <tr
                key={r.id}
                style={{ borderBottom: '1px solid oklch(0.15 0.015 265 / 0.5)' }}
              >
                <td
                  className="px-4 py-3 font-medium max-w-xs truncate"
                  style={{ color: 'oklch(0.88 0.012 265)', fontFamily: 'var(--font-display)' }}
                >
                  {r.title}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="type-badge"
                    style={{
                      background: 'oklch(0.22 0.015 265)',
                      color: 'oklch(0.60 0.02 265)',
                    }}
                  >
                    {r.type}
                  </span>
                </td>
                <td
                  className="px-4 py-3 text-xs"
                  style={{ color: 'oklch(0.45 0.02 265)', fontFamily: 'var(--font-mono)' }}
                >
                  {r.category?.name ?? '—'}
                </td>
                <td
                  className="px-4 py-3 text-xs"
                  style={{ color: 'oklch(0.38 0.02 265)', fontFamily: 'var(--font-mono)' }}
                >
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => setEditing(r)}
                      className="px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 hover:scale-105"
                      style={{
                        background: 'oklch(0.66 0.18 280 / 0.1)',
                        color: 'oklch(0.66 0.18 280)',
                        border: '1px solid oklch(0.66 0.18 280 / 0.2)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingId(r.id)}
                      className="px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 hover:scale-105"
                      style={{
                        background: 'oklch(0.65 0.22 25 / 0.1)',
                        color: 'oklch(0.65 0.22 25)',
                        border: '1px solid oklch(0.65 0.22 25 / 0.2)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Delete
                    </button>
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
          <div
            className="modal-box max-w-xl max-h-[90vh] overflow-y-auto"
            style={{
              background: 'oklch(0.11 0.018 265)',
              border: '1px solid oklch(0.22 0.02 265)',
            }}
          >
            <h3
              className="font-bold text-lg mb-5"
              style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.92 0.012 265)' }}
            >
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
          <div
            className="modal-box"
            style={{
              background: 'oklch(0.11 0.018 265)',
              border: '1px solid oklch(0.65 0.22 25 / 0.3)',
            }}
          >
            <h3
              className="font-bold text-lg"
              style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.92 0.012 265)' }}
            >
              Delete resource?
            </h3>
            <p className="text-sm mt-2" style={{ color: 'oklch(0.50 0.02 265)' }}>
              This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                style={{
                  background: 'oklch(0.18 0.015 265)',
                  color: 'oklch(0.60 0.02 265)',
                  fontFamily: 'var(--font-display)',
                }}
                onClick={() => setDeletingId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 hover:scale-105 active:scale-95"
                style={{
                  background: 'oklch(0.65 0.22 25)',
                  color: '#fff',
                  boxShadow: '0 0 16px oklch(0.65 0.22 25 / 0.35)',
                  fontFamily: 'var(--font-display)',
                  opacity: deleteMutation.isPending ? 0.7 : 1,
                }}
                onClick={() => deleteMutation.mutate(deletingId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <div className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#fff', borderTopColor: 'transparent' }} />
                ) : 'Delete'}
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
      onSuccess: () => { setForm(EMPTY_FORM); setShowForm(false) },
      onError: (err: any) => {
        setError(err?.message ?? 'Failed to create type. The value may already exist.')
      },
    })
  }

  const inputStyle: React.CSSProperties = {
    background: 'oklch(0.13 0.016 265)',
    border: '1px solid oklch(0.22 0.02 265)',
    borderRadius: '0.5rem',
    color: 'var(--color-base-content)',
    padding: '0.5rem 0.75rem',
    width: '100%',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: 'oklch(0.48 0.02 265)' }}>
          Types drive badge color and filter options. Add new types here — no code changes needed.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shrink-0 ml-4 transition-all duration-150 hover:scale-105 active:scale-95"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-primary-content)',
            boxShadow: '0 0 16px oklch(0.78 0.17 75 / 0.25)',
            fontFamily: 'var(--font-display)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add type
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid oklch(0.18 0.015 265)' }}>
        <table className="admin-table w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid oklch(0.18 0.015 265)' }}>
              {['Emoji', 'Value', 'Label', 'Color', 'Preview', ''].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'oklch(0.38 0.02 265)', fontFamily: 'var(--font-mono)', background: 'oklch(0.11 0.018 265)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="text-center py-12">
                <div className="inline-block w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
              </td></tr>
            )}
            {resourceTypes.map((rt) => (
              <tr key={rt.value} style={{ borderBottom: '1px solid oklch(0.15 0.015 265 / 0.5)' }}>
                <td className="px-4 py-3 text-xl">{rt.emoji}</td>
                <td className="px-4 py-3 text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'oklch(0.55 0.02 265)' }}>{rt.value}</td>
                <td className="px-4 py-3 font-medium" style={{ color: 'oklch(0.85 0.012 265)', fontFamily: 'var(--font-display)' }}>{rt.label}</td>
                <td className="px-4 py-3 text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'oklch(0.40 0.02 265)' }}>{rt.color}</td>
                <td className="px-4 py-3">
                  <span className={`badge badge-sm font-bold uppercase tracking-wide badge-${rt.color}`}>
                    {rt.emoji} {rt.value}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150"
                    style={{
                      background: 'oklch(0.65 0.22 25 / 0.1)',
                      color: 'oklch(0.65 0.22 25)',
                      border: '1px solid oklch(0.65 0.22 25 / 0.2)',
                      fontFamily: 'var(--font-mono)',
                    }}
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
          <div className="modal-box max-w-sm" style={{ background: 'oklch(0.11 0.018 265)', border: '1px solid oklch(0.22 0.02 265)' }}>
            <h3 className="font-bold text-lg mb-5" style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.92 0.012 265)' }}>
              New resource type
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { field: 'value', label: 'Slug (value) *', placeholder: 'e.g. course', mono: true },
                { field: 'label', label: 'Label *', placeholder: 'e.g. Course', mono: false },
                { field: 'emoji', label: 'Emoji *', placeholder: 'e.g. 🎓', mono: false },
              ].map(({ field, label, placeholder, mono }) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'oklch(0.45 0.02 265)', fontFamily: 'var(--font-mono)' }}>
                    {label}
                  </label>
                  <input
                    required
                    style={{ ...inputStyle, fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)' }}
                    placeholder={placeholder}
                    value={(form as any)[field]}
                    onChange={(e) => set(field, field === 'value' ? e.target.value.toLowerCase().replace(/\s+/g, '-') : e.target.value)}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'oklch(0.45 0.02 265)', fontFamily: 'var(--font-mono)' }}>
                  Badge color *
                </label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.color}
                  onChange={(e) => set('color', e.target.value)}
                >
                  {COLOR_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div className="flex items-center gap-2 py-2">
                <span className="text-xs" style={{ color: 'oklch(0.40 0.02 265)', fontFamily: 'var(--font-mono)' }}>PREVIEW:</span>
                <span className={`badge badge-sm font-bold uppercase tracking-wide badge-${form.color}`}>
                  {form.emoji} {form.value || 'type'}
                </span>
              </div>

              {error && (
                <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'oklch(0.65 0.22 25 / 0.1)', color: 'oklch(0.65 0.22 25)', border: '1px solid oklch(0.65 0.22 25 / 0.25)' }}>
                  {error}
                </div>
              )}

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                  style={{ background: 'oklch(0.18 0.015 265)', color: 'oklch(0.55 0.02 265)', fontFamily: 'var(--font-display)' }}
                  onClick={() => { setShowForm(false); setError(null) }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 hover:scale-105"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-primary-content)', fontFamily: 'var(--font-display)', opacity: createMutation.isPending ? 0.7 : 1 }}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <div className="inline-block w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--color-primary-content)', borderTopColor: 'transparent' }} />
                  ) : 'Create'}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => { setShowForm(false); setError(null) }} />
        </dialog>
      )}

      {/* Delete confirm */}
      {deletingValue && (
        <dialog className="modal modal-open">
          <div className="modal-box" style={{ background: 'oklch(0.11 0.018 265)', border: '1px solid oklch(0.65 0.22 25 / 0.3)' }}>
            <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.92 0.012 265)' }}>
              Delete type "{deletingValue}"?
            </h3>
            <p className="text-sm mt-2" style={{ color: 'oklch(0.50 0.02 265)' }}>
              This will fail if any resources are using this type. Reassign them first.
            </p>
            <div className="modal-action">
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: 'oklch(0.18 0.015 265)', color: 'oklch(0.55 0.02 265)', fontFamily: 'var(--font-display)' }}
                onClick={() => setDeletingValue(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition-all"
                style={{ background: 'oklch(0.65 0.22 25)', color: '#fff', fontFamily: 'var(--font-display)', boxShadow: '0 0 12px oklch(0.65 0.22 25 / 0.3)', opacity: deleteMutation.isPending ? 0.7 : 1 }}
                onClick={() => deleteMutation.mutate(deletingValue, { onSuccess: () => setDeletingValue(null) })}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <div className="inline-block w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: '#fff', borderTopColor: 'transparent' }} />
                ) : 'Delete'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeletingValue(null)} />
        </dialog>
      )}
    </>
  )
}
