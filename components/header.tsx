import Link from "next/link"
import Image from "next/image"
import { Search, Bell, MessageCircle, Home, Grid, Users, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-[#111827] py-2 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Kampüs Sözlük Logo"
                width={40}
                height={40}
                className="rounded-full bg-red-500"
              />
            </div>
            <span className="text-lg font-bold text-red-500">
              KAMPÜS
              <br />
              SÖZLÜK
            </span>
          </Link>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Aramak istediğiniz kelimeyi yazın..."
              className="h-9 w-64 rounded-full bg-gray-900 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-700"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
            <Home className="h-5 w-5" />
            <span>Anasayfa</span>
          </Link>
          <Link href="/topluluklar" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
            <Users className="h-5 w-5" />
            <span>Topluluklar</span>
          </Link>
          <Link href="/etkinlikler" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
            <FileText className="h-5 w-5" />
            <span>Etkinlikler</span>
          </Link>
          <Link href="/about-us" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
            <Info className="h-5 w-5" />
            <span>Hakkımızda</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-teal-500">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-teal-500">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Link href="/hesap-olustur">
            <Button
              variant="outline"
              className="hidden md:inline-flex rounded-full text-sm border-teal-500 text-teal-500 hover:bg-teal-500/10"
            >
              Giriş Yap
            </Button>
          </Link>
          <Link href="/hesap-olustur">
            <Button className="rounded-full text-sm bg-teal-500 hover:bg-teal-600 text-white">Kayıt Ol</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
