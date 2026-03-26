import { Link, Outlet } from 'react-router-dom'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { useAdmin } from '../../hooks/useAdmin'

export function AdminLayout() {
  const { logout } = useAdmin()

  return (
    <AdminGuard>
      <PageWrapper>
        <div className="border-b border-base-200 px-4 py-2 flex items-center gap-4 bg-base-200/50">
          <span className="badge badge-warning badge-sm">Admin</span>
          <Link to="/admin/dashboard" className="text-sm hover:underline">Dashboard</Link>
          <button onClick={logout} className="btn btn-ghost btn-xs ml-auto">Sign out</button>
        </div>
        <Outlet />
      </PageWrapper>
    </AdminGuard>
  )
}
