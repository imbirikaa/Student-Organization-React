import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Info } from "lucide-react"

export default function EventsPage() {
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

      {/* Events header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Etkinlikler</h1>
        <Link href="/etkinlik-olusturma">
          <Button className="bg-teal-500 hover:bg-teal-600 rounded-full">Etkinlik Oluştur</Button>
        </Link>
      </div>

      {/* Events grid */}
      <div className="grid gap-4 mb-12">
        {[1, 2, 3, 4, 5].map((event) => (
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
    </div>
  )
}
