// app/context/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: any
  setUser: (user: any) => void
  fetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
  fetchUser: async () => { },
})

const getCookieValue = (name: string): string => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return ''
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)

  const fetchUser = async () => {
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      })

      const token = getCookieValue('XSRF-TOKEN')

      const res = await fetch('http://localhost:8000/api/user', {
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': token,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else if (res.status === 401) {
        setUser(null) // User not logged in — just clear user silently
      } else {
        console.error('Unexpected error fetching user', res.status)
      }
    } catch (err) {
      console.error('Fetch failed', err)
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  return useContext(AuthContext)
}
