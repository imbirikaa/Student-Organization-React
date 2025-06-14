"use client";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  ChevronDown,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  School,
  UserPlus,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import data from "./data.js";

export default function AccountCreationPage() {
  const router = useRouter();
  const [selectedUniversityId, setSelectedUniversityId] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nickname: "",
    password: "",
    password_confirmation: "",
    university_id: "",
    department_id: "",
    birth_day: "",
    birth_month: "",
    birth_year: "",
    birth_date: "",
    kvkk: false,
    privacy: true,
    terms: false,
  });
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }

  const handleChange = (e: ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      const { birth_day, birth_month, birth_year } = {
        ...updated,
      };

      if (birth_day && birth_month && birth_year) {
        const formattedMonth = birth_month.toString().padStart(2, "0");
        const formattedDay = birth_day.toString().padStart(2, "0");
        updated.birth_date = `${birth_year}-${formattedMonth}-${formattedDay}`;
      }

      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const res = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Response data:", data);
      if (res.ok) {
        toast.success(
          "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz..."
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        toast.error(data.message || "Bir hata oluştu!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Bağlantı hatası! Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-start justify-center px-4 pt-8 pb-16">
      <div className="w-full max-w-4xl bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Hesap Oluştur</h2>
          <p className="text-gray-400 text-sm">Topluluğumuza katılmak için bilgilerinizi doldurun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-teal-400" />
              Kişisel Bilgiler
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ad
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="first_name"
                    onChange={handleChange}
                    placeholder="Adınız"
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.first_name[0]}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Soyad
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="last_name"
                    onChange={handleChange}
                    placeholder="Soyadınız"
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.last_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.last_name[0]}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  onChange={handleChange}
                  type="email"
                  placeholder="ornek@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefon Numarası
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="phone"
                    onChange={handleChange}
                    type="tel"
                    placeholder="0xxx xxx xx xx"
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="nickname"
                    onChange={handleChange}
                    placeholder="kullanici_adi"
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.nickname && (
                  <p className="text-red-400 text-sm mt-1">{errors.nickname[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Lock className="w-5 h-5 mr-2 text-teal-400" />
              Güvenlik
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="password"
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre Tekrarı
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="password_confirmation"
                    onChange={handleChange}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-red-400 text-sm mt-1">{errors.password_confirmation[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Birth Date Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-teal-400" />
              Doğum Tarihi
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gün</label>
                <select
                  name="birth_day"
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="">Gün</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ay</label>
                <select
                  name="birth_month"
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="">Ay</option>
                  {[
                    "Ocak",
                    "Şubat",
                    "Mart",
                    "Nisan",
                    "Mayıs",
                    "Haziran",
                    "Temmuz",
                    "Ağustos",
                    "Eylül",
                    "Ekim",
                    "Kasım",
                    "Aralık",
                  ].map((m, i) => (
                    <option key={i + 1} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Yıl</label>
                <select
                  name="birth_year"
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="">Yıl</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <School className="w-5 h-5 mr-2 text-teal-400" />
              Eğitim Bilgileri
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Üniversite
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  onChange={(e) => {
                    const universityId = e.target.value;
                    setSelectedUniversityId(universityId);
                    setFormData((prev) => ({
                      ...prev,
                      university_id: universityId,
                      department_id: "",
                    }));
                  }}
                  disabled={isLoading}
                >
                  <option value="">Üniversite seçin</option>
                  {data.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.university_id && (
                <p className="text-red-400 text-sm mt-1">{errors.university_id[0]}</p>
              )}
            </div>

            {selectedUniversityId && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bölüm
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        department_id: e.target.value,
                      }))
                    }
                    disabled={isLoading}
                  >
                    <option value="">Bölüm seçin</option>
                    {data
                      .find((uni) => uni.id.toString() === selectedUniversityId)
                      ?.programs.map((dep) => (
                        <option key={dep.id} value={dep.id}>
                          {dep.name}
                        </option>
                      ))}
                  </select>
                </div>
                {errors.department_id && (
                  <p className="text-red-400 text-sm mt-1">{errors.department_id[0]}</p>
                )}
              </div>
            )}
          </div>

          {/* Terms and Conditions Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-teal-400" />
              Sözleşmeler ve Onaylar
            </h3>
            
            <div className="space-y-3 bg-gray-800/30 p-4 rounded-lg border border-gray-700">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  id="kvkk"
                  name="kvkk"
                  onChange={handleChange}
                  className="mt-1 mr-3 h-4 w-4 rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-gray-900"
                  disabled={isLoading}
                />
                <label htmlFor="kvkk" className="text-sm text-gray-300 leading-relaxed">
                  <span className="text-teal-400 font-medium">KVKK Aydınlatma Metni</span>'ni okudum ve kabul ediyorum
                </label>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  id="privacy"
                  name="privacy"
                  onChange={handleChange}
                  className="mt-1 mr-3 h-4 w-4 rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-gray-900"
                  disabled={isLoading}
                />
                <label htmlFor="privacy" className="text-sm text-gray-300 leading-relaxed">
                  <span className="text-teal-400 font-medium">Gizlilik Politikası</span>'nı okudum ve kabul ediyorum
                </label>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  id="terms"
                  name="terms"
                  onChange={handleChange}
                  className="mt-1 mr-3 h-4 w-4 rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-gray-900"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                  <span className="text-teal-400 font-medium">Kullanıcı Sözleşmesi</span>'ni okudum ve kabul ediyorum
                </label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-4 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] text-lg"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            {isLoading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Zaten hesabın var mı?{" "}
              <Link
                className="text-teal-400 hover:text-teal-300 font-medium transition-colors duration-200"
                href="/login"
              >
                Giriş Yap
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
