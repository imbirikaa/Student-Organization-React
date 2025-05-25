'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, Trash, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react";

interface User {
  id: number
  nickname: string
  created_at: string
}

interface PaginatedResponse {
  current_page: number
  data: User[]
  last_page: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  useEffect(() => {
    fetch(`http://localhost:8000/api/users?page=${page}`)
      .then(res => res.json() as Promise<PaginatedResponse>)
      .then(data => {
        setUsers(data.data);
        setLoading(false);
        setLastPage(data.last_page);
      });
  }, [page]);

  if (loading) return <p>Loading…</p>;
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Aramak istediğiniz kelimeyi yazın..."
          className="h-12 w-full rounded-full bg-gray-900 pl-12 pr-4 text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
      </div>
      <div className="min-h-screen flex flex-col justify-between container mx-auto px-4 py-8">
        {/* Users table */}
        <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">NICKNAME</th>
                <th className="px-4 py-3 text-left font-medium">ÜYE OLMA TARİHİ</th>
                <th className="px-4 py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 last:border-0">
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3">{user.nickname}</td>
                  <td className="px-4 py-3">{user.created_at.split('T')[0]}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/user/${user.id}`} className="text-green-600 hover:text-green-500 hover:bg-green-600/10">
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="self-center mt-4 bg-gray-900 p-3 rounded-full shadow-md flex items-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-800 text-white rounded-full disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-white text-sm">
              Page {page} / {lastPage}
            </span>
            <button
              onClick={() => setPage(p => Math.min(lastPage, p + 1))}
              disabled={page === lastPage}
              className="px-4 py-2 bg-gray-800 text-white rounded-full disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
