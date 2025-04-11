import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export default function AccountCreationPage() {
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

      <h1 className="text-2xl font-bold mb-6">Hesap Oluştur</h1>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Adınız"
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Soyadınız"
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <input
            type="email"
            placeholder="E-posta"
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="mb-6">
          <input
            type="tel"
            placeholder="Telefon numarası"
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Kullanıcı adı"
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <input
              type="password"
              placeholder="Parola"
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Parola tekrarı"
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-blue-900 text-gray-300 cursor-pointer">
              <span>Bir Bölümü seç</span>
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">DAHA SONRA SEÇ</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input type="checkbox" id="kvkk" className="mr-2 h-5 w-5 rounded border-gray-700 bg-gray-900" />
              <label htmlFor="kvkk" className="text-sm">
                KVKK AYDINLATMA METNİ
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="privacy"
                className="mr-2 h-5 w-5 rounded border-gray-700 bg-gray-900"
                checked
              />
              <label htmlFor="privacy" className="text-sm">
                GİZLİLİK POLİTİKALARI
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="terms" className="mr-2 h-5 w-5 rounded border-gray-700 bg-gray-900" />
              <label htmlFor="terms" className="text-sm">
                KULLANICI SÖZLEŞMESİNİ
              </label>
            </div>
          </div>
        </div>

        <Button className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg">DEVAM ET</Button>
      </div>
    </div>
  )
}
