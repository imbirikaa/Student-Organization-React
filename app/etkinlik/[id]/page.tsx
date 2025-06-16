"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  ShieldCheck,
  Users,
  Star,
  Share2,
  Bookmark,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { PageLoader, LoadingSpinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error-state";

// --- Interface for Event Data ---
interface EventType {
  id: number;
  community: {
    id: number;
    community: string;
    logo: string;
  };
  event: string;
  cover_image: string;
  description: string;
  start_datetime: string;
  last_application_datetime: string;
  location: string;
  certificate_type: string;
  min_sessions_for_certificate: number;
  verification_type: string;
}

// --- Helper Function to Format Dates ---
const formatDateTime = (isoString: string) => {
  if (!isoString) return { date: "N/A", time: "N/A" };
  try {
    const date = new Date(isoString);
    const optionsDate: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return {
      date: date.toLocaleDateString("tr-TR", optionsDate),
      time: date.toLocaleTimeString("tr-TR", optionsTime),
    };
  } catch (error) {
    console.error("Invalid date format:", isoString);
    return { date: "Geçersiz Tarih", time: "" };
  }
};

// --- Helper Function to Get CSRF Token ---
const getCookieValue = (name: string): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()!.split(";").shift()!;
    // Decode the URL-encoded cookie value
    return decodeURIComponent(cookieValue);
  }
  return "";
};

// --- Helper Function for Authenticated Fetch ---
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  // Get CSRF cookie first
  await fetch("http://localhost:8000/sanctum/csrf-cookie", {
    credentials: "include",
  });

  const token = getCookieValue("XSRF-TOKEN");

  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
      ...options.headers,
    },
  });
};

// --- Main Event Detail Page Component ---
export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationStats, setRegistrationStats] = useState<{
    total: number;
    confirmed: number;
  }>({ total: 0, confirmed: 0 });
  useEffect(() => {
    if (!id) return;

    const fetchEventData = async () => {
      try {
        // Fetch event details
        const eventRes = await authenticatedFetch(
          `http://localhost:8000/api/events/${id}`
        );

        if (!eventRes.ok) {
          throw new Error("Etkinlik bulunamadı veya getirme yetkiniz yok.");
        }

        const eventData = await eventRes.json();
        setEvent(eventData);

        // Check registration status if user is authenticated
        if (user) {
          const registrationRes = await authenticatedFetch(
            `http://localhost:8000/api/events/${id}/check-registration`
          );

          if (registrationRes.ok) {
            const registrationData = await registrationRes.json();
            setIsRegistered(registrationData.registered);
          }
        }

        // Fetch registration statistics (public data)
        try {
          const statsRes = await authenticatedFetch(
            `http://localhost:8000/api/events/${id}/registrations`
          );

          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setRegistrationStats({
              total: statsData.total_registrations || 0,
              confirmed:
                statsData.registrations?.filter(
                  (r: any) => r.status === "confirmed"
                ).length || 0,
            });
          }
        } catch (error) {
          // If we can't fetch stats, keep defaults
          console.log("Could not fetch registration stats:", error);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, user]);
  const handleRegistration = async () => {
    if (!user) {
      toast.error("Etkinliğe başvuru yapabilmek için giriş yapmalısınız.");
      router.push("/login");
      return;
    }

    if (!event) return;

    setRegistrationLoading(true);
    try {
      // First, verify we're authenticated
      console.log("Checking authentication...");
      const authCheck = await fetch("http://localhost:8000/api/me", {
        credentials: "include",
      });
      console.log("Auth check status:", authCheck.status);

      if (!authCheck.ok) {
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        router.push("/login");
        return;
      }

      // Get CSRF cookie first (same as auth context)
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const token = getCookieValue("XSRF-TOKEN");
      console.log("CSRF Token (decoded):", token);
      console.log("CSRF Token length:", token.length);
      console.log("All cookies:", document.cookie);

      const url = isRegistered
        ? `http://localhost:8000/api/events/${event.id}/unregister`
        : `http://localhost:8000/api/events/${event.id}/register`;

      const method = isRegistered ? "DELETE" : "POST";

      console.log("Making request to:", url, "with method:", method);
      const response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
          "X-CSRF-TOKEN": token,
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      const data = await response.json();
      console.log("Response data:", data);
      if (response.ok) {
        // Update registration state
        const newRegistrationState = !isRegistered;
        setIsRegistered(newRegistrationState);

        // Refresh registration stats
        try {
          const statsRes = await fetch(
            `http://localhost:8000/api/events/${event.id}/registrations`,
            {
              credentials: "include",
              headers: {
                "X-XSRF-TOKEN": getCookieValue("XSRF-TOKEN"),
              },
            }
          );

          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setRegistrationStats({
              total: statsData.total_registrations || 0,
              confirmed:
                statsData.registrations?.filter(
                  (r: any) => r.status === "confirmed"
                ).length || 0,
            });
          }
        } catch (error) {
          console.log("Could not refresh stats:", error);
        }

        // Show success message with attendance code info for new registrations
        if (newRegistrationState) {
          toast.success(
            "🎉 Etkinliğe başarıyla kaydoldunuz! Katılım kodunuz e-posta ile gönderildi.",
            { duration: 5000 }
          );
        } else {
          toast.success("Etkinlik kaydınız iptal edildi.");
        }

        // Force a small delay to ensure UI updates
        setTimeout(() => {
          // Additional UI updates if needed
        }, 100);
      } else {
        toast.error(data.message || "Bir hata oluştu.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setRegistrationLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-8">
        <div className="container mx-auto px-4">
          {" "}
          <div className="text-center space-y-4 py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Etkinlik Bulunamadı
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const { date: startDate, time: startTime } = formatDateTime(
    event.start_datetime
  );
  const { date: lastAppDate, time: lastAppTime } = formatDateTime(
    event.last_application_datetime
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        {" "}
        <Image
          src={event.cover_image || "/images/bg.png"}
          alt="Event cover image"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
        </div>
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40"
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {event.event}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span className="text-lg">{event.location}</span>
                  </div>{" "}
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{registrationStats.total}+ katılımcı</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                Etkinlik Hakkında
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Community Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-white" />
                </div>
                Organizatör
              </h2>
              <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 p-1">
                    <Image
                      src={event.community.logo || "/placeholder.svg"}
                      alt={event.community.community}
                      width={60}
                      height={60}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {event.community.community}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Etkinlik Organizatörü
                  </p>
                  <Link href={`/topluluklar/${event.community.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-teal-200 text-teal-700 dark:border-teal-700 dark:text-teal-300"
                    >
                      Topluluğu Görüntüle
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="space-y-6">
            {" "}
            {/* Registration Button */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              {!user ? (
                <>
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Etkinliğe Katılmak İçin Giriş Yapın
                  </Button>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                    Son başvuru: {lastAppDate} {lastAppTime}
                  </p>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleRegistration}
                    disabled={registrationLoading}
                    className={`w-full text-white text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      isRegistered
                        ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                        : "bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                    }`}
                  >
                    {registrationLoading ? (
                      <>
                        <LoadingSpinner className="mr-2" />
                        {isRegistered
                          ? "Kaydınız İptal Ediliyor..."
                          : "Kayıt Olunuyor..."}
                      </>
                    ) : isRegistered ? (
                      <>
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Katılımınızı İptal Et
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Etkinliğe Katıl
                      </>
                    )}
                  </Button>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                    {isRegistered ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        ✅ Bu etkinliğe kayıtlısınız
                      </span>
                    ) : (
                      <>
                        Son başvuru: {lastAppDate} {lastAppTime}
                      </>
                    )}
                  </p>
                </>
              )}
            </div>
            {/* Event Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-teal-600" />
                Etkinlik Detayları
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Başlangıç Tarihi
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold">
                      {startDate}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {startTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Konum
                    </p>
                    <p className="text-teal-600 dark:text-teal-400 font-semibold">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Sertifika
                    </p>
                    <p className="text-purple-600 dark:text-purple-400 font-semibold">
                      {event.certificate_type}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Min. {event.min_sessions_for_certificate} oturum
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Doğrulama
                    </p>
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      {event.verification_type}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Event Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-600" />
                İstatistikler
              </h3>{" "}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {registrationStats.total}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Toplam Başvuru
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {registrationStats.confirmed}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Onaylandı
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
