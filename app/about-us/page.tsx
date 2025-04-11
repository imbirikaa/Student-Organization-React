import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section with wave background */}
      <div className="relative h-64 mb-12 rounded-lg overflow-hidden">
        <Image src="/placeholder.svg?height=300&width=1200" alt="Wave background" fill className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">About Us</h1>
        </div>
      </div>

      {/* About section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=400"
            alt="About image"
            width={400}
            height={400}
            className="w-full h-auto"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-teal-500 mb-4">About Us</h2>
          <p className="text-gray-300 mb-4">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.
          </p>
          <p className="text-gray-300 mb-4">
            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
            more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
          <Button className="bg-teal-500 hover:bg-teal-600 rounded-full">Learn More</Button>
        </div>
      </div>

      {/* Features section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Best Features & Values</h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Misyon", icon: "📋" },
            { title: "Vizyon", icon: "🔍" },
            { title: "Kuruluş Tarihi", icon: "📅" },
          ].map((feature, index) => (
            <div key={index} className="bg-gray-900 border border-blue-900 rounded-lg p-6">
              <div className="text-blue-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-4">{feature.title}</h3>
              <p className="text-gray-400">
                This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of
                Lorem Ipsum.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Awards section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-teal-500 mb-6">Ödülleri(başarılar)</h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Our technology transforms challenges into streamlined solutions, creating the complete difference for your
          business.
        </p>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((award) => (
            <div key={award} className="bg-gray-200 aspect-square rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
