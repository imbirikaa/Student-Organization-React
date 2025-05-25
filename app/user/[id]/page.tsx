'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { User, Mail, FileText, Lock, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface UserType {
  id: number
  first_name: string
  last_name: string
  nickname: string
  email: string
  about?: string
  avatar_url?: string
}

export default function UserProfilePage() {
  const { id } = useParams()
  const [user, setUser] = useState<UserType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    fetch(`http://localhost:8000/api/users/${id}`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Kullanıcı bulunamadı')
        return res.json()
      })
      .then(data => setUser(data))
      .catch(err => setError(err.message))
  }, [id])

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>
  if (!user) return <div className="text-gray-400 text-center mt-10">Yükleniyor...</div>

  return (
    <div>
      {/* Cover image */}
      <div className="relative h-64 w-full">
        <Image src="/placeholder.svg?height=300&width=1200" alt="Cover image" fill className="object-cover" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative z-10">
              <Image
                src={user.avatar_url || '/placeholder.svg?height=120&width=120'}
                alt="Profile picture"
                width={120}
                height={120}
                className="rounded-full border-4 border-gray-900"
              />
            </div>

            <div className="flex-1 mt-4 md:mt-16">
              <h1 className="text-2xl font-bold mb-1">{user.first_name + " " + user.last_name}</h1>
              <p className="text-gray-400 text-sm mb-4">@{user.nickname}</p>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-teal-500 font-bold text-xl">4</div>
                  <div className="text-xs text-gray-400">Topluluğa Üye</div>
                </div>
                <div>
                  <div className="text-teal-500 font-bold text-xl">9</div>
                  <div className="text-xs text-gray-400">Arkadaş</div>
                </div>
                <div>
                  <div className="text-teal-500 font-bold text-xl">462</div>
                  <div className="text-xs text-gray-400">Konu Açtı</div>
                </div>
                <div>
                  <div className="text-teal-500 font-bold text-xl">6</div>
                  <div className="text-xs text-gray-400">Etkinliğe Katıldı</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 md:mt-16">
              <Button variant="outline" className="rounded-full border-teal-500 text-teal-500">
                <User className="h-4 w-4 mr-2" />
                Takip et
              </Button>
              <Button variant="outline" className="rounded-full border-teal-500 text-teal-500 p-2">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* Navigation tabs */}
        <div className="border-b border-gray-800 mb-8">
          <div className="flex overflow-x-auto">
            <Link href="#" className="px-6 py-3 text-teal-500 border-b-2 border-teal-500 font-medium">
              Panel
            </Link>
            <Link href="#" className="px-6 py-3 text-gray-400 hover:text-gray-300">
              Konular
            </Link>
            <Link href="#" className="px-6 py-3 text-gray-400 hover:text-gray-300">
              Topluluklar
            </Link>
            <Link href="#" className="px-6 py-3 text-gray-400 hover:text-gray-300">
              Sertifikalar
            </Link>
            <Link href="#" className="px-6 py-3 text-gray-400 hover:text-gray-300">
              Etkinlikler
            </Link>
            <Link href="#" className="px-6 py-3 text-gray-400 hover:text-gray-300">
              Arkadaşlar
            </Link>
          </div>
        </div>

        {/* Profile content */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* About me */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-teal-500 mr-2" />
              <h2 className="text-lg font-medium">Hakkımda</h2>
            </div>
            <p className="text-gray-400 text-sm">{user.about || "Henüz bir hakkımda yazısı bulunmuyor."}</p>
          </div>

          {/* Private profile */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Lock className="h-5 w-5 text-teal-500 mr-2" />
              <h2 className="text-lg font-medium">Gizli Profil</h2>
            </div>
            <p className="text-gray-400 text-sm">Profil bilgileri yalnızca üyeler için bir kısmını görebilirsiniz.</p>
          </div>

          {/* Activities */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-teal-500 mr-2" />
                <h2 className="text-lg font-medium">Etkinlikler</h2>
              </div>
              <span className="text-xs text-gray-400">Son 3 Etkinlik</span>
            </div>

            {[1, 2].map((activity) => (
              <div key={activity} className="mb-4 border-b border-gray-800 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">deneme etkinliği</span>
                </div>
                <p className="text-xs text-gray-400 pl-10">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-teal-500">
            <FileText className="h-6 w-6 mr-2" />
            Konularım
          </h2>

          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((topic) => (
              <div key={topic} className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Sklerozan Kolanjit Ders Notları PDF</h3>
                    <p className="text-xs text-gray-400">2024-09-25 22:31:10</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}