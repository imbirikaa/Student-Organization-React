import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Upload, Check, X } from "lucide-react"

export default function SponsorsPage() {
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
        <Button className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg mb-8">Ekle</Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="mb-2">Görsel 1</p>
            <div className="relative">
              <div className="flex items-center border border-blue-900 rounded-lg p-3 bg-gray-900">
                <Upload className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-blue-500">Sponsor Logosu</span>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2">Görsel 2</p>
            <div className="relative">
              <div className="flex items-center border border-blue-900 rounded-lg p-3 bg-gray-900">
                <Upload className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-blue-500">Sponsor Logosu</span>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2">Görsel 3</p>
            <div className="relative">
              <div className="flex items-center border border-blue-900 rounded-lg p-3 bg-gray-900">
                <Upload className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-blue-500">Sponsor Logosu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mb-6">
          <Button className="rounded-full bg-green-500 hover:bg-green-600 p-2">
            <Check className="h-5 w-5" />
          </Button>
          <Button className="rounded-full bg-red-500 hover:bg-red-600 p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Button className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg">DEVAM ET</Button>
      </div>
    </div>
  )
}
