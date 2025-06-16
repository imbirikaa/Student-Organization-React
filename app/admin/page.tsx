"use client";
import React, { useState, useEffect } from "react";
import RequireRole from "@/components/RequireRole";
import { useAuth } from "@/app/context/auth-context";
import {
  LayoutDashboard,
  Users,
  Building,
  Calendar,
  Shield,
  Bell,
  ChevronDown,
  Search,
  Users2,
  BarChart3,
  Server,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Menu,
  X,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoader, LoadingSpinner } from "@/components/ui/loading";
import Image from "next/image";

// Mock Data - Replace with your actual API data
const mockStats = {
  totalUsers: { value: 1256, change: 12.5 },
  totalCommunities: { value: 78, change: 5.2 },
  pendingApplications: { value: 15, change: -2.1 },
  activeEvents: { value: 34, change: 8.0 },
};

const mockRecentUsers = [
  {
    id: 1,
    name: "Ali Veli",
    email: "ali.veli@example.com",
    joinDate: "2024-06-12",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Ayşe Yılmaz",
    email: "ayse.yilmaz@example.com",
    joinDate: "2024-06-12",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Mehmet Öztürk",
    email: "mehmet.ozturk@example.com",
    joinDate: "2024-06-11",
    status: "Banned",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Fatma Kaya",
    email: "fatma.kaya@example.com",
    joinDate: "2024-06-11",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

const mockRecentCommunities = [
  {
    id: 1,
    name: "Bilgisayar Mühendisliği Kulübü",
    creator: "Zeynep Çelik",
    members: 152,
    createdDate: "2024-06-10",
  },
  {
    id: 2,
    name: "E-Spor Topluluğu",
    creator: "Can Kurt",
    members: 230,
    createdDate: "2024-06-09",
  },
  {
    id: 3,
    name: "Müzik ve Sanat Derneği",
    creator: "Elif Doğan",
    members: 88,
    createdDate: "2024-06-08",
  },
];

// Components
type SidebarLinkProps = {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon,
  text,
  isActive = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left ${
      isActive
        ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
    }`}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </button>
);

type StatCardProps = {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  loading = false,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
      >
        {loading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          icon
        )}
      </div>
      <div
        className={`flex items-center text-sm font-medium ${
          change >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {change >= 0 ? (
          <TrendingUp className="w-4 h-4 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 mr-1" />
        )}
        {Math.abs(change)}%
      </div>
    </div>{" "}
    <div className="space-y-1">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {loading ? (
          <span className="inline-block w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
        ) : (
          value.toLocaleString()
        )}
      </p>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { user, roles, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  // State for real data
  const [stats, setStats] = useState(mockStats);
  const [recentUsers, setRecentUsers] = useState(mockRecentUsers);
  const [recentCommunities, setRecentCommunities] = useState(
    mockRecentCommunities
  );
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for comprehensive admin data
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allCommunities, setAllCommunities] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Fetch real admin data only when user is authenticated and has admin role
  useEffect(() => {
    const fetchAdminData = async () => {
      // Don't fetch if auth is still loading or user doesn't have admin role
      if (authLoading || !user || !roles.includes("admin")) {
        console.log("Skipping admin data fetch:", {
          authLoading,
          user: !!user,
          roles,
        });
        setDataLoading(false);
        return;
      }
      try {
        setDataLoading(true);
        setError(null);
        console.log("Starting admin data fetch...");

        // Get CSRF token
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });

        console.log("CSRF token obtained");

        // Fetch admin statistics
        const statsRes = await fetch("http://localhost:8000/api/admin/stats", {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": getCookieValue("XSRF-TOKEN") || "",
          },
        });

        console.log("Stats response status:", statsRes.status);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          console.log("Stats data received:", statsData);
          setStats(statsData);
        } else {
          const errorText = await statsRes.text();
          console.error("Stats fetch failed:", statsRes.status, errorText);
          setError("Failed to fetch statistics");
        } // Fetch recent users
        const usersRes = await fetch(
          "http://localhost:8000/api/admin/recent-users",
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "X-XSRF-TOKEN": getCookieValue("XSRF-TOKEN") || "",
            },
          }
        );

        console.log("Users response status:", usersRes.status);
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          console.log("Users data received:", usersData);
          setRecentUsers(usersData);
        } else {
          console.error("Users fetch failed:", usersRes.status);
          // Keep mock data if fetch fails
        }

        // Fetch recent communities
        const communitiesRes = await fetch(
          "http://localhost:8000/api/admin/recent-communities",
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "X-XSRF-TOKEN": getCookieValue("XSRF-TOKEN") || "",
            },
          }
        );

        console.log("Communities response status:", communitiesRes.status);
        if (communitiesRes.ok) {
          const communitiesData = await communitiesRes.json();
          console.log("Communities data received:", communitiesData);
          setRecentCommunities(communitiesData);
        } else {
          console.error("Communities fetch failed:", communitiesRes.status);
          // Keep mock data if fetch fails
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        setError("Failed to load admin dashboard data");
      } finally {
        setDataLoading(false);
      }
    };

    fetchAdminData();
  }, [user, roles, authLoading]); // Add dependencies

  // Helper function to get cookie value
  const getCookieValue = (name: string): string => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift()!;
    return "";
  };

  // Comprehensive data fetching functions
  const fetchUsers = async () => {
    if (!user || !roles.includes("admin")) return;

    try {
      setUsersLoading(true);
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const response = await fetch("http://localhost:8000/api/admin/users", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookieValue("XSRF-TOKEN") || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      } else {
        console.error("Failed to fetch users:", response.status);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchCommunities = async () => {
    if (!user || !roles.includes("admin")) return;

    try {
      setCommunitiesLoading(true);
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const response = await fetch(
        "http://localhost:8000/api/admin/communities",
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": getCookieValue("XSRF-TOKEN") || "",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAllCommunities(data);
      } else {
        console.error("Failed to fetch communities:", response.status);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setCommunitiesLoading(false);
    }
  };

  const fetchEvents = async () => {
    if (!user || !roles.includes("admin")) return;

    try {
      setEventsLoading(true);
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const response = await fetch("http://localhost:8000/api/admin/events", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookieValue("XSRF-TOKEN") || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllEvents(data);
      } else {
        console.error("Failed to fetch events:", response.status);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchPendingApplications = async () => {
    if (!user || !roles.includes("admin")) return;

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const response = await fetch(
        "http://localhost:8000/api/admin/pending-applications",
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": getCookieValue("XSRF-TOKEN") || "",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingApplications(data);
      } else {
        console.error("Failed to fetch pending applications:", response.status);
      }
    } catch (error) {
      console.error("Error fetching pending applications:", error);
    }
  };

  // Effect to fetch data based on active tab
  useEffect(() => {
    if (!user || !roles.includes("admin")) return;

    switch (activeTab) {
      case "users":
        if (allUsers.length === 0) fetchUsers();
        break;
      case "communities":
        if (allCommunities.length === 0) fetchCommunities();
        break;
      case "events":
        if (allEvents.length === 0) fetchEvents();
        break;
      case "moderation":
        if (pendingApplications.length === 0) fetchPendingApplications();
        break;
    }
  }, [activeTab, user, roles]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  if (loading) return <PageLoader />;

  return (
    <RequireRole role="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:static lg:inset-0`}
          >
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              <SidebarLink
                icon={<LayoutDashboard className="w-5 h-5" />}
                text="Dashboard"
                isActive={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
              />
              <SidebarLink
                icon={<Users className="w-5 h-5" />}
                text="Kullanıcılar"
                isActive={activeTab === "users"}
                onClick={() => setActiveTab("users")}
              />
              <SidebarLink
                icon={<Building className="w-5 h-5" />}
                text="Topluluklar"
                isActive={activeTab === "communities"}
                onClick={() => setActiveTab("communities")}
              />
              <SidebarLink
                icon={<Calendar className="w-5 h-5" />}
                text="Etkinlikler"
                isActive={activeTab === "events"}
                onClick={() => setActiveTab("events")}
              />
              <SidebarLink
                icon={<Shield className="w-5 h-5" />}
                text="Moderasyon"
                isActive={activeTab === "moderation"}
                onClick={() => setActiveTab("moderation")}
              />
              <SidebarLink
                icon={<BarChart3 className="w-5 h-5" />}
                text="Analitik"
                isActive={activeTab === "analytics"}
                onClick={() => setActiveTab("analytics")}
              />
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 lg:ml-0">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {activeTab === "dashboard" && "Dashboard"}
                    {activeTab === "users" && "Kullanıcı Yönetimi"}
                    {activeTab === "communities" && "Topluluk Yönetimi"}
                    {activeTab === "events" && "Etkinlik Yönetimi"}
                    {activeTab === "moderation" && "Moderasyon"}
                    {activeTab === "analytics" && "Analitik"}
                  </h2>
                </div>{" "}
                <div className="flex items-center gap-4">
                  {activeTab === "dashboard" && (
                    <Button
                      onClick={() => window.location.reload()}
                      variant="ghost"
                      size="sm"
                      disabled={dataLoading}
                      className="flex items-center gap-2"
                    >
                      <Activity
                        className={`w-4 h-4 ${
                          dataLoading ? "animate-spin" : ""
                        }`}
                      />
                      Yenile
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </Button>
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full"></div>
                </div>
              </div>
            </header>{" "}
            {/* Page Content */}
            <main className="p-6">
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  {/* Error Banner */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <X className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700 dark:text-red-300">
                              {error}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => window.location.reload()}
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                          >
                            Yenile
                          </Button>
                          <Button
                            onClick={() => setError(null)}
                            size="sm"
                            variant="ghost"
                            className="text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20"
                          >
                            Kapat
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading Banner */}
                  {dataLoading && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <div className="flex items-center">
                        <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-3" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Admin verileri yükleniyor...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="Toplam Kullanıcı"
                      value={stats.totalUsers.value}
                      change={stats.totalUsers.change}
                      icon={<Users className="w-6 h-6 text-white" />}
                      color="from-blue-500 to-blue-600"
                      loading={dataLoading}
                    />
                    <StatCard
                      title="Toplam Topluluk"
                      value={stats.totalCommunities.value}
                      change={stats.totalCommunities.change}
                      icon={<Building className="w-6 h-6 text-white" />}
                      color="from-green-500 to-green-600"
                      loading={dataLoading}
                    />
                    <StatCard
                      title="Bekleyen Başvurular"
                      value={stats.pendingApplications.value}
                      change={stats.pendingApplications.change}
                      icon={<Clock className="w-6 h-6 text-white" />}
                      color="from-yellow-500 to-orange-500"
                      loading={dataLoading}
                    />
                    <StatCard
                      title="Aktif Etkinlikler"
                      value={stats.activeEvents.value}
                      change={stats.activeEvents.change}
                      icon={<Calendar className="w-6 h-6 text-white" />}
                      color="from-purple-500 to-purple-600"
                      loading={dataLoading}
                    />
                  </div>

                  {/* Recent Activity Grid */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Users */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Son Kullanıcılar
                        </h3>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Tümünü Gör
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {mockRecentUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <Image
                                src={user.avatar}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {user.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  user.status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                }`}
                              >
                                {user.status}
                              </span>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Communities */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Son Topluluklar
                        </h3>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Tümünü Gör
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {mockRecentCommunities.map((community) => (
                          <div
                            key={community.id}
                            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {community.name}
                              </h4>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>Kurucu: {community.creator}</span>
                              <span>{community.members} üye</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}{" "}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Kullanıcı Yönetimi
                    </h3>
                    <div className="flex gap-3">
                      <Button
                        onClick={fetchUsers}
                        variant="outline"
                        disabled={usersLoading}
                      >
                        {usersLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Activity className="w-4 h-4 mr-2" />
                        )}
                        Yenile
                      </Button>
                      <Button className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Kullanıcı
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Kullanıcı ara..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrele
                      </Button>
                    </div>

                    {usersLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Kullanıcılar yükleniyor...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(allUsers.length > 0 ? allUsers : mockRecentUsers).map(
                          (user: any) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <Image
                                  src={
                                    user.avatar ||
                                    user.profile_picture ||
                                    "/placeholder.svg?height=48&width=48"
                                  }
                                  alt={
                                    user.name ||
                                    `${user.first_name} ${user.last_name}`
                                  }
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 rounded-full"
                                />
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {user.name ||
                                      `${user.first_name} ${user.last_name}`}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user.email}
                                  </p>
                                  {user.nickname && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                      @{user.nickname}
                                    </p>
                                  )}
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Katılım:{" "}
                                    {user.joinDate ||
                                      user.created_at?.substring(0, 10)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`px-3 py-1 text-xs rounded-full ${
                                    (user.status || "Active") === "Active"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                  }`}
                                >
                                  {user.status || "Active"}
                                </span>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}{" "}
              {activeTab === "communities" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Topluluk Yönetimi
                    </h3>
                    <div className="flex gap-3">
                      <Button
                        onClick={fetchCommunities}
                        variant="outline"
                        disabled={communitiesLoading}
                      >
                        {communitiesLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Activity className="w-4 h-4 mr-2" />
                        )}
                        Yenile
                      </Button>
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Topluluk
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Topluluk ara..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrele
                      </Button>
                    </div>

                    {communitiesLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Topluluklar yükleniyor...
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(allCommunities.length > 0
                          ? allCommunities
                          : mockRecentCommunities
                        ).map((community: any) => (
                          <div
                            key={community.id}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <Building className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {community.name || community.community}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {community.members ||
                                    community.member_count ||
                                    0}{" "}
                                  üye
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              {community.description || "Açıklama yok"}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">
                                {community.createdDate ||
                                  community.created_at?.substring(0, 10)}
                              </span>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "events" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Etkinlik Yönetimi
                    </h3>
                    <div className="flex gap-3">
                      <Button
                        onClick={fetchEvents}
                        variant="outline"
                        disabled={eventsLoading}
                      >
                        {eventsLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Activity className="w-4 h-4 mr-2" />
                        )}
                        Yenile
                      </Button>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Etkinlik
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Etkinlik ara..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrele
                      </Button>
                    </div>

                    {eventsLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Etkinlikler yükleniyor...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {allEvents.length > 0 ? (
                          allEvents.map((event: any) => (
                            <div
                              key={event.id}
                              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    {event.event || event.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {event.description || "Açıklama yok"}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {event.start_datetime?.substring(0, 10)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {event.start_datetime?.substring(11, 16)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      {event.registrations_count || 0} katılımcı
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                              Henüz etkinlik yok
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "moderation" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Moderasyon
                    </h3>
                    <Button
                      onClick={fetchPendingApplications}
                      variant="outline"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Yenile
                    </Button>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Bekleyen Başvurular
                    </h4>

                    {pendingApplications.length > 0 ? (
                      <div className="space-y-4">
                        {pendingApplications.map((application: any) => (
                          <div
                            key={application.id}
                            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {application.user?.name ||
                                    `${application.user?.first_name} ${application.user?.last_name}`}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {application.community?.name ||
                                    application.community?.community}{" "}
                                  topluluğuna başvuru
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  {application.created_at?.substring(0, 10)}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Onayla
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  Reddet
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Bekleyen başvuru yok
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Analitik
                  </h3>
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Gelişmiş Analitik
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Detaylı istatistikler ve analitik raporlar yakında...
                    </p>
                  </div>
                </div>
              )}
              {/* Default fallback */}
              {![
                "dashboard",
                "users",
                "communities",
                "events",
                "moderation",
                "analytics",
              ].includes(activeTab) && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Server className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                    Sayfası
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Bu sayfa henüz geliştirilmekte.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>{" "}
        {/* Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </RequireRole>
  );
}
