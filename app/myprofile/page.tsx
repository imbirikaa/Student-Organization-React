"use client";

import { useAuth } from "@/app/context/auth-context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  User,
  Mail,
  FileText,
  Lock,
  Clock,
  Edit3,
  Save,
  X,
  Camera,
  Calendar,
  MapPin,
  Phone,
  Star,
  Trophy,
  Users,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import Link from "next/link";

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
    return <LoadingSpinner />;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section with Cover */}
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-purple-500/20 to-blue-500/20"></div>
        <Image
          src="/images/bg.png"
          alt="Cover image"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 p-1">
                  <Image
                    src={user.avatar || "/placeholder-logo.png"}
                    alt="Profil Fotoğrafı"
                    width={120}
                    height={120}
                    className="rounded-full w-full h-full object-cover bg-gray-900"
                  />
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full bg-teal-500 hover:bg-teal-600"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                {editMode ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ad Soyad"
                      className="text-3xl font-bold bg-transparent border-b-2 border-teal-500 text-white placeholder-gray-400 focus:outline-none w-full"
                    />
                    <input
                      type="text"
                      name="nickname"
                      value={form.nickname}
                      onChange={handleChange}
                      placeholder="Kullanıcı Adı"
                      className="text-lg bg-transparent border-b border-gray-600 text-gray-300 placeholder-gray-400 focus:outline-none focus:border-teal-500 w-full"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                      {user.name || user.nickname}
                    </h1>
                    <p className="text-gray-400 text-lg mb-1">
                      @{user.nickname}
                    </p>
                  </>
                )}

                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">Türkiye</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-teal-500/10 to-teal-600/10 border border-teal-500/20">
                    <Users className="h-5 w-5 text-teal-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-teal-400">
                      {user.community_count || 0}
                    </div>
                    <div className="text-xs text-gray-400">Topluluk</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                    <Heart className="h-5 w-5 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-400">
                      {user.friend_count || 0}
                    </div>
                    <div className="text-xs text-gray-400">Arkadaş</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                    <Calendar className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-400">
                      {user.event_count || 0}
                    </div>
                    <div className="text-xs text-gray-400">Etkinlik</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20">
                    <Trophy className="h-5 w-5 text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-amber-400">125</div>
                    <div className="text-xs text-gray-400">Puan</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {editMode ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-xl px-6 py-3"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-gray-600 hover:border-red-500 text-red-400 hover:text-red-300 rounded-xl"
                    >
                      <X className="h-4 w-4 mr-2" />
                      İptal
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleEdit}
                      className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-xl px-6 py-3"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Profili Düzenle
                    </Button>
                    <Link href="/profile-duzenle">
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 hover:border-teal-500 rounded-xl"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Detaylı Düzenle
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
            {success}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <div className="flex overflow-x-auto">
            {[
              { name: "Panel", icon: User, active: true },
              { name: "Konular", icon: FileText },
              { name: "Topluluklar", icon: Users },
              { name: "Sertifikalar", icon: Trophy },
              { name: "Etkinlikler", icon: Calendar },
              { name: "Arkadaşlar", icon: Heart },
            ].map((tab) => (
              <span
                key={tab.name}
                className={`flex items-center gap-2 px-6 py-3 cursor-pointer transition-colors ${
                  tab.active
                    ? "text-teal-400 border-b-2 border-teal-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </span>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* About Section */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Hakkımda</h2>
            </div>
            {editMode ? (
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                placeholder="Kendiniz hakkında birkaç kelime..."
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 min-h-[100px] resize-none"
                maxLength={500}
              />
            ) : (
              <p className="text-gray-300 leading-relaxed">
                {user.about || "Henüz bir hakkımda yazısı bulunmuyor."}
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Hesap Bilgileri</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
                <Mail className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">E-posta</p>
                  <p className="text-gray-200">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
                <Calendar className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Üyelik</p>
                  <p className="text-gray-200">2 yıl önce</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
                <Trophy className="h-4 w-4 text-amber-400" />
                <div>
                  <p className="text-sm text-gray-400">Rol</p>
                  <p className="text-gray-200">{roles?.join(", ") || "Üye"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Son Aktiviteler</h2>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "React Workshop'a katıldı",
                  time: "2 saat önce",
                  type: "event",
                },
                { title: "Yeni konu açtı", time: "1 gün önce", type: "post" },
                {
                  title: "Profil güncellendi",
                  time: "3 gün önce",
                  type: "profile",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.type === "event"
                        ? "bg-teal-400"
                        : activity.type === "post"
                        ? "bg-purple-400"
                        : "bg-blue-400"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-200">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Topics */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold">Son Konularım</h2>
            </div>
            <Button
              variant="outline"
              className="border-gray-600 hover:border-teal-500"
            >
              Tümünü Gör
            </Button>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: "React Best Practices Nelerdir?",
                date: "2024-01-15",
                replies: 15,
                views: 142,
              },
              {
                title: "TypeScript ile API Tasarımı",
                date: "2024-01-12",
                replies: 8,
                views: 89,
              },
              {
                title: "Next.js 14 Yeni Özellikleri",
                date: "2024-01-08",
                replies: 23,
                views: 267,
              },
            ].map((topic, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors border border-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-200 mb-2">
                      {topic.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {topic.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {topic.replies} yanıt
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {topic.views} görüntülenme
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 hover:border-teal-500"
                  >
                    Görüntüle
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
