"use client";

import { Button } from "@/components/ui/button";
import {
  Crown,
  Shield,
  User,
  Mail,
  Phone,
  ChevronDown,
  UserPlus,
  ArrowLeft,
  Check,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import RequireRole from "@/components/RequireRole";

interface FormData {
  role: string;
  nickname: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const roles = [
  { value: "admin", label: "Sistem Yöneticisi", icon: Crown },
  { value: "moderator", label: "Moderatör", icon: Shield },
  { value: "community_admin", label: "Topluluk Yöneticisi", icon: User },
];

export default function AddAdminPage() {
  const [formData, setFormData] = useState<FormData>({
    role: "",
    nickname: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/add-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "Yönetici başarıyla eklendi!" });
        setFormData({
          role: "",
          nickname: "",
          email: "",
          firstName: "",
          lastName: "",
          phone: "",
        });
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.message || "Yönetici eklenirken bir hata oluştu.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Sunucu hatası oluştu." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedRole = roles.find((role) => role.value === formData.role);

  return (
    <RequireRole role="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin"
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm border border-gray-700/50"
            >
              <ArrowLeft className="h-5 w-5 text-gray-300" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <UserPlus className="h-8 w-8 text-teal-400" />
                Yönetici Ekle
              </h1>
              <p className="text-gray-400 mt-1">
                Sisteme yeni yönetici kullanıcı ekleyin
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Form Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
              {message && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                    message.type === "success"
                      ? "bg-emerald-900/20 border border-emerald-500/30 text-emerald-300"
                      : "bg-red-900/20 border border-red-500/30 text-red-300"
                  }`}
                >
                  {message.type === "success" ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Yönetici Unvanı *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      className="w-full appearance-none bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300 pr-10"
                      required
                    >
                      <option value="">Unvan seçiniz</option>
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  {selectedRole && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-teal-400">
                      <selectedRole.icon className="h-4 w-4" />
                      {selectedRole.label}
                    </div>
                  )}
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Kullanıcı Adı *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.nickname}
                        onChange={(e) =>
                          handleInputChange("nickname", e.target.value)
                        }
                        className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl pl-11 pr-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300"
                        placeholder="Kullanıcı adı"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      E-posta *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl pl-11 pr-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300"
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ad *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300"
                      placeholder="Ad"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Soyad *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300"
                      placeholder="Soyad"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl pl-11 pr-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300"
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.role ||
                    !formData.nickname ||
                    !formData.email ||
                    !formData.firstName ||
                    !formData.lastName
                  }
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Ekleniyor...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Yönetici Ekle
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                <div className="flex items-start gap-3 text-blue-300 text-sm">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Önemli Bilgi</p>
                    <p>
                      Yeni eklenen yönetici, ilk giriş için geçici bir şifre
                      alacaktır. Şifre değiştirme linkini e-posta adresine
                      göndereceğiz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
