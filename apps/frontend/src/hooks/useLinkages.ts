import { useState, useEffect } from 'react'
import type { Linkage } from '../types'
import { getLinkages } from '../services/api'

interface UseLinkagesResult {
  linkages: Linkage[]
  loading: boolean
  error: string | null
}

export default function useLinkages(): UseLinkagesResult {
  const [linkages, setLinkages] = useState<Linkage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getLinkages()
      .then(data => {
        if (!cancelled) {
          setLinkages(data)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load linkages')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return { linkages, loading, error }
}
