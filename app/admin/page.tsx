"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";


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
  },
  {
    id: 2,
    name: "Ayşe Yılmaz",
    email: "ayse.yilmaz@example.com",
    joinDate: "2024-06-12",
    status: "Active",
  },
  {
    id: 3,
    name: "Mehmet Öztürk",
    email: "mehmet.ozturk@example.com",
    joinDate: "2024-06-11",
    status: "Banned",
  },
  {
    id: 4,
    name: "Fatma Kaya",
    email: "fatma.kaya@example.com",
    joinDate: "2024-06-11",
    status: "Active",
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

// Reusable Components

type SidebarLinkProps = {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
};

const SidebarLink = ({ icon, text, active, alert }: SidebarLinkProps) => (
  <a
    href="#"
    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      active
        ? "bg-teal-500 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`}
  >
    {icon}
    <span className="ml-3">{text}</span>
    {alert && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>}
  </a>
);

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number;
  change: number;
};

const StatCard = ({ icon, title, value, change }: StatCardProps) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <div className="flex items-center">
      <div className="bg-gray-700 p-3 rounded-full">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div
        className={`ml-auto flex items-center text-sm font-semibold ${
          change >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {change >= 0 ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownRight className="h-4 w-4" />
        )}
        <span>{Math.abs(change)}%</span>
      </div>
    </div>
  </div>
);

// Main Components

const Sidebar = () => (
  <aside className="w-64 flex-shrink-0 bg-gray-900 p-4 flex flex-col">
    <div className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
      <Server className="text-teal-400" />
      <span>Admin Paneli</span>
    </div>
    <nav className="space-y-2">
      <SidebarLink
        icon={<LayoutDashboard size={20} />}
        text="Dashboard"
        active
      />
      <SidebarLink icon={<Users size={20} />} text="Kullanıcı Yönetimi" />
      <SidebarLink
        icon={<Building size={20} />}
        text="Topluluk Yönetimi"
        alert
      />
      <SidebarLink icon={<Calendar size={20} />} text="Etkinlik Yönetimi" />
      <SidebarLink icon={<Shield size={20} />} text="Rol ve Yetkiler" />
    </nav>
    <div className="mt-auto">
      <SidebarLink icon={<Activity size={20} />} text="Platform Raporları" />
    </div>
  </aside>
);

const Header = () => (
  <header className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-700">
    <div className="relative w-full max-w-md">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        placeholder="Search users, communities..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
    <div className="flex items-center gap-4">
      <button className="relative text-gray-400 hover:text-white">
        <Bell size={22} />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div className="flex items-center gap-2">
        <img
          src="https://via.placeholder.com/40"
          alt="Admin"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-white">Admin User</p>
          <p className="text-xs text-gray-400">Yönetici</p>
        </div>
        <ChevronDown size={20} className="text-gray-400" />
      </div>
    </div>
  </header>
);

const DashboardPage = () => {
  type Stats = typeof mockStats;
  type User = (typeof mockRecentUsers)[number];
  type Community = (typeof mockRecentCommunities)[number];

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentCommunities, setRecentCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setStats(mockStats);
      setRecentUsers(mockRecentUsers);
      setRecentCommunities(mockRecentCommunities);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-16 w-16 animate-spin text-teal-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats && (
          <>
            <StatCard
              icon={<Users2 size={24} className="text-blue-400" />}
              title="Toplam Kullanıcı"
              value={stats.totalUsers.value}
              change={stats.totalUsers.change}
            />
            <StatCard
              icon={<Building size={24} className="text-purple-400" />}
              title="Toplam Topluluk"
              value={stats.totalCommunities.value}
              change={stats.totalCommunities.change}
            />
            <StatCard
              icon={<Bell size={24} className="text-yellow-400" />}
              title="Onay Bekleyenler"
              value={stats.pendingApplications.value}
              change={stats.pendingApplications.change}
            />
            <StatCard
              icon={<Calendar size={24} className="text-red-400" />}
              title="Aktif Etkinlikler"
              value={stats.activeEvents.value}
              change={stats.activeEvents.change}
            />
          </>
        )}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Yeni Kayıtlar
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    İsim
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {user.name}
                    </td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === "Active"
                            ? "bg-green-900 text-green-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Communities */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Yeni Topluluklar
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Topluluk Adı
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Üye Sayısı
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Yönet
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentCommunities.map((community) => (
                  <tr
                    key={community.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {community.name}
                    </td>
                    <td className="px-4 py-3">{community.members}</td>
                    <td className="px-4 py-3">
                      <a
                        href="#"
                        className="font-medium text-teal-400 hover:underline"
                      >
                        Manage
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6 lg:p-8">
        {children}
      </main>
    </div>
  </div>
);

// Main App Component - This would be your page file in Next.js
export default function App() {
  // In a real Next.js app, the routing would handle which page to display.
  // Here, we're just rendering the Dashboard inside the layout.
  return (
    <AdminLayout>
      <DashboardPage />
    </AdminLayout>
  );
}
