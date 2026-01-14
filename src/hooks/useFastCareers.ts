'use client';

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Job } from '@/types/database'

// Lightweight, fast-loading hook specifically for careers page with real-time updates
export const useFastCareers = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchActiveJobs = async () => {
      try {
        setLoading(true)
        setError(null)

        // Direct supabase query for maximum speed
        const { data, error: fetchError } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        if (mounted) {
          setJobs(data || [])
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
          console.error('Error fetching jobs:', err)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Immediate fetch
    fetchActiveJobs()

    // Set up real-time subscription for instant updates
    const channel = supabase
      .channel('jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
          filter: 'status=eq.active'
        },
        (payload) => {
          console.log('Real-time job update:', payload)
          // Refetch jobs when there are changes
          fetchActiveJobs()
        }
      )
      .subscribe()

    return () => {
      mounted = false
      channel.unsubscribe()
    }
  }, [])

  return { jobs, loading, error }
}
