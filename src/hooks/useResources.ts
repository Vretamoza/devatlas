import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useFilterStore } from '../store/filterStore'
import type { Resource } from '../types'

export function useResources(overrides?: { category?: string; subcategory?: string }) {
  const { query, category, subcategory, types, language, tags, sort } = useFilterStore()

  const effectiveCategory = overrides?.category ?? category
  const effectiveSubcategory = overrides?.subcategory ?? subcategory

  return useQuery<Resource[]>({
    queryKey: ['resources', query, effectiveCategory, effectiveSubcategory, types, language, tags, sort],
    queryFn: async () => {
      let q = supabase
        .from('resources')
        .select('*, category:categories(*), subcategory:subcategories(*), tags:resource_tags(tag:tags(*))')

      if (effectiveCategory) q = q.eq('category_id', effectiveCategory)
      if (effectiveSubcategory) q = q.eq('subcategory_id', effectiveSubcategory)
      if (types.length > 0) q = q.in('type', types)
      if (language) q = q.eq('language', language)
      if (query) q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`)

      if (sort === 'newest') q = q.order('created_at', { ascending: false })
      else if (sort === 'title') q = q.order('title')
      else if (sort === 'rating') q = q.order('rating', { ascending: false, nullsFirst: false })

      const { data, error } = await q
      if (error) throw error

      // flatten tags join
      return (data ?? []).map((r: any) => ({
        ...r,
        tags: (r.tags ?? []).map((rt: any) => rt.tag).filter(Boolean),
      }))
    },
  })
}

export function useResource(id: string) {
  return useQuery<Resource>({
    queryKey: ['resource', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*, category:categories(*), subcategory:subcategories(*), tags:resource_tags(tag:tags(*))')
        .eq('id', id)
        .single()
      if (error) throw error
      return {
        ...data,
        tags: (data.tags ?? []).map((rt: any) => rt.tag).filter(Boolean),
      }
    },
  })
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tags').select('*').order('name')
      if (error) throw error
      return data
    },
  })
}
