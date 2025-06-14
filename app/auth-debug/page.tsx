"use client";

import { useAuth } from "@/app/context/auth-context";

export default function AuthDebugPage() {
  const { user, roles, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Loading State:</h2>
            <p
              className={`text-sm ${
                loading ? "text-orange-600" : "text-green-600"
              }`}
            >
              {loading ? "Loading..." : "Loaded"}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">User:</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {user ? JSON.stringify(user, null, 2) : "No user logged in"}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Roles:</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify(roles, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Admin Access:</h2>
            <p
              className={`text-sm font-medium ${
                roles.includes("admin") ? "text-green-600" : "text-red-600"
              }`}
            >
              {roles.includes("admin")
                ? "✅ Has Admin Role"
                : "❌ No Admin Role"}
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <h2 className="text-lg font-semibold">Quick Actions:</h2>
            <div className="flex gap-2">
              <a
                href="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login
              </a>
              <a
                href="/admin"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Admin Page
              </a>
              <a
                href="/"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
