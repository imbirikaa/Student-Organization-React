"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { usePermissions } from "@/app/context/permissions-context";
import RequireRole from "@/components/RequireRole";
import { RequirePermission } from "@/components/RequirePermission";
import { toast } from "react-hot-toast";
import {
  Clock,
  Check,
  X,
  User,
  Building,
  Calendar,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { LoadingSpinner, PageLoader } from "@/components/ui/loading";

interface Application {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  community: {
    id: number;
    name: string;
    logo: string;
  };
  application_date: string;
  status: string;
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

export default function CommunityApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await authenticatedFetch(
        "http://localhost:8000/api/admin/community-applications"
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        toast.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: number) => {
    setProcessingIds((prev) => new Set(prev).add(applicationId));

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/applications/${applicationId}/approve`,
        { method: "POST" }
      );

      if (response.ok) {
        toast.success("Application approved successfully!");
        await fetchApplications(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const handleReject = async (applicationId: number) => {
    const reason =
      prompt("Enter rejection reason (optional):") || "Application rejected";

    setProcessingIds((prev) => new Set(prev).add(applicationId));

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/admin/applications/${applicationId}/reject`,
        {
          method: "POST",
          body: JSON.stringify({ reason }),
        }
      );

      if (response.ok) {
        toast.success("Application rejected successfully!");
        await fetchApplications(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) return <PageLoader />;

  return (
    <RequireRole role="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Community Applications
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and manage pending community membership applications
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending Applications
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {applications.length}
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
                    Ready to Process
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {
                      applications.filter((app) => !processingIds.has(app.id))
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Communities
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Set(applications.map((app) => app.community.id)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pending Applications
              </h2>
            </div>

            <div className="p-6">
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Pending Applications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All community applications have been processed.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* User Info */}
                            <div>
                              <div className="flex items-center mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {application.user.name}
                                  </h3>
                                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Mail className="h-4 w-4 mr-1" />
                                    {application.user.email}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Community Info */}
                            <div>
                              <div className="flex items-center mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center">
                                  <Building className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {application.community.name}
                                  </h3>
                                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {formatDate(application.application_date)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => handleApprove(application.id)}
                            disabled={processingIds.has(application.id)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                          >
                            {processingIds.has(application.id) ? (
                              <LoadingSpinner className="mr-2" />
                            ) : (
                              <Check className="h-4 w-4 mr-2" />
                            )}
                            Approve
                          </Button>

                          <Button
                            onClick={() => handleReject(application.id)}
                            disabled={processingIds.has(application.id)}
                            variant="destructive"
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                          >
                            {processingIds.has(application.id) ? (
                              <LoadingSpinner className="mr-2" />
                            ) : (
                              <X className="h-4 w-4 mr-2" />
                            )}
                            Reject
                          </Button>
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
