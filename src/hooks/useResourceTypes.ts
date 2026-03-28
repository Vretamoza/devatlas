import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { ResourceTypeRecord } from '../types'

export function useResourceTypes() {
  return useQuery<ResourceTypeRecord[]>({
    queryKey: ['resource_types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_types')
        .select('*')
        .order('created_at')
      if (error) throw error
      return data ?? []
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateResourceType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Omit<ResourceTypeRecord, 'created_at'>) => {
      const { error } = await supabase.from('resource_types').insert(payload)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resource_types'] }),
  })
}

export function useDeleteResourceType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (value: string) => {
      const { error } = await supabase.from('resource_types').delete().eq('value', value)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resource_types'] }),
  })
}
