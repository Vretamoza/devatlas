import { Link } from 'react-router-dom'
import { ThemeToggle } from '../ui/ThemeToggle'
import { SearchBar } from '../search/SearchBar'

export function Navbar() {
  return (
    <div className="navbar bg-base-100/85 backdrop-blur border-b border-base-200 sticky top-0 z-30 px-4 gap-2">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-base font-semibold px-2">
          Dev<span className="text-primary">Atlas</span>
        </Link>
      </div>
      <div className="navbar-center hidden md:flex w-full max-w-sm">
        <SearchBar />
      </div>
      <div className="navbar-end gap-1">
        <ThemeToggle />
      </div>
    </div>
  )
}
