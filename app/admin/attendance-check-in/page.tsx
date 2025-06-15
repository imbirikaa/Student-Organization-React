"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { usePermissions } from "@/app/context/permissions-context";
import {
  RequirePermission,
  RequireRole,
  PermissionButton,
} from "@/components/RequirePermission";
import { toast } from "react-hot-toast";
import {
  QrCode,
  Hash,
  CheckCircle,
  Users,
  Clock,
  TrendingUp,
  UserCheck,
  Search,
  Calendar,
  BarChart3,
  Shield,
} from "lucide-react";
import { LoadingSpinner, PageLoader } from "@/components/ui/loading";

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
  const { hasPermission, getUserRole } = usePermissions();
  const [attendanceCode, setAttendanceCode] = useState("");
  const [bulkCodes, setBulkCodes] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(
    null
  );
  const [events, setEvents] = useState<any[]>([]);
  const [checkInStats, setCheckInStats] = useState<CheckInStats | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchEvents();
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (selectedEventId) {
      fetchCheckInStats();
    }
  }, [selectedEventId]);
  const fetchEvents = async () => {
    try {
      const response = await authenticatedFetch(
        "http://localhost:8000/api/admin/events"
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data || []);
        if (data.data?.length > 0) {
          setSelectedEventId(data.data[0].id);
          // Find community ID from the first event
          const firstEvent = data.data[0];
          if (firstEvent.community_id) {
            setSelectedCommunityId(firstEvent.community_id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchCheckInStats = async () => {
    if (!selectedEventId) return;

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/events/${selectedEventId}/check-in-stats`
      );
      if (response.ok) {
        const data = await response.json();
        setCheckInStats(data);
      }
    } catch (error) {
      console.error("Error fetching check-in stats:", error);
    }
  };
  const handleSingleCheckIn = async () => {
    if (!attendanceCode.trim()) {
      toast.error("Please enter an attendance code");
      return;
    }

    if (!selectedEventId) {
      toast.error("Please select an event first");
      return;
    }

    setLoading(true);

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/events/${selectedEventId}/check-in-by-code`,
        {
          method: "POST",
          body: JSON.stringify({
            attendance_code: attendanceCode.toUpperCase(),
            notes: notes || undefined,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `Successfully checked in: ${data.registration.user.first_name} ${data.registration.user.last_name}`
        );
        setAttendanceCode("");
        setNotes("");
        fetchCheckInStats(); // Refresh stats
      } else {
        toast.error(data.message || "Check-in failed");
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      toast.error("Check-in failed");
    } finally {
      setLoading(false);
    }
  };
  const handleBulkCheckIn = async () => {
    const codes = bulkCodes
      .split(/[\n,]/)
      .map((code) => code.trim().toUpperCase())
      .filter((code) => code.length === 8);

    if (codes.length === 0) {
      toast.error("Please enter valid attendance codes");
      return;
    }

    if (!selectedEventId) {
      toast.error("Please select an event first");
      return;
    }

    setLoading(true);

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/events/${selectedEventId}/bulk-check-in`,
        {
          method: "POST",
          body: JSON.stringify({
            attendance_codes: codes,
            notes: notes || undefined,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const { summary } = data;
        const message = `Bulk check-in completed: ${summary.successfully_checked_in} checked in, ${summary.already_checked_in} already checked in, ${summary.not_found} not found`;
        if (summary.wrong_event > 0) {
          toast(
            `${message}, ${summary.wrong_event} codes belonged to other events`,
            {
              icon: "⚠️",
              duration: 5000,
            }
          );
        } else {
          toast.success(message);
        }

        setBulkCodes("");
        setNotes("");
        fetchCheckInStats(); // Refresh stats
      } else {
        toast.error(data.message || "Bulk check-in failed");
      }
    } catch (error) {
      console.error("Error during bulk check-in:", error);
      toast.error("Bulk check-in failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <PageLoader />;
  }
  // Show basic content if no community selected yet, but require general admin role
  if (!selectedCommunityId) {
    return (
      <RequireRole
        communityId={1}
        role="admin"
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Access Denied
              </h1>
              <p className="text-gray-600">
                You need admin permissions to access this page.
              </p>
            </div>
          </div>
        }
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Event Attendance Check-In
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Select an event to begin checking in attendees
              </p>
            </div>

            {/* Event Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Event
              </label>
              <select
                value={selectedEventId || ""}
                onChange={(e) => {
                  const eventId = Number(e.target.value);
                  setSelectedEventId(eventId);
                  const selectedEvent = events.find(
                    (event) => event.id === eventId
                  );
                  if (selectedEvent?.community_id) {
                    setSelectedCommunityId(selectedEvent.community_id);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select an event...</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.event} - {event.community} -{" "}
                    {new Date(event.start_datetime).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </RequireRole>
    );
  }

  return (
    <RequirePermission
      communityId={selectedCommunityId}
      permission="manage_attendance"
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You need attendance management permissions in this community.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Current role: {getUserRole(selectedCommunityId) || "None"}
            </p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Event Attendance Check-In
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Check in attendees using attendance codes or QR codes
            </p>
          </div>
          {/* Event Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Event
            </label>{" "}
            <select
              value={selectedEventId || ""}
              onChange={(e) => {
                const eventId = Number(e.target.value);
                setSelectedEventId(eventId);
                // Update community ID when event changes
                const selectedEvent = events.find(
                  (event) => event.id === eventId
                );
                if (selectedEvent?.community_id) {
                  setSelectedCommunityId(selectedEvent.community_id);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select an event...</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.event} - {event.community} -{" "}
                  {new Date(event.start_datetime).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          {/* Check-in Statistics */}
          {checkInStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Registered
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {checkInStats.total_registrations}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Checked In
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {checkInStats.checked_in_count}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Attendance Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {checkInStats.attendance_rate}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {checkInStats.pending_check_ins}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Single Check-In */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <Hash className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Single Check-In
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attendance Code
                  </label>
                  <input
                    type="text"
                    value={attendanceCode}
                    onChange={(e) =>
                      setAttendanceCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter 8-character code"
                    maxLength={8}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white uppercase font-mono text-lg tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about the check-in..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <Button
                  onClick={handleSingleCheckIn}
                  disabled={loading || !attendanceCode.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  {loading ? (
                    <LoadingSpinner className="mr-2" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  )}
                  Check In
                </Button>
              </div>
            </div>

            {/* Bulk Check-In */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Bulk Check-In
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attendance Codes (one per line or comma-separated)
                  </label>
                  <textarea
                    value={bulkCodes}
                    onChange={(e) => setBulkCodes(e.target.value)}
                    placeholder="ABCD1234,EFGH5678&#10;IJKL9012&#10;MNOP3456"
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  />
                </div>

                <Button
                  onClick={handleBulkCheckIn}
                  disabled={loading || !bulkCodes.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  {loading ? (
                    <LoadingSpinner className="mr-2" />
                  ) : (
                    <Users className="h-5 w-5 mr-2" />
                  )}
                  Bulk Check In
                </Button>
              </div>
            </div>
          </div>
          {/* Recent Check-ins */}
          {checkInStats && checkInStats.recent_check_ins.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Check-ins
              </h3>
              <div className="space-y-3">
                {checkInStats.recent_check_ins.map((checkIn, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {checkIn.user}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Checked in by: {checkIn.checked_in_by}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(checkIn.checked_in_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}{" "}
        </div>
      </div>
    </RequirePermission>
  );
}
