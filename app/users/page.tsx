"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Search,
  Trash,
  ArrowRight,
  User,
  Mail,
  Calendar,
  Shield,
  Filter,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import { LoadingSpinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error-state";

interface User {
  id: number;
  nickname: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  status?: string;
  role?: string;
}

interface PaginatedResponse {
  current_page: number;
  data: User[];
  last_page: number;
  total: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:8000/api/users?page=${page}`
      );
      if (!response.ok) throw new Error("Kullanıcılar yüklenemedi");

      const data: PaginatedResponse = await response.json();
      setUsers(data.data);
      setLastPage(data.last_page);
      setTotalUsers(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/users/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
        setTotalUsers(totalUsers - 1);
      }
    } catch (error) {
      console.error("Kullanıcı silinemedi:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <RequireRole role="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Kullanıcı Yönetimi
            </h1>
            <p className="text-gray-400 text-lg">
              Toplam {totalUsers} kullanıcıyı yönetin
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-teal-400 mb-1">
                {totalUsers}
              </div>
              <div className="text-gray-400">Toplam Kullanıcı</div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-400 mb-1">
                {users.filter((u) => u.status === "active").length}
              </div>
              <div className="text-gray-400">Aktif</div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-amber-400 mb-1">
                {users.filter((u) => u.role === "admin").length}
              </div>
              <div className="text-gray-400">Admin</div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {
                  users.filter((u) => {
                    const createdDate = new Date(u.created_at);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return createdDate > thirtyDaysAgo;
                  }).length
                }
              </div>
              <div className="text-gray-400">Bu Ay</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Kullanıcı ara (isim, email, kullanıcı adı)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl pl-10 pr-8 py-3 text-gray-300 focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="">Tüm Roller</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderatör</option>
                  <option value="user">Kullanıcı</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                      Kullanıcı
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                      E-posta
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                      Rol
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                      Kayıt Tarihi
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                      Durum
                    </th>
                    <th className="text-right py-4 px-6 text-gray-300 font-semibold">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors ${
                        index % 2 === 0 ? "bg-gray-800/10" : ""
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-200">
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.nickname}
                            </div>
                            <div className="text-sm text-gray-400">
                              @{user.nickname}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {user.email || "Belirtilmemiş"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : user.role === "moderator"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                          }`}
                        >
                          <Shield className="h-3 w-3" />
                          {user.role === "admin"
                            ? "Admin"
                            : user.role === "moderator"
                            ? "Moderatör"
                            : "Kullanıcı"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(user.created_at).toLocaleDateString(
                            "tr-TR"
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {user.status === "active" ? (
                            <UserCheck className="h-3 w-3" />
                          ) : (
                            <UserX className="h-3 w-3" />
                          )}
                          {user.status === "active" ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/user/${user.nickname}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 hover:border-teal-500"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(user.id)}
                            className="border-gray-600 hover:border-red-500 text-red-400"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 hover:border-gray-500"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="flex items-center justify-between p-6 border-t border-gray-700">
                <div className="text-gray-400 text-sm">
                  Sayfa {page} / {lastPage} ({filteredUsers.length} kullanıcı)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="border-gray-600 hover:border-teal-500 disabled:opacity-50"
                  >
                    Önceki
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(lastPage, page + 1))}
                    disabled={page === lastPage}
                    className="border-gray-600 hover:border-teal-500 disabled:opacity-50"
                  >
                    Sonraki
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
