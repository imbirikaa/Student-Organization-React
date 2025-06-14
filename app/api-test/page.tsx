"use client";

import { useState } from "react";

export default function APITestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const getCookieValue = (name: string): string => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift()!;
    return "";
  };

  const testMeEndpoint = async () => {
    try {
      setLoading(true);

      // Get CSRF cookie first
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const response = await fetch("http://localhost:8000/api/me", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookieValue("XSRF-TOKEN") || "",
        },
      });

      const data = await response.json();
      setResults((prev) => ({
        ...prev,
        me: { status: response.status, data },
      }));
    } catch (error) {
      setResults((prev) => ({ ...prev, me: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const testAdminStats = async () => {
    try {
      setLoading(true);

      // Get CSRF cookie first
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const response = await fetch("http://localhost:8000/api/admin/stats", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookieValue("XSRF-TOKEN") || "",
        },
      });

      const data = await response.json();
      setResults((prev) => ({
        ...prev,
        adminStats: { status: response.status, data },
      }));
    } catch (error) {
      setResults((prev) => ({ ...prev, adminStats: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>

        <div className="space-y-4 mb-8">
          <button
            onClick={testMeEndpoint}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test /me Endpoint
          </button>

          <button
            onClick={testAdminStats}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
          >
            Test Admin Stats
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Results:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
