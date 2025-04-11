import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, Trash, ArrowRight  } from "lucide-react"

export default function UsersPage() {
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

      {/* Users table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden mb-8">
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
            {[
              { id: 1, name: "Ahmet", date: "12-05-2025 22:01" },
              { id: 2, name: "Mohammed", date: "12-05-2025 22:01" },
              { id: 3, name: "Lara", date: "12-05-2025 22:01" },
              { id: 4, name: "Khaled", date: "12-05-2025 22:01" },
              { id: 5, name: "Yusuf", date: "12-05-2025 22:01" },
              { id: 6, name: "bader", date: "12-05-2025 22:01" },
              { id: 7, name: "Khaled", date: "12-05-2025 22:01" },
              { id: 8, name: "Ahmet", date: "12-05-2025 22:01" },
              { id: 9, name: "Mohammed", date: "12-05-2025 22:01" },
              { id: 10, name: "Mehmet", date: "12-05-2025 22:01" },
              { id: 11, name: "Sara", date: "12-05-2025 22:01" },
              { id: 12, name: "lubna", date: "12-05-2025 22:01" },
              { id: 13, name: "Ahmet", date: "12-05-2025 22:01" },
            ].map((user) => (
              <tr key={user.id} className="border-b border-gray-800 last:border-0">
                <td className="px-4 py-3">{user.id}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.date}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/user/${user}`} variant="ghost" size="icon" className="text-green-600 hover:text-green-500 hover:bg-green-600/10">
                      <ArrowRight className="h-5 w-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
