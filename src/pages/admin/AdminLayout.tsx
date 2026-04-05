import { Link, Outlet } from 'react-router-dom'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { useAdmin } from '../../hooks/useAdmin'

export function AdminLayout() {
  const { logout } = useAdmin()

  return (
    <AdminGuard>
      <PageWrapper>
        <div
          className="px-5 py-2.5 flex items-center gap-4"
          style={{
            borderBottom: '1px solid oklch(0.18 0.015 265)',
            background: 'oklch(0.11 0.018 265 / 0.8)',
          }}
        >
          <span
            className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-widest"
            style={{
              background: 'oklch(0.78 0.17 75 / 0.15)',
              color: 'var(--color-primary)',
              border: '1px solid oklch(0.78 0.17 75 / 0.3)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Admin
          </span>
          <Link
            to="/admin/dashboard"
            className="text-sm font-semibold transition-colors duration-150"
            style={{ color: 'oklch(0.65 0.02 265)', fontFamily: 'var(--font-display)' }}
          >
            Dashboard
          </Link>
          <button
            onClick={logout}
            className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
            style={{
              color: 'oklch(0.50 0.02 265)',
              background: 'oklch(0.16 0.015 265)',
              border: '1px solid oklch(0.22 0.02 265)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Sign out
          </button>
        </div>
        <Outlet />
      </PageWrapper>
    </AdminGuard>
  )
}
