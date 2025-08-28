import { useState, useEffect } from 'react'
import { supabase } from '@/lib/Client'

const useUserSession = () => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
      }
    )

    fetchSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { session, loading }
}

export default useUserSession
