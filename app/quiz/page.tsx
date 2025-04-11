import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export default function QuizPage() {
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

      <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Quiz</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Sertifika için Doğru Cevaplanması Gereken Soru Sayısı"
            className="w-full rounded-lg bg-gray-800 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-blue-900 text-gray-300 cursor-pointer">
              <span>Soru</span>
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="1.) Cevap"
              className="w-full rounded-lg bg-gray-800 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="2.) Cevap"
              className="w-full rounded-lg bg-gray-800 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="3.) Cevap"
              className="w-full rounded-lg bg-gray-800 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="4.) Cevap"
              className="w-full rounded-lg bg-gray-800 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-blue-900 text-gray-300 cursor-pointer">
              <span>Doğru Cevap</span>
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
        </div>

        <Button className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg">SORU EKLE</Button>
      </div>
    </div>
  )
}
