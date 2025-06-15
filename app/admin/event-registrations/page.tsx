"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { usePermissions } from "@/app/context/permissions-context";
import RequireRole from "@/components/RequireRole";
import { RequirePermission } from "@/components/RequirePermission";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Filter,
  UserCheck,
  UserX,
  Building,
  TrendingUp,
} from "lucide-react";
import { LoadingSpinner, PageLoader } from "@/components/ui/loading";

interface Registration {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  event: {
    id: number;
    name: string;
    start_datetime: string;
    location: string;
    community: string;
  };
  registration_date: string;
  status: string;
}

interface RegistrationStats {
  total_registrations: number;
  confirmed_registrations: number;
  cancelled_registrations: number;
  attended_registrations: number;
  recent_registrations: number;
  upcoming_events: number;
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

export default function EventRegistrationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && user) {
      fetchRegistrations();
      fetchStats();
    }
  }, [authLoading, user, statusFilter]);

  const fetchRegistrations = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/event-registrations?${params}`
      );

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.data || []);
      } else {
        toast.error("Failed to fetch registrations");
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await authenticatedFetch(
        "http://localhost:8000/api/admin/event-registration-stats"
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleStatusUpdate = async (
    registrationId: number,
    newStatus: string
  ) => {
    setProcessingIds((prev) => new Set(prev).add(registrationId));

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/registrations/${registrationId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        toast.success(`Registration marked as ${newStatus}`);
        await fetchRegistrations();
        await fetchStats();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(registrationId);
        return newSet;
      });
    }
  };

  const handleCancel = async (registrationId: number) => {
    setProcessingIds((prev) => new Set(prev).add(registrationId));

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/registrations/${registrationId}/cancel`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast.success("Registration cancelled successfully");
        await fetchRegistrations();
        await fetchStats();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to cancel registration");
      }
    } catch (error) {
      console.error("Error cancelling registration:", error);
      toast.error("Failed to cancel registration");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(registrationId);
        return newSet;
      });
    }
  };

  const handleMarkAttended = async (registrationId: number) => {
    setProcessingIds((prev) => new Set(prev).add(registrationId));

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/registrations/${registrationId}/attend`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast.success("Registration marked as attended");
        await fetchRegistrations();
        await fetchStats();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to mark as attended");
      }
    } catch (error) {
      console.error("Error marking as attended:", error);
      toast.error("Failed to mark as attended");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(registrationId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "attended":
        return "bg-blue-100 text-blue-800";
      case "waitlist":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (authLoading || loading) {
    return <PageLoader />;
  }

  return (
    <RequireRole role="admin">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Event Registration Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage event registrations, track attendance, and monitor
              statistics
            </p>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.total_registrations}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Confirmed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.confirmed_registrations}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Attended
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.attended_registrations}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Cancelled
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.cancelled_registrations}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Recent (7d)
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.recent_registrations}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Upcoming Events
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.upcoming_events}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by status:
                </span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="attended">Attended</option>
                <option value="waitlist">Waitlist</option>
              </select>
            </div>
          </div>

          {/* Registrations List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Event Registrations
              </h2>
            </div>

            <div className="p-6">
              {registrations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No registrations found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No event registrations match your current filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((registration) => (
                    <div
                      key={registration.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <Users className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {registration.user.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {registration.user.email}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {registration.event.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {registration.event.community}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {registration.event.location}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(
                                      registration.event.start_datetime
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 mt-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    registration.status
                                  )}`}
                                >
                                  {registration.status.charAt(0).toUpperCase() +
                                    registration.status.slice(1)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Registered:{" "}
                                  {new Date(
                                    registration.registration_date
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {registration.status === "confirmed" && (
                            <Button
                              onClick={() =>
                                handleMarkAttended(registration.id)
                              }
                              disabled={processingIds.has(registration.id)}
                              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                              size="sm"
                            >
                              {processingIds.has(registration.id) ? (
                                <LoadingSpinner className="mr-2" />
                              ) : (
                                <UserCheck className="h-4 w-4 mr-2" />
                              )}
                              Mark Attended
                            </Button>
                          )}

                          {registration.status !== "cancelled" && (
                            <Button
                              onClick={() => handleCancel(registration.id)}
                              disabled={processingIds.has(registration.id)}
                              variant="destructive"
                              size="sm"
                            >
                              {processingIds.has(registration.id) ? (
                                <LoadingSpinner className="mr-2" />
                              ) : (
                                <UserX className="h-4 w-4 mr-2" />
                              )}
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
