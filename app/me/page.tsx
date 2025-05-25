'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Mail, FileText, Lock, Clock } from "lucide-react"
import { useAuth } from "@/app/context/auth-context"

export default function UserProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Giriş yapmadınız.
      </div>
    )
  }

  return (
    <div>
      {/* Cover image */}
      <div className="relative h-64 w-full">
        <Image src="/placeholder.svg?height=300&width=1200" alt="Cover image" fill className="object-cover" />
      </div>

      {/* Profile info */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile image */}
            <div className="relative z-10">
              <Image
                src={user.avatar_url || "/placeholder.svg?height=120&width=120"}
                alt="Profile picture"
                width={120}
                height={120}
                className="rounded-full border-4 border-gray-900"
              />
            </div>

            {/* Profile stats */}
            <div className="flex-1 mt-4 md:mt-16">
              <h1 className="text-2xl font-bold mb-1">{user.first_name + " " + user.last_name}</h1>
              <p className="text-gray-400 text-sm mb-4">@{user.nickname}</p>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-teal-500 font-bold text-xl">{user.community_count ?? 0}</div>
                  <div className="text-xs text-gray-400">Topluluğa Üye</div>
                </div>
                <div>
                  <div className="text-teal-500 font-bold text-xl">{user.friend_count ?? 0}</div>
                  <div className="text-xs text-gray-400">Arkadaş</div>
                </div>
                <div>
                  <div className="text-teal-500 font-bold text-xl">{user.topic_count ?? 0}</div>
                  <div className="text-xs text-gray-400">Konu Açtı</div>
                </div>
                <div>
                  <div className="text-teal-500 font-bold text-xl">{user.event_count ?? 0}</div>
                  <div className="text-xs text-gray-400">Etkinliğe Katıldı</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4 md:mt-16">
              <Button variant="outline" className="rounded-full border-teal-500 text-teal-500">
                <User className="h-4 w-4 mr-2" />
                Takip et/gönder
              </Button>
              <Button variant="outline" className="rounded-full border-teal-500 text-teal-500 p-2">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* The rest of the component remains unchanged */}
        {/* You can dynamically render user.certificates, user.topics, etc., as needed */}
      </div>
    </div>
  )
}
