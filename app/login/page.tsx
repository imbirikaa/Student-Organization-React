'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '../context/auth-context'

export default function LoginPage() {
  const { fetchUser } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const getCookieValue = (name: string): string => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()!.split(';').shift()!
    return ''
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Step 1: Get CSRF cookie
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      })

      // Step 2: Get the XSRF token from cookie
      const xsrfToken = decodeURIComponent(getCookieValue('XSRF-TOKEN'))

      // Step 3: Login with credentials
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        await fetchUser()
        router.push('/')
      } else {
        const data = await res.json()
        setError(data.message || 'Giriş başarısız')
      }
    } catch (err) {
      setError('Bağlantı hatası')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md border border-gray-800">
        <h2 className="text-2xl font-bold text-center text-teal-400 mb-6">Giriş Yap</h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center bg-red-900/30 px-3 py-2 rounded">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Şifre</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full rounded-full bg-teal-500 hover:bg-teal-400 text-white">
            Giriş Yap
          </Button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          Henüz hesabın yok mu? <a className="text-teal-400 hover:underline" href="/register">Kayıt Ol</a>
        </p>
      </div>
    </div>
  )
}
