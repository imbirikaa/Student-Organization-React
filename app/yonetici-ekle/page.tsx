import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AddAdminPage() {
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

      <div className="max-w-3xl mx-auto">
        <Button className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg mb-8">YÖNETİCİ EKLE</Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Unvan Seç"
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="İsim soyisim"
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <Button className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg">DEVAM ET</Button>
      </div>
    </div>
  )
}
