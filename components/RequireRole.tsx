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

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, router, loading]);

  if (loading) {
    return null;
  }

  if (!user) {
    // Optionally, you can return null or a spinner here
    return null;
  }

  if (!roles.includes(role)) {
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
            strokeWidth="2"
            d="M15 9l-6 6m0-6l6 6"
          />
        </svg>
        <span className="text-3xl font-extrabold text-red-600">
          Yetkisiz Erişim
        </span>
        <span className="text-lg text-gray-700 dark:text-gray-300">
          Bu sayfayı görüntülemek için gerekli izniniz yok.
        </span>
        <button
          onClick={() => router.push("/")}
          className="mt-2 px-8 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors font-bold text-lg shadow-lg"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
