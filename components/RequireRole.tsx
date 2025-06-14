"use client";

import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RequireRoleProps {
  role: string;
  children: React.ReactNode;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const { user, roles, loading } = useAuth();
  const router = useRouter();
  // Removed automatic redirect - let user see access denied message

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user || !roles.includes(role)) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-center gap-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl mx-auto max-w-xl p-12">
        <svg
          className="h-24 w-24 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-30"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Erişim Reddedildi
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Bu sayfaya erişmek için{" "}
            <span className="font-semibold text-red-500">{role}</span> yetkisine
            sahip olmanız gerekiyor.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
