"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { usePermissions } from "@/app/context/permissions-context";
import { RequirePermission } from "@/components/RequirePermission";
import { toast } from "react-hot-toast";
import {
  Shield,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
} from "lucide-react";
import { LoadingSpinner, PageLoader } from "@/components/ui/loading";

interface AuditLog {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
  action: string;
  resource_type: string | null;
  resource_id: number | null;
  old_values: any;
  new_values: any;
  description: string | null;
  ip_address: string | null;
  created_at: string;
}

interface AuditStats {
  total_actions: number;
  actions_today: number;
  actions_this_week: number;
  top_actions: Array<{
    action: string;
    count: number;
  }>;
  recent_activity: AuditLog[];
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

export default function AuditLogsPage() {
  const { user } = useAuth();
  const { getCurrentCommunityId } = usePermissions();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditStats, setAuditStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    action: "",
    resource_type: "",
    from_date: "",
    to_date: "",
    page: 1,
  });

  const communityId = getCurrentCommunityId();

  useEffect(() => {
    if (communityId) {
      fetchAuditLogs();
      fetchAuditStats();
      fetchAuditActions();
    }
  }, [communityId, filters]);

  const fetchAuditLogs = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${communityId}/audit-logs?${queryParams}`
      );

      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.audit_logs || []);
      } else {
        toast.error("Failed to fetch audit logs");
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditStats = async () => {
    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${communityId}/audit-stats`
      );

      if (response.ok) {
        const data = await response.json();
        setAuditStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching audit stats:", error);
    }
  };

  const fetchAuditActions = async () => {
    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${communityId}/audit-actions`
      );

      if (response.ok) {
        const data = await response.json();
        setActions(data.actions || []);
      }
    } catch (error) {
      console.error("Error fetching audit actions:", error);
    }
  };

  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getActionIcon = (action: string) => {
    if (action.includes("create")) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (action.includes("delete")) return <XCircle className="w-4 h-4 text-red-500" />;
    if (action.includes("update")) return <RefreshCw className="w-4 h-4 text-blue-500" />;
    if (action.includes("approve")) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (action.includes("reject")) return <XCircle className="w-4 h-4 text-red-500" />;
    if (action.includes("permission")) return <Shield className="w-4 h-4 text-orange-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const clearFilters = () => {
    setFilters({
      action: "",
      resource_type: "",
      from_date: "",
      to_date: "",
      page: 1,
    });
  };

  if (!communityId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Community Selected
          </h2>
          <p className="text-gray-600">
            Please select a community to view audit logs.
          </p>
        </div>
      </div>
    );
  }

  if (loading) return <PageLoader />;

  return (
    <RequirePermission communityId={communityId} permission="view_audit_logs">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Shield className="w-8 h-8 mr-3 text-blue-600" />
                  Audit Logs
                </h1>
                <p className="text-gray-600 mt-2">
                  Track all permission-based actions in your community
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {auditStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Actions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {auditStats.total_actions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {auditStats.actions_today}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {auditStats.actions_this_week}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Top Action</p>
                    <p className="text-lg font-bold text-gray-900">
                      {auditStats.top_actions[0]?.action.replace(/_/g, " ") || "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action
                </label>
                <select
                  value={filters.action}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, action: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Actions</option>
                  {actions.map((action) => (
                    <option key={action} value={action}>
                      {formatAction(action)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Type
                </label>
                <select
                  value={filters.resource_type}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, resource_type: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Resources</option>
                  <option value="User">User</option>
                  <option value="Event">Event</option>
                  <option value="Community">Community</option>
                  <option value="ForumTopic">Forum Topic</option>
                  <option value="CommunityMembership">Membership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.from_date}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, from_date: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.to_date}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, to_date: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Audit Log Entries</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No audit logs found
                        </h3>
                        <p className="text-gray-600">
                          No audit log entries match your current filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getActionIcon(log.action)}
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {formatAction(log.action)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {log.user ? (
                              <>
                                <div className="font-medium">{log.user.name}</div>
                                <div className="text-gray-500">{log.user.email}</div>
                              </>
                            ) : (
                              <span className="text-gray-500">System</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {log.resource_type && (
                              <>
                                <div className="font-medium">{log.resource_type}</div>
                                {log.resource_id && (
                                  <div className="text-gray-500">ID: {log.resource_id}</div>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {log.description || "No description"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {log.ip_address || "Unknown"}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}
