import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Users, Target, Calendar, Award, BookOpen, Heart } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section with wave background */}
      <div className="relative h-64 mb-12 rounded-lg overflow-hidden bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Hakkımızda</h1>
            <p className="text-teal-100 text-lg">
              Öğrenci topluluklarını bir araya getiriyoruz
            </p>
          </div>
        </div>
      </div>

      {/* About section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-gray-900 rounded-lg overflow-hidden p-8 flex items-center justify-center">
          <div className="text-center">
            <Users className="w-24 h-24 text-teal-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white">150+ Topluluk</h3>
            <p className="text-gray-400">Türkiye genelinde aktif topluluklar</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-teal-500 mb-4">
            Öğrenci Teşkilatı Platformu
          </h2>
          <p className="text-gray-300 mb-4">
            Öğrenci Teşkilatı, Türkiye'deki üniversite öğrencilerinin topluluk
            faaliyetlerine katılımını artırmak ve öğrenci topluluklarının
            etkinliklerini daha geniş kitlelere ulaştırmak amacıyla 2023 yılında
            kurulmuş dijital bir platformdur.
          </p>
          <p className="text-gray-300 mb-4">
            Platformumuz, öğrencilerin ilgi alanlarına uygun toplulukları
            keşfetmelerini, etkinliklere katılmalarını ve kendi topluluklarını
            oluşturmalarını kolaylaştırmaktadır. Aynı zamanda topluluk
            yöneticilerinin etkinlik organizasyonu yapabilecekleri kapsamlı
            araçlar sunmaktayız.
          </p>
          <Button className="bg-teal-500 hover:bg-teal-600 rounded-full">
            <BookOpen className="w-4 h-4 mr-2" />
            Daha Fazla Bilgi
          </Button>
        </div>
      </div>

      {/* Features section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4">
          Değerlerimiz ve Özelliklerimiz
        </h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Öğrenci yaşamını zenginleştiren, topluluk ruhunu güçlendiren ve
          akademik başarıyı destekleyen bir platform olarak, modern teknoloji
          ile geleneksel topluluk değerlerini harmanlıyoruz.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-teal-900 rounded-lg p-6">
            <Target className="w-12 h-12 text-teal-500 mb-4" />
            <h3 className="text-xl font-medium mb-4">Misyonumuz</h3>
            <p className="text-gray-400">
              Üniversite öğrencilerinin topluluk faaliyetlerine katılımını
              artırarak, sosyal gelişimlerini desteklemek ve kampüs yaşamını
              zenginleştirmek.
            </p>
          </div>
          <div className="bg-gray-900 border border-teal-900 rounded-lg p-6">
            <Heart className="w-12 h-12 text-teal-500 mb-4" />
            <h3 className="text-xl font-medium mb-4">Vizyonumuz</h3>
            <p className="text-gray-400">
              Türkiye'nin en büyük öğrenci topluluk platformu olarak, gençlerin
              potansiyellerini keşfetmelerine ve gelişimlerine katkıda bulunmak.
            </p>
          </div>
          <div className="bg-gray-900 border border-teal-900 rounded-lg p-6">
            <Calendar className="w-12 h-12 text-teal-500 mb-4" />
            <h3 className="text-xl font-medium mb-4">Kuruluş Tarihi</h3>
            <p className="text-gray-400">
              2023 yılında İstanbul'da kurulan platformumuz, bugün 50+
              üniversitede aktif olarak kullanılmaktadır.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics section */}
      <div className="mb-16 bg-gray-900 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Platform İstatistikleri
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-500 mb-2">25,000+</div>
            <div className="text-gray-400">Aktif Öğrenci</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-500 mb-2">150+</div>
            <div className="text-gray-400">Topluluk</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-500 mb-2">1,200+</div>
            <div className="text-gray-400">Etkinlik</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-500 mb-2">55+</div>
            <div className="text-gray-400">Üniversite</div>
          </div>
        </div>
      </div>

      {/* Awards section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-teal-500 mb-6">
          Başarılarımız ve Ödüllerimiz
        </h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Öğrenci yaşamına kattığımız değerler ve yenilikçi yaklaşımımızla
          çeşitli ödüller ve tanınırlık kazandık. İşte başlıca başarılarımız:
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-yellow-600 rounded-lg p-6 text-center">
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              En İyi Eğitim Teknolojisi Ödülü
            </h3>
            <p className="text-gray-400 text-sm">TechEdu Awards 2024</p>
          </div>
          <div className="bg-gray-900 border border-blue-600 rounded-lg p-6 text-center">
            <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Sosyal Etki Ödülü
            </h3>
            <p className="text-gray-400 text-sm">Youth Impact Awards 2024</p>
          </div>
          <div className="bg-gray-900 border border-green-600 rounded-lg p-6 text-center">
            <Target className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Yılın Startup'ı
            </h3>
            <p className="text-gray-400 text-sm">
              İstanbul Startup Summit 2023
            </p>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Ekibimiz</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="w-20 h-20 bg-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">AY</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Ahmet Yılmaz
            </h3>
            <p className="text-teal-400 text-sm mb-2">Kurucu & CEO</p>
            <p className="text-gray-400 text-sm">
              Bilgisayar Mühendisliği, İTÜ
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">EK</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Elif Kaya</h3>
            <p className="text-blue-400 text-sm mb-2">CTO</p>
            <p className="text-gray-400 text-sm">Yazılım Mühendisliği, ODTÜ</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <div className="w-20 h-20 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">MÇ</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Mehmet Çelik
            </h3>
            <p className="text-purple-400 text-sm mb-2">Topluluk Lideri</p>
            <p className="text-gray-400 text-sm">
              İşletme, Boğaziçi Üniversitesi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
