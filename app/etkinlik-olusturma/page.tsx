"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Upload,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  FileText,
  Award,
  ArrowLeft,
  ImageIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading";
import AIEventAssistant from "@/components/ai-event-assistant";
import { apiClient } from "@/lib/api-config";

// --- Interfaces ---
interface Community {
  id: number;
  community: string;
}

interface EventFormData {
  community_id: string;
  event: string;
  description: string;
  start_datetime: string;
  last_application_datetime: string;
  location: string;
  certificate_type: string;
  min_sessions_for_certificate: string;
  verification_type: string;
}

export default function EventCreationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<EventFormData>({
    community_id: "",
    event: "",
    description: "",
    start_datetime: "",
    last_application_datetime: "",
    location: "",
    certificate_type: "Sertifika İstemiyorum",
    min_sessions_for_certificate: "0",
    verification_type: "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingCommunities, setLoadingCommunities] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // Fetch user's communities
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await apiClient.getUserCommunities();
        setUserCommunities(data);
        setLoadingCommunities(false);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
        // Mock data for demo
        const mockCommunities: Community[] = [
          { id: 101, community: "Kodlama Kulübü" },
          { id: 102, community: "Girişimcilik Topluluğu" },
          { id: 103, community: "Müzik Grubu" },
        ];
        setUserCommunities(mockCommunities);
        setLoadingCommunities(false);
      }
    };

    fetchCommunities();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle AI suggestions
  const handleAISuggestion = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setCoverImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Form Validation
    if (
      !formData.community_id ||
      !formData.event ||
      !formData.description ||
      !formData.start_datetime ||
      !formData.last_application_datetime ||
      !formData.location ||
      !formData.verification_type
    ) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      setIsSubmitting(false);
      return;
    }

    // Create FormData for API submission
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key as keyof EventFormData]);
    });

    if (coverImage) {
      submissionData.append("cover_image", coverImage);
    }
    try {
      const result = await apiClient.createEvent(submissionData);
      setSuccess("Etkinlik başarıyla oluşturuldu!");
      setTimeout(() => {
        router.push("/etkinlikler");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Bilinmeyen bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Yeni Etkinlik Oluştur
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Topluluğunuz için yeni bir etkinlik organize edin
              </p>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* AI Event Assistant */}
          <div className="mb-8">
            <AIEventAssistant
              onSuggestionApply={handleAISuggestion}
              currentFormData={formData}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Temel Bilgiler
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="community_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Topluluk *
                  </label>
                  {loadingCommunities ? (
                    <div className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <select
                      id="community_id"
                      name="community_id"
                      value={formData.community_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Bir topluluk seçin...</option>
                      {userCommunities.map((community) => (
                        <option key={community.id} value={community.id}>
                          {community.community}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="event"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Etkinlik Başlığı *
                  </label>
                  <input
                    id="event"
                    name="event"
                    type="text"
                    placeholder="Etkinlik başlığını girin"
                    value={formData.event}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Etkinlik Açıklaması *
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Etkinlik hakkında detaylı bilgi verin..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                />
              </div>
            </div>

            {/* Cover Image Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Kapak Resmi
                </h2>
              </div>

              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />

                {imagePreview ? (
                  <div className="relative group">
                    <Image
                      src={imagePreview}
                      alt="Cover preview"
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <Button
                        type="button"
                        onClick={removeImage}
                        variant="destructive"
                        size="sm"
                        className="mr-2"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Kaldır
                      </Button>
                      <Button
                        type="button"
                        onClick={handleUploadClick}
                        variant="secondary"
                        size="sm"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Değiştir
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                  >
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Kapak resmi yükleyin
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      PNG, JPG veya GIF (Maks. 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Date & Time Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tarih ve Zaman
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="start_datetime"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Etkinlik Başlama Zamanı *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="datetime-local"
                      id="start_datetime"
                      name="start_datetime"
                      value={formData.start_datetime}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="last_application_datetime"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Son Başvuru Tarihi *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="datetime-local"
                      id="last_application_datetime"
                      name="last_application_datetime"
                      value={formData.last_application_datetime}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Settings Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Konum ve Ayarlar
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Etkinlik Yeri *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Örn: Online (Zoom), Konferans Salonu"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="verification_type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Doğrulama Yöntemi *
                  </label>
                  <select
                    id="verification_type"
                    name="verification_type"
                    value={formData.verification_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Bir yöntem seçin...</option>
                    <option value="QR Kod Tarama">QR Kod Tarama</option>
                    <option value="Manuel Onay">Manuel Onay</option>
                    <option value="Otomatik Onay">Otomatik Onay</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="certificate_type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Sertifika Türü
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="certificate_type"
                      name="certificate_type"
                      value={formData.certificate_type}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    >
                      <option value="Sertifika İstemiyorum">
                        Sertifika İstemiyorum
                      </option>
                      <option value="Katılım Sertifikası">
                        Katılım Sertifikası
                      </option>
                      <option value="Başarı Sertifikası">
                        Başarı Sertifikası
                      </option>
                      <option value="Özel Sertifika Yükle">
                        Özel Sertifika Yükle
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="min_sessions_for_certificate"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Min. Oturum Sayısı (Sertifika İçin)
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="min_sessions_for_certificate"
                      name="min_sessions_for_certificate"
                      placeholder="0"
                      value={formData.min_sessions_for_certificate}
                      onChange={handleChange}
                      min="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Messages */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                  <p className="text-green-700 dark:text-green-300">
                    {success}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Etkinliği Oluştur
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
