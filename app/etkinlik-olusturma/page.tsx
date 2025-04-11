import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronDown, Upload } from "lucide-react"

export default function EventCreationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner ads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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

      <h1 className="text-2xl font-bold mb-6">Etkinlik Oluşturma</h1>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <div className="flex items-center border border-blue-900 rounded-lg p-3 bg-gray-900">
              <Upload className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-blue-500">Etkinlik Resmi</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Etkinlik Başlığı"
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <textarea
            placeholder="Etkinlik Hakkında"
            rows={6}
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Etkinlik Başlama Zamanı</label>
            <div className="relative">
              <div className="flex items-center border border-blue-900 rounded-lg p-3 bg-gray-900">
                <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-gray-400">December 24, 2024</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Son Başvuru Tarihi</label>
            <div className="relative">
              <div className="flex items-center border border-blue-900 rounded-lg p-3 bg-gray-900">
                <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-gray-400">December 24, 2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Etkinlik Yeri"
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Sertifika İçin Katılınması Gereken Oturum Sayısı"
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-blue-900 text-gray-300 cursor-pointer">
              <span>Sertifika Seç (Opsiyonel)</span>
              <ChevronDown className="h-5 w-5" />
            </div>
            <div className="hidden absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
              <div className="p-2 hover:bg-gray-700 cursor-pointer">Sertifika İstemiyorum</div>
              <div className="p-2 hover:bg-gray-700 cursor-pointer">Özel Sertifika Yükle</div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg">DEVAM ET</Button>
      </div>
    </div>
  )
}
