"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Users,
  Building2,
  Target,
  Eye,
  Trophy,
  Calendar,
  Mail,
  DollarSign,
  HelpCircle,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  ImageIcon,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "@/components/ui/loading";
import Image from "next/image";

// Define an interface for the expected validation error structure from Laravel
interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

// A type guard to check if an object is a ValidationError
function isValidationError(obj: any): obj is ValidationError {
  return (
    obj && typeof obj.message === "string" && typeof obj.errors === "object"
  );
}

export default function CommunityCreationPage() {
  const router = useRouter();
  // State for all the fields
  const [community, setCommunity] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [about, setAbout] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [foundingYear, setFoundingYear] = useState("");
  const [achievements, setAchievements] = useState("");
  const [traditionalEvents, setTraditionalEvents] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [sponsors, setSponsors] = useState("");
  const [faq, setFaq] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!community.trim()) {
      setError("Topluluk adı gereklidir.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("community", community);
    formData.append("about", about);
    formData.append("mission", mission);
    formData.append("vision", vision);
    formData.append("founding_year", foundingYear);
    formData.append("achievements", achievements);
    formData.append("traditional_events", traditionalEvents);
    formData.append("contact_email", contactEmail);
    formData.append("sponsors", sponsors);
    formData.append("faq", faq);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      // Step 1: Get CSRF cookie
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      // Step 2: Send the form data with credentials
      const res = await fetch(`http://localhost:8000/api/communities`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 419) {
          throw new Error("CSRF token mismatch. Please refresh the page.");
        }
        if (res.status === 422 && isValidationError(data)) {
          const firstError = Object.values(data.errors)[0][0];
          throw new Error(firstError || "Please check your input.");
        }
        throw new Error(data.message || "An error occurred on the server.");
      }

      toast.success("Community created successfully!");
      router.push("/topluluklar");
    } catch (error) {
      let errorMessage = "Failed to create community.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                Yeni Topluluk Oluştur
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Kendi topluluk projenizi başlatın
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Temel Bilgiler
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="community"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Topluluk Adı *
                  </label>
                  <input
                    id="community"
                    type="text"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    placeholder="Topluluk adını girin"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="foundingYear"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Kuruluş Yılı
                  </label>
                  <input
                    id="foundingYear"
                    type="number"
                    value={foundingYear}
                    onChange={(e) => setFoundingYear(e.target.value)}
                    placeholder="2024"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    İletişim E-postası
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="contactEmail"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="topluluk@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Hakkında
                </label>
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Topluluğunuz hakkında genel bilgi..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                />
              </div>
            </div>

            {/* Logo Upload Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Logo
                </h2>
              </div>

              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  id="logoUpload"
                />

                {logoPreview ? (
                  <div className="relative group">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={200}
                      height={200}
                      className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600 mx-auto"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <Button
                        type="button"
                        onClick={removeLogo}
                        variant="destructive"
                        size="sm"
                        className="mr-2"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Kaldır
                      </Button>
                      <label htmlFor="logoUpload">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          asChild
                        >
                          <span className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Değiştir
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="logoUpload"
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors block"
                  >
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Logo yükleyin
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      PNG, JPG veya GIF (Maks. 5MB)
                    </p>
                  </label>
                )}
              </div>
            </div>

            {/* Mission & Vision Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Misyon ve Vizyon
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="mission"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Target className="inline h-4 w-4 mr-1" />
                    Misyon
                  </label>
                  <textarea
                    id="mission"
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="Topluluğunuzun misyonu..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vision"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Eye className="inline h-4 w-4 mr-1" />
                    Vizyon
                  </label>
                  <textarea
                    id="vision"
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    placeholder="Topluluğunuzun vizyonu..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Activities & Achievements Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Aktiviteler ve Başarılar
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="achievements"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Trophy className="inline h-4 w-4 mr-1" />
                    Başarılar
                  </label>
                  <textarea
                    id="achievements"
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    placeholder="Topluluğunuzun başarıları ve ödülleri..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="traditionalEvents"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Geleneksel Etkinlikler
                  </label>
                  <textarea
                    id="traditionalEvents"
                    value={traditionalEvents}
                    onChange={(e) => setTraditionalEvents(e.target.value)}
                    placeholder="Düzenli olarak yaptığınız etkinlikler..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Ek Bilgiler
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="sponsors"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Sponsorlar
                  </label>
                  <textarea
                    id="sponsors"
                    value={sponsors}
                    onChange={(e) => setSponsors(e.target.value)}
                    placeholder="Sponsorlarınız ve destekçileriniz..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="faq"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <HelpCircle className="inline h-4 w-4 mr-1" />
                    Sıkça Sorulan Sorular
                  </label>
                  <textarea
                    id="faq"
                    value={faq}
                    onChange={(e) => setFaq(e.target.value)}
                    placeholder="Topluluk hakkında sıkça sorulan sorular ve cevapları..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Topluluğu Oluştur
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
