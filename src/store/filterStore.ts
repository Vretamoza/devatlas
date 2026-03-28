import { create } from 'zustand'
import type { SortOption } from '../types'

interface FilterStore {
  query: string
  category: string | null
  subcategory: string | null
  types: string[]   // empty = no type filter (show all)
  language: string | null  // null = all languages
  tags: string[]
  sort: SortOption
  isAdmin: boolean
  setQuery: (q: string) => void
  setCategory: (c: string | null) => void
  setSubcategory: (s: string | null) => void
  setTypes: (t: string[]) => void
  toggleType: (t: string) => void
  setLanguage: (l: string | null) => void
  toggleTag: (tag: string) => void
  setSort: (s: SortOption) => void
  clearFilters: () => void
  setAdmin: (v: boolean) => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  query: '',
  category: null,
  subcategory: null,
  types: [],
  language: null,
  tags: [],
  sort: 'newest',
  isAdmin: false,
  setQuery: (q) => set({ query: q }),
  setCategory: (c) => set({ category: c, subcategory: null }),
  setSubcategory: (s) => set({ subcategory: s }),
  setTypes: (t) => set({ types: t }),
  toggleType: (t) =>
    set((state) => ({
      types: state.types.includes(t)
        ? state.types.filter((x) => x !== t)
        : [...state.types, t],
    })),
  setLanguage: (l) => set({ language: l }),
  toggleTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag)
        ? state.tags.filter((x) => x !== tag)
        : [...state.tags, tag],
    })),
  setSort: (s) => set({ sort: s }),
  clearFilters: () =>
    set({ query: '', category: null, subcategory: null, types: [], language: null, tags: [] }),
  setAdmin: (v) => set({ isAdmin: v }),
}))
