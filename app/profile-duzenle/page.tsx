"use client";

import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import universitiesData from "./universities.js";

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
  });
  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(form.university_id);
  const [selectedDepartment, setSelectedDepartment] = useState(form.department_id);

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
      const payload = { ...form };
      if (
        !payload.profile_picture ||
        payload.profile_picture === user.profile_picture ||
        payload.profile_picture === user.avatar
      ) {
        payload.profile_picture = undefined;
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

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Profili Düzenle
      </h1>
      {/* Profile image upload and preview */}
      <div className="col-span-2 flex flex-col md:flex-row items-center gap-6 mb-4">
        <div className="flex flex-col items-center w-full md:w-auto">
          <Image
            src={form.profile_picture || "/placeholder.svg?height=40&width=40"}
            alt="Profil Fotoğrafı"
            width={128}
            height={128}
            className="rounded-full border-4 border-teal-500 object-cover"
          />
          <span className="text-xs text-gray-500 mt-2">
            Profil fotoğrafı yükleyin (isteğe bağlı)
          </span>
        </div>
        <div className="flex flex-col justify-center w-full md:w-auto">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Profil Fotoğrafı
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
        </div>
      </div>
      {/* Profile info form */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl"
        onSubmit={handleSave}
      >
        {/* Kullanıcı Adı */}
        <div className="col-span-1">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        {/* Email */}
        <div className="col-span-1">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        {/* İsim */}
        <div className="col-span-1">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            İsim
          </label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        {/* Soyisim */}
        <div className="col-span-1">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Soyisim
          </label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        {/* Telefon */}
        <div className="col-span-1">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Telefon
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        {/* Hakkımda */}
        <div className="col-span-2">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Hakkımda
          </label>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[80px]"
            maxLength={500}
          />
        </div>
        {/* University Dropdown */}
        <div className="col-span-1">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Üniversite
          </label>
          <select
            name="university_id"
            value={selectedUniversity}
            onChange={(e) => {
              setSelectedUniversity(e.target.value);
              setSelectedDepartment("");
              setForm(f => ({ ...f, university_id: e.target.value, department_id: "" }));
            }}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Üniversite seçin</option>
            {universitiesData.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        {/* Department Dropdown */}
        <div className="col-span-1">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Bölüm
          </label>
          <select
            name="department_id"
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setForm(f => ({ ...f, department_id: e.target.value }));
            }}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={!selectedUniversity}
          >
            <option value="">Bölüm seçin</option>
            {universitiesData.find(u => String(u.id) === String(selectedUniversity))?.programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        {/* Error and Success Messages */}
        {error && (
          <div className="col-span-2 text-red-600 font-semibold">{error}</div>
        )}
        {success && (
          <div className="col-span-2 text-green-600 font-semibold">
            {success}
          </div>
        )}
        {/* Save/Cancel Buttons */}
        <div className="col-span-2 flex gap-4 mt-2 justify-end">
          <Button
            type="submit"
            className="px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors font-bold text-lg shadow-lg disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/myprofile")}
            className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors font-bold text-lg shadow-lg"
            disabled={saving}
          >
            İptal
          </Button>
        </div>
      </form>
      {/* Password change section */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
        onSubmit={handlePasswordChange}
      >
        <div className="col-span-2 text-lg font-bold text-gray-900 dark:text-white mb-2">
          Şifre Değiştir
        </div>
        {/* Current Password */}
        <div className="col-span-1">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Mevcut Şifre
          </label>
          <input
            type="password"
            name="current_password"
            value={passwords.current_password}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, current_password: e.target.value }))
            }
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div className="col-span-1"></div>
        {/* New Password */}
        <div className="col-span-1">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Yeni Şifre
          </label>
          <input
            type="password"
            name="new_password"
            value={passwords.new_password}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, new_password: e.target.value }))
            }
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        {/* Confirm New Password */}
        <div className="col-span-1">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Yeni Şifre (Tekrar)
          </label>
          <input
            type="password"
            name="new_password_confirmation"
            value={passwords.new_password_confirmation}
            onChange={(e) =>
              setPasswords((p) => ({
                ...p,
                new_password_confirmation: e.target.value,
              }))
            }
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        {/* Password Error/Success */}
        {passwordError && (
          <div className="col-span-2 text-red-600 font-semibold">
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div className="col-span-2 text-green-600 font-semibold">
            {passwordSuccess}
          </div>
        )}
        {/* Password Save Button */}
        <div className="col-span-2 flex gap-4 mt-2 justify-end">
          <Button
            type="submit"
            className="px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors font-bold text-lg shadow-lg"
          >
            Şifreyi Güncelle
          </Button>
        </div>
      </form>
    </div>
  );
}
