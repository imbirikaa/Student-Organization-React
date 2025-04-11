import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Info, MapPin, User } from "lucide-react"

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner ads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="bg-blue-600 rounded-lg overflow-hidden h-20 flex items-center">
          <div className="w-1/4 flex justify-center">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Reeder"
              width={80}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="w-3/4 flex justify-end pr-4">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Kampüs Sözlük"
              width={80}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
        <div className="bg-blue-600 rounded-lg overflow-hidden h-20 flex items-center">
          <div className="w-1/4 flex justify-center">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Reeder"
              width={80}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="w-3/4 flex justify-end pr-4">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Kampüs Sözlük"
              width={80}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Community header */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex flex-col items-center">
              <Image
                src="/placeholder.svg?height=120&width=120"
                alt="Community logo"
                width={120}
                height={120}
                className="rounded-full mb-4"
              />
              <h1 className="text-xl font-bold mb-2 text-center">KAMPÜS SÖZLÜK</h1>

              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-teal-500" />
                <span className="text-sm text-gray-400">7 Üye</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-teal-500" />
                <span className="text-sm text-gray-400">5 Etkinlik</span>
              </div>

              <Button className="w-full bg-teal-500 hover:bg-teal-600 rounded-full mb-4">Üye Ol</Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center text-teal-500">
              <Calendar className="h-6 w-6 mr-2" />
              Etkinlikler
            </h2>

            <div className="grid gap-4">
              {[1, 2, 3].map((event) => (
                <div key={event} className="border border-blue-900 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">2025-06-18</div>
                      <h3 className="font-medium">deneme etkinliği</h3>
                    </div>
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-sm">BORDO SALON</div>
                    </div>
                    <div className="flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-sm">BORDO SALON</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Button className="bg-teal-500 hover:bg-teal-600 rounded-full">Hepsini Gör</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Management section */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="md:col-span-1">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Yönetici Listesi
            </h2>

            <ul className="space-y-4">
              <li>
                <div className="font-medium">AliEmre</div>
                <div className="text-xs text-gray-400">Yönetim Kurulu Başkanı</div>
              </li>
              <li>
                <div className="font-medium">TamaUffes</div>
                <div className="text-xs text-gray-400">YK Başkan Yardımcısı</div>
              </li>
              <li>
                <div className="font-medium">ImbiKira0</div>
                <div className="text-xs text-gray-400">Girişimcilik ve İnovasyon Direktörü</div>
              </li>
              <li>
                <div className="font-medium">qwesdqwe19</div>
                <div className="text-xs text-gray-400">Sekreter</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
