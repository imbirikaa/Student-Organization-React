import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Search,
  FileText,
  Users,
  Calendar,
  Bell,
  Settings,
  Award,
  MessageSquare,
  Info,
  Star,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Mail,
} from "lucide-react"

export default function HomePage() {
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

      {/* Hero section */}
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <div className="mb-4">
          <Image
            src="/placeholder.svg?height=120&width=120"
            alt="Kampüs Sözlük Logo"
            width={120}
            height={120}
            className="rounded-full bg-red-500"
          />
        </div>
        <p className="text-gray-400 mb-2">Hoş Geldiniz</p>
        <h1 className="text-5xl font-bold mb-6">Kampüs Sözlük</h1>
        <p className="text-xl text-gray-300 max-w-2xl mb-8">
          Türkiye'nin en büyük kampüs topluluğuna katılın. Etkinlikler, topluluklar ve daha fazlası için tek adres.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="bg-teal-500 hover:bg-teal-600 rounded-full px-6">Konu Aç</Button>
          <Link href="/topluluklar">
            <Button variant="outline" className="rounded-full border-teal-500 text-teal-500 hover:bg-teal-500/10 px-6">
              Toplulukları Keşfet
            </Button>
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-2xl mx-auto mb-16">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Aramak istediğiniz kelimeyi yazın..."
          className="h-12 w-full rounded-full bg-gray-900 pl-12 pr-4 text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
      </div>

      {/* How it works section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="h-10 w-10" />,
              title: "Topluluklara Katıl",
              description:
                "İlgi alanlarınıza göre topluluklara katılın ve benzer ilgi alanlarına sahip kişilerle tanışın.",
            },
            {
              icon: <Calendar className="h-10 w-10" />,
              title: "Etkinliklere Katıl",
              description: "Kampüs içi ve dışı etkinliklere katılın, yeni deneyimler kazanın ve ağınızı genişletin.",
            },
            {
              icon: <Award className="h-10 w-10" />,
              title: "Sertifikalar Kazan",
              description: "Etkinliklere katılarak sertifikalar kazanın ve CV'nizi güçlendirin.",
            },
          ].map((item, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6 text-center">
              <div className="bg-blue-600 rounded-full p-4 inline-flex mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { title: "ÜYE LİSTESİ", icon: <Users className="h-6 w-6" />, link: "/users", active: true },
          {
            title: "ETKİNLİK OLUŞTUR",
            icon: <Calendar className="h-6 w-6" />,
            link: "/etkinlik-olusturma",
            active: true,
          },
          { title: "AKTİF ETKİNLİKLER", icon: <Calendar className="h-6 w-6" />, link: "/etkinlikler", active: true },
          { title: "SERTİFİKA HAK EDENLER", icon: <Award className="h-6 w-6" />, link: "/sertifikalar", active: true },
          { title: "TOPLULUKLAR", icon: <Users className="h-6 w-6" />, link: "/topluluklar", active: true },
          { title: "HAKKIMIZDA", icon: <Info className="h-6 w-6" />, link: "/about-us", active: true },
          { title: "YÖNETİCİ EKLE", icon: <Settings className="h-6 w-6" />, link: "/yonetici-ekle", active: true },
          { title: "SPONSORLAR", icon: <Award className="h-6 w-6" />, link: "/sponsorlar", active: true },
          {
            title: "KATILIM İSTEKLERİ",
            icon: <MessageSquare className="h-6 w-6" />,
            link: "/katilim-istekleri",
            active: false,
          },
          {
            title: "GEÇMİŞ ETKİNLİKLER",
            icon: <Calendar className="h-6 w-6" />,
            link: "/gecmis-etkinlikler",
            active: false,
          },
          { title: "DUYRU OLUŞTUR", icon: <Bell className="h-6 w-6" />, link: "/duyuru-olustur", active: false },
          { title: "DUYRU LİSTESİ", icon: <FileText className="h-6 w-6" />, link: "/duyurular", active: false },
        ].map((item, index) => (
          <Link
            href={item.active ? item.link : "#"}
            key={index}
            className={`flex flex-col items-center justify-center p-6 rounded-lg transition-colors 
              ${item.active ? "bg-gray-900 hover:bg-gray-800" : "bg-gray-700 opacity-50 cursor-not-allowed"}`}
          >
            <div className="bg-blue-600 rounded-full p-3 mb-3">{item.icon}</div>
            <span className="text-xs font-medium text-center">{item.title}</span>
          </Link>
        ))}
      </div>

      {/* Statistics section */}
      <div className="bg-gray-900 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Rakamlarla Kampüs Sözlük</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "10K+", label: "Aktif Üye" },
            { number: "50+", label: "Topluluk" },
            { number: "200+", label: "Aylık Etkinlik" },
            { number: "5K+", label: "Verilen Sertifika" },
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold text-teal-500 mb-2">{stat.number}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity list */}
      <div className="bg-gray-900 rounded-lg p-6 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">AKTİF ETKİNLİK LİSTESİ</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              COPY
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              CSV
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              EXCEL
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              PRINT
            </Button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-2 font-medium">ETKİNLİK TARİHİ</th>
              <th className="text-left py-2 font-medium">SON BAŞVURU TARİHİ</th>
              <th className="text-left py-2 font-medium">ETKİNLİK ADI</th>
              <th className="text-left py-2 font-medium">KONUM</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                eventDate: "01-03-2025",
                deadline: "07-03-2025",
                name: "Yazılım Geliştirme Atölyesi",
                location: "Bordo Salon",
              },
              { eventDate: "15-03-2025", deadline: "10-03-2025", name: "Kariyer Günleri", location: "Ana Kampüs" },
              {
                eventDate: "22-03-2025",
                deadline: "18-03-2025",
                name: "Girişimcilik Paneli",
                location: "Konferans Salonu",
              },
            ].map((event, index) => (
              <tr key={index} className="border-b border-gray-800 last:border-0">
                <td className="py-3">{event.eventDate}</td>
                <td className="py-3">{event.deadline}</td>
                <td className="py-3">{event.name}</td>
                <td className="py-3">{event.location}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <Link href="/etkinlikler">
            <Button className="text-sm bg-teal-500 hover:bg-teal-600">
              Tüm Etkinlikleri Gör
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              Previous
            </Button>
            <Button variant="primary" size="sm" className="text-xs bg-blue-600">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Üyelerimizden</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Ali Emre",
              role: "Bilgisayar Mühendisliği",
              quote:
                "Kampüs Sözlük sayesinde birçok etkinliğe katıldım ve sektör profesyonelleriyle tanışma fırsatı buldum.",
            },
            {
              name: "Ayşe Yılmaz",
              role: "İşletme",
              quote:
                "Topluluklar aracılığıyla alanımda kendimi geliştirdim ve staj imkanı buldum. Harika bir platform!",
            },
            {
              name: "Mehmet Kaya",
              role: "Elektrik-Elektronik Mühendisliği",
              quote: "Düzenlediğimiz etkinlikler için mükemmel bir organizasyon aracı. Katılımcı yönetimi çok kolay.",
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-xl font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-300">"{testimonial.quote}"</p>
              <div className="mt-4 flex text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Sık Sorulan Sorular</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              question: "Kampüs Sözlük'e nasıl üye olabilirim?",
              answer: "Sağ üst köşedeki 'Kayıt Ol' butonuna tıklayarak üyelik formunu doldurabilirsiniz.",
            },
            {
              question: "Etkinliklere nasıl katılabilirim?",
              answer:
                "Etkinlikler sayfasından ilgilendiğiniz etkinliği seçip 'Katıl' butonuna tıklayarak katılabilirsiniz.",
            },
            {
              question: "Sertifika almak için ne yapmam gerekiyor?",
              answer:
                "Etkinliklere katılarak ve gerekli oturum sayısını tamamlayarak sertifika almaya hak kazanabilirsiniz.",
            },
            {
              question: "Kendi topluluğumu nasıl oluşturabilirim?",
              answer:
                "Topluluklar sayfasından 'Topluluk Oluştur' butonuna tıklayarak gerekli bilgileri doldurabilirsiniz.",
            },
          ].map((faq, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <HelpCircle className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 to-teal-900 rounded-lg p-8 mb-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Hemen Kampüs Sözlük'e Katılın</h2>
          <p className="text-gray-200 mb-8">
            Türkiye'nin en büyük kampüs topluluğunun bir parçası olun. Etkinlikler, topluluklar ve daha fazlası için
            hemen üye olun.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/hesap-olustur">
              <Button className="bg-teal-500 hover:bg-teal-600 rounded-full px-6 py-2 text-lg">Ücretsiz Üye Ol</Button>
            </Link>
            <Link href="/about-us">
              <Button
                variant="outline"
                className="rounded-full border-white text-white hover:bg-white/10 px-6 py-2 text-lg"
              >
                Daha Fazla Bilgi
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features list */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Neden Kampüs Sözlük?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
              title: "Kolay Etkinlik Yönetimi",
              description: "Etkinliklerinizi kolayca oluşturun, yönetin ve katılımcıları takip edin.",
            },
            {
              icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
              title: "Otomatik Sertifika",
              description: "Etkinlik katılımcılarına otomatik olarak sertifika verin ve takip edin.",
            },
            {
              icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
              title: "Topluluk Oluşturma",
              description: "İlgi alanlarınıza göre topluluklar oluşturun ve yönetin.",
            },
            {
              icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
              title: "Detaylı Raporlama",
              description: "Etkinlik ve topluluk istatistiklerini detaylı raporlarla takip edin.",
            },
            {
              icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
              title: "Mobil Uyumlu",
              description: "Her cihazdan erişim sağlayın ve etkinlikleri takip edin.",
            },
            {
              icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
              title: "Sponsor Yönetimi",
              description: "Etkinlikleriniz için sponsor bulun ve yönetin.",
            },
          ].map((feature, index) => (
            <div key={index} className="flex items-start p-4">
              <div className="flex-shrink-0 mr-4">{feature.icon}</div>
              <div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gray-900 rounded-lg p-8 mb-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Güncel Etkinliklerden Haberdar Olun</h2>
          <p className="text-gray-300 mb-6">
            E-posta listemize kaydolun ve en yeni etkinlikler, topluluklar ve duyurulardan haberdar olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="h-12 w-full rounded-lg bg-gray-800 pl-10 pr-4 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <Button className="bg-teal-500 hover:bg-teal-600 rounded-lg h-12 px-6">Abone Ol</Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 pt-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Kampüs Sözlük</h3>
            <p className="text-gray-400 mb-4">
              Türkiye'nin en büyük kampüs topluluğu platformu. Etkinlikler, topluluklar ve daha fazlası.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link href="/topluluklar" className="text-gray-400 hover:text-white">
                  Topluluklar
                </Link>
              </li>
              <li>
                <Link href="/etkinlikler" className="text-gray-400 hover:text-white">
                  Etkinlikler
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-400 hover:text-white">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/users" className="text-gray-400 hover:text-white">
                  Üyeler
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Destek</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Yardım Merkezi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  İletişim
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Gizlilik Politikası
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Kullanım Şartları
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">●</span>
                <span className="text-gray-400">info@kampussozluk.com</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">●</span>
                <span className="text-gray-400">+90 212 123 4567</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">●</span>
                <span className="text-gray-400">İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 pb-4">
          <p className="text-center text-gray-400">© 2025 Kampüs Sözlük. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
