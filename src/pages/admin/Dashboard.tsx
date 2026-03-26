import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useResources } from '../../hooks/useResources'
import { useCategories } from '../../hooks/useCategories'
import { ResourceForm } from '../../components/admin/ResourceForm'
import type { Resource } from '../../types'

export function Dashboard() {
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
    <div className="max-w-6xl mx-auto px-4 py-8">
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
    </div>
  )
}
