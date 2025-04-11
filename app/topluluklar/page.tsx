import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, FileEdit } from "lucide-react"

export default function CommunitiesPage() {
  const idSet = (id) => {
    return `/topluluklar/${id}`
  }
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

      {/* Communities header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Topluluklar</h1>
        <Button className="bg-teal-500 hover:bg-teal-600 rounded-full">Başvur</Button>
      </div>

      {/* Communities grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3, 4, 5, 6].map((community) => (
          <div key={community} className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                {community % 2 === 0 ? (
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="University logo"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="Kampüs Sözlük Logo"
                      width={100}
                      height={100}
                      className="rounded-full bg-red-500"
                    />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Kampüs Sözlük</h3>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-teal-500" />
                  <span className="text-sm text-gray-400">{community} Üye</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileEdit className="h-4 w-4 text-teal-500" />
                  <span className="text-sm text-gray-400">{community + 4} Etkinlik</span>
                </div>
              </div>
            </div>
            <Link href={`/about-us`} className="block text-center text-blue-500 hover:text-blue-400 text-sm">
                İncele
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
