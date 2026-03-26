import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Category, Subcategory } from '../types'

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return data
    },
  })
}

export function useSubcategories(categoryId?: string | null) {
  return useQuery<Subcategory[]>({
    queryKey: ['subcategories', categoryId],
    queryFn: async () => {
      let q = supabase.from('subcategories').select('*').order('name')
      if (categoryId) q = q.eq('category_id', categoryId)
      const { data, error } = await q
      if (error) throw error
      return data
    },
  })
}
