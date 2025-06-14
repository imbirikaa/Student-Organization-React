"use client";

import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  School,
  BookOpen,
  Shield,
  UserCircle,
  Settings,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error-state";
import universitiesData from "./universities.js";
import Link from "next/link";

export default function ProfileDuzenle() {
  // Auth context and router
  const { user, setUser, loading } = useAuth();
  const router = useRouter();

  // Profile form state
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    about: "",
    profile_picture: "",
    university_id: "",
    department_id: "",
  });
  // Password change state
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  }); // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(
    form.university_id
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    form.department_id
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Populate form with user data on mount or user change
  useEffect(() => {
    if (user) {
      setForm({
        nickname: user.nickname || "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        about: user.about || "",
        profile_picture: user.profile_picture || user.avatar || "",
        university_id: user.university_id || "",
        department_id: user.department_id || "",
      });
    }
  }, [user]);

  // Redirect to login if not authenticated
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }
  if (!user) {
    router.replace("/login");
    return null;
  }

  // Handle input changes for profile fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle profile save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // Only send profile_picture if changed
      const payload: any = { ...form };
      if (
        !payload.profile_picture ||
        payload.profile_picture === user?.profile_picture ||
        payload.profile_picture === user?.avatar
      ) {
        delete payload.profile_picture;
      }
      const res = await fetch("http://localhost:8000/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Bir hata oluştu.");
      } else {
        const data = await res.json();
        setUser(data.user);
        setSuccess("Profil başarıyla güncellendi.");
        setTimeout(() => router.push("/myprofile"), 1200);
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    try {
      const res = await fetch("http://localhost:8000/api/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(passwords),
      });
      if (!res.ok) {
        const data = await res.json();
        setPasswordError(data.message || "Şifre güncellenemedi.");
      } else {
        setPasswordSuccess("Şifre başarıyla güncellendi.");
        setPasswords({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      }
    } catch {
      setPasswordError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };
  // Handle profile picture upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          profile_picture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/myprofile">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 hover:border-teal-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
            Profil Düzenle
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <Button
            onClick={() => setActiveTab("profile")}
            variant={activeTab === "profile" ? "default" : "outline"}
            className={`${
              activeTab === "profile"
                ? "bg-gradient-to-r from-teal-500 to-purple-500"
                : "border-gray-600 hover:border-teal-500"
            } rounded-xl`}
          >
            <UserCircle className="h-4 w-4 mr-2" />
            Profil Bilgileri
          </Button>
          <Button
            onClick={() => setActiveTab("password")}
            variant={activeTab === "password" ? "default" : "outline"}
            className={`${
              activeTab === "password"
                ? "bg-gradient-to-r from-teal-500 to-purple-500"
                : "border-gray-600 hover:border-teal-500"
            } rounded-xl`}
          >
            <Shield className="h-4 w-4 mr-2" />
            Şifre Değiştir
          </Button>
        </div>

        {activeTab === "profile" && (
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 p-1">
                    <Image
                      src={
                        form.profile_picture ||
                        user.avatar ||
                        "/placeholder.svg?height=120&width=120"
                      }
                      alt="Profil Fotoğrafı"
                      width={120}
                      height={120}
                      className="rounded-full w-full h-full object-cover bg-gray-900"
                    />
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-teal-500 hover:bg-teal-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                    <Camera className="h-5 w-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-400 mt-3 text-center">
                  Profil fotoğrafını değiştirmek için kameraya tıklayın
                </p>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  Kişisel Bilgiler
                </h2>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Kullanıcı Adı
                      </label>
                      <input
                        type="text"
                        name="nickname"
                        value={form.nickname}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        E-posta
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Ad
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Soyad
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Telefon
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Hakkımda
                    </label>
                    <textarea
                      name="about"
                      value={form.about}
                      onChange={handleChange}
                      placeholder="Kendiniz hakkında birkaç kelime yazın..."
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors min-h-[100px] resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {form.about.length}/500 karakter
                    </p>
                  </div>

                  {/* University Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
                        <School className="h-4 w-4 text-white" />
                      </div>
                      Eğitim Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          Üniversite
                        </label>
                        <select
                          name="university_id"
                          value={selectedUniversity}
                          onChange={(e) => {
                            setSelectedUniversity(e.target.value);
                            setSelectedDepartment("");
                            setForm((f) => ({
                              ...f,
                              university_id: e.target.value,
                              department_id: "",
                            }));
                          }}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-teal-500 transition-colors"
                        >
                          <option value="">Üniversite seçin</option>
                          {universitiesData.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          Bölüm
                        </label>
                        <select
                          name="department_id"
                          value={selectedDepartment}
                          onChange={(e) => {
                            setSelectedDepartment(e.target.value);
                            setForm((f) => ({
                              ...f,
                              department_id: e.target.value,
                            }));
                          }}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50"
                          disabled={!selectedUniversity}
                        >
                          <option value="">Bölüm seçin</option>
                          {universitiesData
                            .find(
                              (u) => String(u.id) === String(selectedUniversity)
                            )
                            ?.programs.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                      {success}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-xl px-8 py-3 flex-1"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Değişiklikleri Kaydet
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push("/myprofile")}
                      variant="outline"
                      disabled={saving}
                      className="border-gray-600 hover:border-red-500 text-red-400 hover:text-red-300 rounded-xl px-8 py-3"
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mr-3">
                <Lock className="h-4 w-4 text-white" />
              </div>
              Şifre Değiştir
            </h2>

            <form
              onSubmit={handlePasswordChange}
              className="space-y-6 max-w-2xl"
            >
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Mevcut Şifre
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="current_password"
                    value={passwords.current_password}
                    onChange={(e) =>
                      setPasswords((p) => ({
                        ...p,
                        current_password: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="new_password"
                      value={passwords.new_password}
                      onChange={(e) =>
                        setPasswords((p) => ({
                          ...p,
                          new_password: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Yeni Şifre (Tekrar)
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="new_password_confirmation"
                      value={passwords.new_password_confirmation}
                      onChange={(e) =>
                        setPasswords((p) => ({
                          ...p,
                          new_password_confirmation: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h4 className="text-blue-400 font-medium mb-2">
                  Şifre Gereksinimleri:
                </h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• En az 8 karakter olmalı</li>
                  <li>• En az bir büyük harf içermeli</li>
                  <li>• En az bir küçük harf içermeli</li>
                  <li>• En az bir rakam içermeli</li>
                </ul>
              </div>

              {/* Status Messages */}
              {passwordError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                  {passwordSuccess}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl px-8 py-3"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Şifreyi Güncelle
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
