"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { toast } from "react-hot-toast";
import {
  QrCode,
  Hash,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Copy,
  Share2,
  Users,
  ExternalLink,
  AlertCircle,
  Download,
  Ticket,
  User,
} from "lucide-react";
import { LoadingSpinner, PageLoader } from "@/components/ui/loading";

interface AttendanceCode {
  id: number;
  attendance_code: string;
  checked_in_at: string | null;
  checked_in_by: string | null;
  check_in_notes: string | null;
  status: string;
  registration_date: string;
  event: {
    id: number;
    event: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    max_participants: number | null;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
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
      ...options.headers,
      "X-XSRF-TOKEN": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export default function MyAttendanceCodesPage() {
  const { user, loading: authLoading } = useAuth();
  const [attendanceCodes, setAttendanceCodes] = useState<AttendanceCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceCodes = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(
        "http://localhost:8000/api/my-attendance-codes"
      );
      if (!response.ok) {
        throw new Error("Yoklama kodları getirilemedi");
      }
      const data = await response.json();
      setAttendanceCodes(data.attendance_codes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
      toast.error("Yoklama kodları yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchAttendanceCodes();
    }
  }, [user, authLoading]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Attendance code copied to clipboard!");
  };
  const shareCode = (code: AttendanceCode) => {
    const eventName = code.event.event || "Event";
    if (navigator.share) {
      navigator.share({
        title: `Attendance Code for ${eventName}`,
        text: `My attendance code: ${code.attendance_code}`,
        url: window.location.origin + "/attendance-guide",
      });
    } else {
      copyToClipboard(code.attendance_code);
    }
  };
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date not set";
    try {
      return new Date(dateString).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };
  if (authLoading || loading) {
    return <PageLoader text="Loading your attendance codes..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          {" "}
          <h1 className="text-2xl font-bold text-white mb-4">
            Yoklama kodlarınızı görüntülemek için giriş yapın
          </h1>{" "}
          <Button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Giriş Sayfasına Git
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Ticket className="w-8 h-8 text-white" />
          </div>{" "}
          <h1 className="text-4xl font-bold text-white mb-4">
            Yoklama Kodlarım
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Tüm etkinlik yoklama kodlarınız burada. Bu kodları etkinliklerde
            yoklama almak için kullanın.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-blue-400" />
              </div>{" "}
              <div>
                <p className="text-blue-200 text-sm">Toplam Kod</p>
                <p className="text-2xl font-bold text-white">
                  {attendanceCodes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>{" "}
              <div>
                <p className="text-blue-200 text-sm">Yoklama Alındı</p>
                <p className="text-2xl font-bold text-white">
                  {attendanceCodes.filter((code) => code.checked_in_at).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>{" "}
              <div>
                <p className="text-blue-200 text-sm">Beklemede</p>
                <p className="text-2xl font-bold text-white">
                  {attendanceCodes.filter((code) => !code.checked_in_at).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Codes List */}
        {attendanceCodes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-12 h-12 text-gray-400" />
            </div>{" "}
            <h3 className="text-xl font-bold text-white mb-2">
              Yoklama Kodu Yok
            </h3>
            <p className="text-blue-200 mb-6">
              Henüz hiçbir etkinliğe kayıt olmadınız.
            </p>
            <Button
              onClick={() => (window.location.href = "/etkinlikler")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Etkinlikleri Gözat
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {attendanceCodes.map((code) => (
              <div
                key={code.id}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
              >
                <div className="p-6">
                  {" "}
                  {/* Event Header with Status */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-blue-300 font-medium">
                          Event
                        </span>
                      </div>{" "}
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {code.event.event || "Untitled Event"}
                      </h3>
                      {code.event.description && (
                        <p className="text-blue-200 mb-4 line-clamp-2">
                          {code.event.description}
                        </p>
                      )}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        code.checked_in_at
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      }`}
                    >
                      {code.checked_in_at ? "✓ Checked In" : "⏳ Pending"}
                    </div>
                  </div>{" "}
                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-blue-200">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(code.event.start_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {code.event.location || "Location TBA"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {code.event.max_participants
                          ? `Max ${code.event.max_participants} participants`
                          : "No participant limit"}
                      </span>
                    </div>
                  </div>
                  {/* Attendance Code Section */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 mb-4 border border-blue-500/20">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300 mb-3">
                        {" "}
                        <Hash className="w-3 h-3" />
                        <span>
                          Valid only for: {code.event.event || "This event"}
                        </span>
                      </div>
                      <p className="text-blue-200 text-sm font-medium mb-2">
                        Your Attendance Code
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <Hash className="w-6 h-6 text-blue-400" />
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-mono font-bold text-white tracking-wider">
                              {code.attendance_code}
                            </div>
                            <p className="text-blue-300 text-xs">
                              8-Character Unique Code
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-3">
                      <Button
                        onClick={() => copyToClipboard(code.attendance_code)}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </Button>
                      <Button
                        onClick={() => shareCode(code)}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        onClick={() =>
                          (window.location.href = `/etkinlik/${code.event.id}`)
                        }
                        variant="outline"
                        size="sm"
                        className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
                      >
                        {" "}
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Etkinliği Görüntüle
                      </Button>
                    </div>

                    {/* Warning notice */}
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-yellow-200 text-xs">
                            <strong>Important:</strong> This code is exclusively
                            for "{code.event.event || "this event"}" and cannot
                            be used for other events.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Check-in Status */}
                  {code.checked_in_at && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <p className="text-green-300 font-medium">
                            Checked In Successfully
                          </p>
                          <p className="text-green-200 text-sm">
                            {formatDate(code.checked_in_at)}
                          </p>
                          {code.checked_in_by && (
                            <p className="text-green-200 text-sm">
                              Checked in by: {code.checked_in_by}
                            </p>
                          )}
                          {code.check_in_notes && (
                            <p className="text-green-200 text-sm mt-1">
                              Notes: {code.check_in_notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 text-center">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-2">
              Need Help Using Your Codes?
            </h3>
            <p className="text-blue-200 mb-4">
              Learn how to use your attendance codes and check in at events.
            </p>
            <Button
              onClick={() => (window.location.href = "/attendance-guide")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {" "}
              <ExternalLink className="w-4 h-4 mr-2" />
              Yoklama Rehberini Görüntüle
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
