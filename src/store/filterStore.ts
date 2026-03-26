import { create } from 'zustand'
import type { ResourceType, SortOption } from '../types'

interface FilterStore {
  query: string
  category: string | null
  subcategory: string | null
  types: ResourceType[]
  tags: string[]
  sort: SortOption
  isAdmin: boolean
  setQuery: (q: string) => void
  setCategory: (c: string | null) => void
  setSubcategory: (s: string | null) => void
  toggleType: (t: ResourceType) => void
  toggleTag: (tag: string) => void
  setSort: (s: SortOption) => void
  clearFilters: () => void
  setAdmin: (v: boolean) => void
}

const ALL_TYPES: ResourceType[] = ['documentation', 'tool', 'article', 'video']

export const useFilterStore = create<FilterStore>((set) => ({
  query: '',
  category: null,
  subcategory: null,
  types: ALL_TYPES,
  tags: [],
  sort: 'newest',
  isAdmin: false,
  setQuery: (q) => set({ query: q }),
  setCategory: (c) => set({ category: c, subcategory: null }),
  setSubcategory: (s) => set({ subcategory: s }),
  toggleType: (t) =>
    set((state) => ({
      types: state.types.includes(t)
        ? state.types.filter((x) => x !== t)
        : [...state.types, t],
    })),
  toggleTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag)
        ? state.tags.filter((x) => x !== tag)
        : [...state.tags, tag],
    })),
  setSort: (s) => set({ sort: s }),
  clearFilters: () =>
    set({ query: '', category: null, subcategory: null, types: ALL_TYPES, tags: [] }),
  setAdmin: (v) => set({ isAdmin: v }),
}))
