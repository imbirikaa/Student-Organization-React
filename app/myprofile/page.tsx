"use client";

import { useAuth } from "@/app/context/auth-context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, FileText, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyProfile() {
  const { user, roles, loading, setUser } = useAuth();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    nickname: user?.nickname || "",
    email: user?.email || "",
    about: user?.about || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: user.name || "",
      nickname: user.nickname || "",
      email: user.email || "",
      about: user.about || "",
    });
    setError("");
    setSuccess("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:8000/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Bir hata oluştu.");
      } else {
        const data = await res.json();
        setUser(data.user);
        setSuccess("Profil başarıyla güncellendi.");
        setEditMode(false);
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Cover image */}
      <div className="relative h-64 w-full">
        <Image
          src="/images/bg.png"
          alt="Cover image"
          fill
          className="object-cover"
        />
      </div>
      <div className="container mx-auto px-4">
        <div className="relative -mt-16 mb-8">
          <div className="flex mt-5 flex-col md:flex-row gap-6 items-start">
            <div className="relative z-10">
              <Image
                src={user.avatar || "/placeholder-logo.png"}
                alt="Profil Fotoğrafı"
                width={120}
                height={120}
                className="rounded-full border-4 border-gray-900"
              />
            </div>
            <div className="flex-1 mt-4 md:mt-16">
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="text-2xl font-bold mb-1 bg-gray-900 text-white rounded px-2 py-1 w-full"
                />
              ) : (
                <h1 className="text-2xl font-bold mb-1">
                  {user.name || user.nickname}
                </h1>
              )}
              <p className="text-gray-400 text-sm mb-4">@{user.nickname}</p>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-teal-500 font-bold text-xl">
                    {user.community_count || 0}
                  </div>
                  <div className="text-xs text-gray-400">Topluluğa Üye</div>
                </div>
                <div>
                  <div className="text-teal-500 font-bold text-xl">
                    {user.friend_count || 0}
                  </div>
                  <div className="text-xs text-gray-400">Arkadaş</div>
                </div>
                <div>
                  <div className="text-teal-500 font-bold text-xl">462</div>
                  <div className="text-xs text-gray-400">Konu Açtı</div>
                </div>
                <div>
                  <div className="text-teal-500 font-bold text-xl">
                    {user.event_count || 0}
                  </div>
                  <div className="text-xs text-gray-400">Etkinliğe Katıldı</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-16">
              {editMode ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-full bg-teal-600 text-white"
                  >
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="rounded-full"
                  >
                    İptal
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEdit}
                  className="rounded-full bg-teal-600 text-white"
                >
                  Profili Düzenle
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* Navigation tabs */}
        <div className="border-b border-gray-800 mb-8">
          <div className="flex overflow-x-auto">
            <span className="px-6 py-3 text-teal-500 border-b-2 border-teal-500 font-medium cursor-pointer">
              Panel
            </span>
            <span className="px-6 py-3 text-gray-400 hover:text-gray-300 cursor-pointer">
              Konular
            </span>
            <span className="px-6 py-3 text-gray-400 hover:text-gray-300 cursor-pointer">
              Topluluklar
            </span>
            <span className="px-6 py-3 text-gray-400 hover:text-gray-300 cursor-pointer">
              Sertifikalar
            </span>
            <span className="px-6 py-3 text-gray-400 hover:text-gray-300 cursor-pointer">
              Etkinlikler
            </span>
            <span className="px-6 py-3 text-gray-400 hover:text-gray-300 cursor-pointer">
              Arkadaşlar
            </span>
          </div>
        </div>
        {/* Profile content */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* About me */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-teal-500 mr-2" />
              <h2 className="text-lg font-medium">Hakkımda</h2>
            </div>
            {editMode ? (
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded p-2 min-h-[80px]"
                maxLength={500}
              />
            ) : (
              <p className="text-gray-400 text-sm">
                {user.about || "Henüz bir hakkımda yazısı bulunmuyor."}
              </p>
            )}
          </div>
          {/* Private profile */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Lock className="h-5 w-5 text-teal-500 mr-2" />
              <h2 className="text-lg font-medium">Gizli Profil</h2>
            </div>
            <p className="text-gray-400 text-sm">
              Profil bilgilerinizin bir kısmı gizli tutulur.
            </p>
          </div>
          {/* Activities */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-teal-500 mr-2" />
                <h2 className="text-lg font-medium">Etkinlikler</h2>
              </div>
              <span className="text-xs text-gray-400">Son 3 Etkinlik</span>
            </div>
            {[1, 2].map((activity) => (
              <div
                key={activity}
                className="mb-4 border-b border-gray-800 pb-4 last:border-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">deneme etkinliği</span>
                </div>
                <p className="text-xs text-gray-400 pl-10">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s.
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Topics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-teal-500">
            <FileText className="h-6 w-6 mr-2" />
            Konularım
          </h2>
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((topic) => (
              <div key={topic} className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Sklerozan Kolanjit Ders Notları PDF
                    </h3>
                    <p className="text-xs text-gray-400">2024-09-25 22:31:10</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        {success && (
          <div className="text-green-600 font-semibold">{success}</div>
        )}
      </div>
    </div>
  );
}
