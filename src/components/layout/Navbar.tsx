import { Link, useLocation } from 'react-router-dom'
import { SearchBar } from '../search/SearchBar'

export function Navbar() {
  const location = useLocation()

  return (
    <header
      className="navbar-glass sticky top-0 z-30 flex items-center justify-between px-5 h-[--spacing-nav] gap-4"
      style={{ minHeight: 'var(--spacing-nav)' }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-0 shrink-0 select-none group"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span
          className="text-lg font-bold tracking-tight transition-opacity duration-200 group-hover:opacity-80"
          style={{ color: 'var(--color-base-content)' }}
        >
          Dev
        </span>
        <span
          className="text-lg font-bold tracking-tight transition-opacity duration-200 group-hover:opacity-80"
          style={{
            color: 'var(--color-primary)',
            textShadow: '0 0 20px oklch(0.78 0.17 75 / 0.4)',
          }}
        >
          Atlas
        </span>
      </Link>

      {/* Search — centered on desktop */}
      <div className="hidden md:flex flex-1 max-w-sm mx-auto">
        <SearchBar />
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        <Link
          to="/explore"
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            color: location.pathname === '/explore'
              ? 'var(--color-primary)'
              : 'oklch(0.58 0.02 265)',
            background: location.pathname === '/explore'
              ? 'oklch(0.78 0.17 75 / 0.1)'
              : 'transparent',
          }}
        >
          Explore
        </Link>
      </nav>
    </header>
  )
}
