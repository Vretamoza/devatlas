import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { PageWrapper } from '../components/layout/PageWrapper'
import { SearchBar } from '../components/search/SearchBar'
import { ResourceCard } from '../components/resource/ResourceCard'
import { useResources } from '../hooks/useResources'
import { useCategories } from '../hooks/useCategories'
import { useResourceTypes } from '../hooks/useResourceTypes'
import { useFilterStore } from '../store/filterStore'
import { ResourceDrawer } from '../components/resource/ResourceDrawer'
import type { Resource } from '../types'
import { useState } from 'react'

const CATEGORY_ICONS: Record<string, string> = {
  frontend: '🎨', backend: '⚙️', devops: '🚀', ai: '🤖',
  mobile: '📱', database: '🗄️', security: '🔒', design: '✏️',
}

export function Home() {
  const { data: recent, isLoading } = useResources()
  const { data: categories } = useCategories()
  const { data: resourceTypes = [] } = useResourceTypes()
  const setCategory = useFilterStore((s) => s.setCategory)
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Resource | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const els = hero.querySelectorAll('[data-hero]')
    gsap.fromTo(
      els,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
      }
    )
  }, [])

  useEffect(() => {
    const grid = categoriesRef.current
    if (!grid || !categories?.length) return
    const cards = grid.querySelectorAll('[data-cat]')
    gsap.fromTo(
      cards,
      { opacity: 0, y: 16, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.4,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.4,
      }
    )
  }, [categories])

  const handleTypeFilter = (type: string) => {
    navigate(`/explore?type=${type}`)
  }

  return (
    <PageWrapper>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="flex flex-col items-center justify-center text-center px-4 py-28 gap-7 relative overflow-hidden"
      >
        {/* Radial accent behind hero */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% -10%, oklch(0.78 0.17 75 / 0.07) 0%, transparent 70%)',
          }}
        />

        {/* Badge */}
        <div
          data-hero
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'oklch(0.72 0.17 162 / 0.1)',
            border: '1px solid oklch(0.72 0.17 162 / 0.3)',
            color: 'oklch(0.72 0.17 162)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: 'oklch(0.72 0.17 162)',
              boxShadow: '0 0 8px oklch(0.72 0.17 162)',
              animation: 'glowPulse 2s ease-in-out infinite',
            }}
          />
          CURATED BY DEVS, FOR DEVS
        </div>

        {/* Headline */}
        <h1
          data-hero
          className="text-5xl sm:text-6xl lg:text-7xl font-bold max-w-3xl leading-[1.05]"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.03em',
            color: 'oklch(0.94 0.012 265)',
          }}
        >
          The curated<br />
          <span
            style={{
              color: 'var(--color-primary)',
              textShadow: '0 0 40px oklch(0.78 0.17 75 / 0.4)',
            }}
          >
            tech atlas.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          data-hero
          className="max-w-md text-lg leading-relaxed"
          style={{ color: 'oklch(0.50 0.02 265)' }}
        >
          Documentation, tools, articles and videos —<br />
          organized so you find what actually matters.
        </p>

        {/* Search */}
        <div data-hero className="w-full max-w-lg">
          <SearchBar placeholder="Search anything..." />
        </div>

        {/* CTA */}
        <div data-hero className="flex items-center gap-3">
          <Link
            to="/explore"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-primary-content)',
              boxShadow: '0 0 24px oklch(0.78 0.17 75 / 0.35)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Explore all resources
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      {categories && categories.length > 0 && (
        <section className="px-4 sm:px-8 max-w-5xl mx-auto mb-20">
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: 'oklch(0.35 0.02 265)', fontFamily: 'var(--font-mono)' }}
          >
            Browse by category
          </h2>
          <div ref={categoriesRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                data-cat
                to={`/explore?category=${cat.id}`}
                onClick={() => setCategory(cat.id)}
                className="group flex flex-col gap-3 p-5 rounded-xl transition-all duration-250 hover:-translate-y-1"
                style={{
                  background: 'oklch(0.13 0.016 265)',
                  border: '1px solid oklch(0.22 0.02 265 / 0.6)',
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.78 0.17 75 / 0.4)'
                  e.currentTarget.style.boxShadow = '0 8px 24px -4px oklch(0.78 0.17 75 / 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.22 0.02 265 / 0.6)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span className="text-3xl">{CATEGORY_ICONS[cat.name.toLowerCase()] ?? '📁'}</span>
                <span
                  className="font-bold text-sm"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'oklch(0.88 0.012 265)',
                  }}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── BROWSE BY TYPE ────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 max-w-5xl mx-auto mb-20">
        <h2
          className="text-xs font-bold uppercase tracking-widest mb-5"
          style={{ color: 'oklch(0.35 0.02 265)', fontFamily: 'var(--font-mono)' }}
        >
          Browse by type
        </h2>
        <div className="flex flex-wrap gap-2">
          {resourceTypes.map(({ value, label, emoji }) => (
            <button
              key={value}
              onClick={() => handleTypeFilter(value)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'oklch(0.13 0.016 265)',
                border: '1px solid oklch(0.22 0.02 265)',
                color: 'oklch(0.62 0.02 265)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'oklch(0.78 0.17 75 / 0.4)'
                e.currentTarget.style.color = 'var(--color-primary)'
                e.currentTarget.style.background = 'oklch(0.78 0.17 75 / 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'oklch(0.22 0.02 265)'
                e.currentTarget.style.color = 'oklch(0.62 0.02 265)'
                e.currentTarget.style.background = 'oklch(0.13 0.016 265)'
              }}
            >
              <span>{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── RECENTLY ADDED ───────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 max-w-5xl mx-auto mb-24">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'oklch(0.35 0.02 265)', fontFamily: 'var(--font-mono)' }}
          >
            Recently added
          </h2>
          <Link
            to="/explore"
            className="flex items-center gap-1 text-sm font-medium transition-colors duration-150 group"
            style={{ color: 'oklch(0.55 0.02 265)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.55 0.02 265)' }}
          >
            View all
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton rounded-xl h-44" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recent?.slice(0, 4).map((r) => (
              <ResourceCard key={r.id} resource={r} onClick={setSelected} />
            ))}
          </div>
        )}
      </section>

      <ResourceDrawer resource={selected} onClose={() => setSelected(null)} />
    </PageWrapper>
  )
}
