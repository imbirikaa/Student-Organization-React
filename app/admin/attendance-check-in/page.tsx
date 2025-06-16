"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/app/context/auth-context";
import { RequireRole } from "@/components/RequirePermission";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Users,
  Clock,
  TrendingUp,
  UserCheck,
  Calendar,
  BarChart3,
  Shield,
  RefreshCw,
  AlertTriangle,
  Activity,
  Hash,
} from "lucide-react";
import { LoadingSpinner, PageLoader } from "@/components/ui/loading";

interface Event {
  id: number;
  event: string;
  start_datetime: string;
  location: string;
  community: { id: number; community: string };
  community_id?: number;
  status: string;
}

interface CheckInStats {
  event: string;
  total_registrations: number;
  checked_in_count: number;
  attendance_rate: number;
  pending_check_ins: number;
  recent_check_ins: Array<{
    user: string;
    checked_in_at: string;
    checked_in_by: string;
  }>;
}

interface BulkCheckInResult {
  code: string;
  status: "success" | "not_found" | "already_checked_in" | "wrong_event";
  message: string;
  user?: string;
  checked_in_at?: string;
}

const getCookieValue = (name: string): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()!.split(";").shift()!;
    return decodeURIComponent(cookieValue);
  }
  return "";
};

const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
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

export default function AttendanceCheckInPage() {
  const { user, loading: authLoading } = useAuth();

  // Single check-in state
  const [attendanceCode, setAttendanceCode] = useState("");
  const [singleNotes, setSingleNotes] = useState("");
  const [singleLoading, setSingleLoading] = useState(false);

  // Bulk check-in state
  const [bulkCodes, setBulkCodes] = useState("");
  const [bulkNotes, setBulkNotes] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState<BulkCheckInResult[]>([]);

  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [eventsLoading, setEventsLoading] = useState(true);

  // Stats state
  const [checkInStats, setCheckInStats] = useState<CheckInStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  // Fetch check-in stats
  const fetchCheckInStats = async () => {
    if (!selectedEventId) return;

    try {
      setStatsLoading(true);
      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/events/${selectedEventId}/check-in-stats`
      );
      if (response.ok) {
        const data = await response.json();
        setCheckInStats(data);
      } else {
        toast.error("Yoklama istatistikleri yüklenirken hata oluştu");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Yoklama istatistikleri yüklenirken hata oluştu");
    } finally {
      setStatsLoading(false);
    }
  };
  // Single check-in handler
  const handleSingleCheckIn = async () => {
    if (!selectedEventId) {
      toast.error("Lütfen önce bir etkinlik seçin");
      return;
    }

    if (!attendanceCode.trim()) {
      toast.error("Lütfen bir yoklama kodu girin");
      return;
    }

    try {
      setSingleLoading(true);
      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/events/${selectedEventId}/check-in-by-code`,
        {
          method: "POST",
          body: JSON.stringify({
            attendance_code: attendanceCode.toUpperCase(),
            notes: singleNotes,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(
          `${data.registration.user.first_name} ${data.registration.user.last_name} için yoklama başarılı`
        );
        setAttendanceCode("");
        setSingleNotes("");
        fetchCheckInStats(); // Refresh stats
      } else {
        toast.error(data.message || "Yoklama işlemi başarısız");
      }
    } catch (error) {
      console.error("Error checking in:", error);
      toast.error("Yoklama sırasında bir hata oluştu");
    } finally {
      setSingleLoading(false);
    }
  };
  // Bulk check-in handler
  const handleBulkCheckIn = async () => {
    if (!selectedEventId) {
      toast.error("Lütfen önce bir etkinlik seçin");
      return;
    }

    const codes = bulkCodes
      .split(/[\n,]/)
      .map((code) => code.trim().toUpperCase())
      .filter((code) => code.length === 8);

    if (codes.length === 0) {
      toast.error("Lütfen geçerli yoklama kodları girin (her biri 8 karakter)");
      return;
    }

    try {
      setBulkLoading(true);
      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/events/${selectedEventId}/bulk-check-in`,
        {
          method: "POST",
          body: JSON.stringify({
            attendance_codes: codes,
            notes: bulkNotes,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBulkResults(data.results || []);
        const summary = data.summary || {};
        if (summary.successfully_checked_in > 0) {
          let message = `${summary.successfully_checked_in} kişi başarıyla yoklandı`;
          if (summary.already_checked_in > 0) {
            message += `, ${summary.already_checked_in} kişi zaten yoklanmış`;
          }
          if (summary.not_found > 0) {
            message += `, ${summary.not_found} kod bulunamadı`;
          }
          if (summary.wrong_event > 0) {
            message += `, ${summary.wrong_event} kod başka etkinliklere ait`;
          }

          toast.success(message);
        } else {
          toast.error(
            "Yeni yoklama yok. Ayrıntılar için aşağıdaki sonuçlara bakın."
          );
        }

        fetchCheckInStats(); // Refresh stats
      } else {
        toast.error(data.message || "Toplu yoklama başarısız");
      }
    } catch (error) {
      console.error("Error in bulk check-in:", error);
      toast.error("An error occurred during bulk check-in");
    } finally {
      setBulkLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      try {
        const response = await authenticatedFetch(
          "http://localhost:8000/api/admin/events"
        );
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
        } else {
          setEvents([]);
        }
      } catch (error) {
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch stats when event is selected
  useEffect(() => {
    if (selectedEventId) {
      fetchCheckInStats();
    }
  }, [selectedEventId]);

  const selectedEvent = events.find((e) => e.id.toString() === selectedEventId);
  return (
    <RequireRole
      role="admin"
      communityId={1}
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />{" "}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Erişim Reddedildi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bu sayfaya erişmek için yönetici izinlerine ihtiyacınız var.
            </p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl shadow-xl">
              <div className="absolute inset-0 bg-black opacity-10 dark:opacity-20"></div>
              <div className="relative px-8 py-12">
                <div className="flex items-center justify-between">
                  <div>
                    {" "}
                    <h1 className="text-4xl font-bold text-white mb-2">
                      Yoklama Kontrolü
                    </h1>
                    <p className="text-blue-100 dark:text-blue-200 text-lg">
                      Etkinlik yoklamasını yönetin ve katılımcıları gerçek
                      zamanlı güncellemelerle yoklayın
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                      <UserCheck className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Selection */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 dark:bg-white/30 rounded-lg">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <span className="text-xl">Etkinlik Seçimi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    {" "}
                    <Label
                      htmlFor="event-select"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block"
                    >
                      Yönetilecek Etkinliği Seç
                    </Label>
                    <Select
                      value={selectedEventId?.toString() || ""}
                      onValueChange={(value) => {
                        const eventId = Number(value);
                        setSelectedEventId(eventId.toString());
                      }}
                    >
                      {" "}
                      <SelectTrigger className="h-32 text-lg border-2 border-purple-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-gray-700 dark:to-gray-600 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-500 focus:from-purple-50 focus:to-indigo-50 dark:focus:from-gray-600 dark:focus:to-gray-500 rounded-xl text-gray-900 dark:text-white">
                        {" "}
                        <SelectValue
                          placeholder={
                            eventsLoading
                              ? "🔄 Etkinlikler yükleniyor..."
                              : "🎯 Yoklama yönetimi için bir etkinlik seçin"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 backdrop-blur-xl shadow-2xl border-2 border-blue-200 dark:border-gray-600 rounded-xl overflow-hidden max-h-[500px] min-h-96 w-full dropdown-enhanced dropdown-scroll">
                        {events.map((event) => (
                          <SelectItem
                            key={event.id}
                            value={event.id.toString()}
                            className="py-6 mx-2 my-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-gray-600 dark:hover:to-gray-500 focus:bg-gradient-to-r focus:from-purple-100 focus:to-indigo-100 dark:focus:from-gray-500 dark:focus:to-gray-400 transition-all duration-200 border border-transparent hover:border-blue-300 dark:hover:border-gray-500 focus:border-purple-400 dark:focus:border-gray-400 cursor-pointer min-h-[80px] flex items-center"
                          >
                            {" "}
                            <div className="py-3 w-full">
                              <div className="font-bold text-lg bg-gradient-to-r from-gray-800 to-blue-800 dark:from-gray-100 dark:to-blue-200 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-300 dark:hover:to-purple-300 transition-all duration-200 leading-relaxed">
                                {event.event}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-300 mt-2 flex items-center gap-2">
                                <span className="text-blue-500 dark:text-blue-400">
                                  📅
                                </span>
                                <span className="font-medium">
                                  {new Date(
                                    event.start_datetime
                                  ).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              {event.location && (
                                <div className="text-sm text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-2">
                                  <span className="text-green-500 dark:text-green-400">
                                    📍
                                  </span>
                                  <span className="font-medium">
                                    {event.location}
                                  </span>
                                </div>
                              )}
                              {event.community &&
                                typeof event.community === "object" && (
                                  <div className="text-sm text-purple-600 dark:text-purple-400 mt-1 font-medium flex items-center gap-2">
                                    <span className="text-purple-500 dark:text-purple-400">
                                      🏢
                                    </span>
                                    <span>{event.community.community}</span>
                                  </div>
                                )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>{" "}
                    {!eventsLoading && events.length === 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200 dark:border-yellow-700 rounded-xl text-yellow-700 dark:text-yellow-300 flex items-center gap-3 shadow-lg animate-in fade-in duration-300">
                        <AlertTriangle className="h-6 w-6" />{" "}
                        <span className="font-semibold text-lg">
                          Şu anda yönetilecek etkinlik bulunmamaktadır.
                        </span>
                      </div>
                    )}
                    {selectedEventId && (
                      <div className="flex items-center gap-3 text-green-700 dark:text-green-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-xl mt-6 border border-green-200 dark:border-green-700 shadow-lg animate-in slide-in-from-top duration-300">
                        <div className="p-2 bg-green-500 rounded-full">
                          <CheckCircle className="h-6 w-6" />
                        </div>{" "}
                        <div className="text-sm">
                          Etkinlik ayrıntıları başarıyla yüklendi. Yoklama
                          yönetimine hazır.
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedEventId && (
                    <div className="p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl border border-blue-200 dark:border-gray-600 shadow-lg animate-in slide-in-from-bottom duration-500">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Calendar className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 leading-tight">
                            {selectedEvent?.event}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 p-3 bg-white/60 dark:bg-gray-600/60 rounded-lg">
                              <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                              <div>
                                <span className="font-semibold block text-gray-800 dark:text-gray-200">
                                  Tarih & Saat
                                </span>
                                <span className="text-gray-600 dark:text-gray-300">
                                  {selectedEvent
                                    ? new Date(
                                        selectedEvent.start_datetime
                                      ).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : ""}
                                </span>
                              </div>
                            </div>
                            {selectedEvent?.location && (
                              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 p-3 bg-white/60 dark:bg-gray-600/60 rounded-lg">
                                <span className="text-green-500 dark:text-green-400 text-lg flex-shrink-0">
                                  📍
                                </span>
                                <div>
                                  <span className="font-semibold block text-gray-800 dark:text-gray-200">
                                    Konum
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-300">
                                    {selectedEvent.location}
                                  </span>
                                </div>
                              </div>
                            )}
                            {selectedEvent?.community &&
                              typeof selectedEvent.community === "object" && (
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 p-3 bg-white/60 dark:bg-gray-600/60 rounded-lg">
                                  <Users className="h-5 w-5 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                                  <div>
                                    <span className="font-semibold block text-gray-800 dark:text-gray-200">
                                      Topluluk
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-300">
                                      {selectedEvent.community.community}
                                    </span>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedEventId && (
              <>
                {/* Statistics */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 dark:bg-white/30 rounded-lg">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <span className="text-xl">Yoklama İstatistikleri</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={fetchCheckInStats}
                        disabled={statsLoading}
                        className="ml-auto bg-white/20 hover:bg-white/30 dark:bg-white/30 dark:hover:bg-white/40 text-white border-white/30"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${
                            statsLoading ? "animate-spin" : ""
                          }`}
                        />
                        Yenile
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {checkInStats ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                          <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                              <Users className="h-10 w-10 opacity-80" />
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold">
                                  {Math.round(
                                    (checkInStats.total_registrations /
                                      Math.max(
                                        checkInStats.total_registrations,
                                        100
                                      )) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">
                              {checkInStats.total_registrations}
                            </div>{" "}
                            <div className="text-blue-100 text-sm">
                              Toplam Kayıtlı
                            </div>
                          </div>
                        </div>

                        <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                          <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                              <UserCheck className="h-10 w-10 opacity-80" />
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <TrendingUp className="h-6 w-6" />
                              </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">
                              {checkInStats.checked_in_count}
                            </div>{" "}
                            <div className="text-green-100 text-sm">
                              Yoklama Alındı
                            </div>
                          </div>
                        </div>

                        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                          <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                              <BarChart3 className="h-10 w-10 opacity-80" />
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Activity className="h-6 w-6" />
                              </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">
                              {checkInStats.attendance_rate}%
                            </div>{" "}
                            <div className="text-purple-100 text-sm">
                              Katılım Oranı
                            </div>
                          </div>
                        </div>

                        <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-yellow-600 dark:from-orange-600 dark:to-yellow-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                          <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                              <Clock className="h-10 w-10 opacity-80" />
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold">
                                  {checkInStats.pending_check_ins}
                                </span>
                              </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">
                              {checkInStats.pending_check_ins}
                            </div>{" "}
                            <div className="text-orange-100 text-sm">
                              Bekleyen Yoklamalar
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : statsLoading ? (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-full mb-4">
                          <RefreshCw className="h-8 w-8 animate-spin text-white" />
                        </div>{" "}
                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                          İstatistikler yükleniyor...
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>{" "}
                        <p className="text-gray-500 dark:text-gray-400">
                          İstatistik mevcut değil
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Check-In Tabs */}
                <Tabs defaultValue="single" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl h-14">
                    <TabsTrigger
                      value="single"
                      className="h-12 rounded-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-gray-700 dark:text-gray-300"
                    >
                      <Hash className="h-5 w-5 mr-2" />
                      Tekli Yoklama
                    </TabsTrigger>
                    <TabsTrigger
                      value="bulk"
                      className="h-12 rounded-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-gray-700 dark:text-gray-300"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Toplu Yoklama
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="single" className="space-y-4">
                    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 dark:bg-white/30 rounded-lg">
                            <UserCheck className="h-6 w-6" />
                          </div>
                          <span className="text-xl">Tekli Yoklama</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="space-y-3">
                          {" "}
                          <Label
                            htmlFor="attendance-code"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Yoklama Kodu
                          </Label>
                          <Input
                            id="attendance-code"
                            value={attendanceCode}
                            onChange={(e) =>
                              setAttendanceCode(e.target.value.toUpperCase())
                            }
                            placeholder="8 karakterli kodu girin"
                            maxLength={8}
                            className="h-14 text-lg font-mono border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                        <div className="space-y-3">
                          {" "}
                          <Label
                            htmlFor="notes"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Notlar (İsteğe Bağlı)
                          </Label>
                          <Textarea
                            id="notes"
                            value={singleNotes}
                            onChange={(e) => setSingleNotes(e.target.value)}
                            placeholder="Bu yoklama hakkında notlar ekleyin"
                            rows={3}
                            className="border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg transition-colors resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                        <Button
                          onClick={handleSingleCheckIn}
                          disabled={singleLoading || !attendanceCode.trim()}
                          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                        >
                          {" "}
                          {singleLoading ? (
                            <>
                              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                              İşleniyor...
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-5 w-5 mr-2" />
                              Katılımcıyı Yokla
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="bulk" className="space-y-4">
                    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 dark:bg-white/30 rounded-lg">
                            <Users className="h-6 w-6" />
                          </div>
                          <span className="text-xl">Toplu Yoklama</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="bulk-codes"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Yoklama Kodları
                          </Label>
                          <Textarea
                            id="bulk-codes"
                            value={bulkCodes}
                            onChange={(e) => setBulkCodes(e.target.value)}
                            placeholder="Yoklama kodlarını satır satır veya virgülle ayırarak girin&#10;Örnek:&#10;ABC12345&#10;DEF67890&#10;GHI34567"
                            rows={8}
                            className="font-mono border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg transition-colors resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />{" "}
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Her biri 8 karakter olan birden fazla kodu satır
                            satır veya virgülle ayırarak girin
                          </p>
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="bulk-notes"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Notes (Optional)
                          </Label>
                          <Textarea
                            id="bulk-notes"
                            value={bulkNotes}
                            onChange={(e) => setBulkNotes(e.target.value)}
                            placeholder="Bu toplu yoklama hakkında notlar ekleyin"
                            rows={2}
                            className="border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg transition-colors resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                        <Button
                          onClick={handleBulkCheckIn}
                          disabled={bulkLoading || !bulkCodes.trim()}
                          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                        >
                          {bulkLoading ? (
                            <>
                              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Users className="h-5 w-5 mr-2" />
                              Toplu Yoklama
                            </>
                          )}
                        </Button>

                        {/* Bulk Results */}
                        {bulkResults.length > 0 && (
                          <div className="mt-6 space-y-2">
                            {" "}
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              Sonuçlar:
                            </h4>
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                              {bulkResults.map((result, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                                    result.status === "success"
                                      ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                                      : result.status === "already_checked_in"
                                      ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                                      : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                                  }`}
                                >
                                  {result.status === "success" ? (
                                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                  ) : result.status === "already_checked_in" ? (
                                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="h-4 w-4 flex-shrink-0" />
                                  )}
                                  <span className="font-mono font-semibold">
                                    {result.code}
                                  </span>
                                  <span>-</span>
                                  <span className="flex-1">
                                    {result.message}
                                  </span>
                                  {result.user && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {result.user}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Recent Check-ins */}
                {checkInStats && checkInStats.recent_check_ins.length > 0 && (
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                          <Activity className="h-6 w-6 text-white" />
                        </div>
                        Son Yoklamalar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {checkInStats.recent_check_ins.map((checkIn, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {checkIn.user}
                                </div>{" "}
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Yoklayan: {checkIn.checked_in_by}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(
                                  checkIn.checked_in_at
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
