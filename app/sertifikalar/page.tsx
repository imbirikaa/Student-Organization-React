import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function CertificatesPage() {
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

      <h1 className="text-2xl font-bold mb-6">Topluluklar</h1>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <div className="flex items-center border border-blue-900 rounded-lg p-3 bg-gray-900">
              <Upload className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-blue-500">Özel Sertifika Yükle</span>
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center border border-blue-900 rounded-lg p-3 bg-gray-900">
              <Upload className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-blue-500">Dosya Yükleme</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium mb-4">Tasarımda Dikkat Edilmesi Gerekenler</h2>
          <ol className="space-y-2 text-gray-300">
            <li>1- Sertifika Ölçüleri 1421px × 1006px Olmalı</li>
            <li>2- Sertifikanın Dosya Boyutu En Fazla 2MB boyutunda olmalıdır</li>
            <li>Verilen Örnek Sertifikadaki İsim Yazılacak Kısımda Herhangi Bir Değişiklik Yapılmamalıdır.</li>
            <li>İsim yerleşimi Sabit Şekilde Verilen Şablon Üzerine Tasarım Yapmanız Önerilir.</li>
          </ol>
          <div className="mt-4">
            <a href="#" className="text-blue-500 hover:underline">
              ÜZERİNE TASARIM YAPILACAK ŞABLON İÇİN TIKLA
            </a>
          </div>
        </div>

        <Button className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg">EKLE</Button>
      </div>
    </div>
  )
}
