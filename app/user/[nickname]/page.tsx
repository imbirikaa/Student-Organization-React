"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  FileText,
  Lock,
  Clock,
  MessageCircle,
  UserPlus,
  UserMinus,
  Trophy,
  Users,
  Calendar,
  Star,
  Heart,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error-state";

interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  nickname: string;
  email: string;
  about?: string;
  profile_picture?: string;
  friend_count: number;
  community_count: number;
  event_count: number;
  is_friend: boolean;
}

export default function UserProfilePage() {
  const { nickname } = useParams();
  const [user, setUser] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!nickname) return;

    setLoading(true);
    fetch(`http://localhost:8000/api/users/${nickname}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kullanıcı bulunamadı");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [nickname]);

  const handleFriendAction = async () => {
    if (!user || isProcessing) return;

    setIsProcessing(true);
    try {
      const endpoint = user.is_friend ? "unfriend" : "friend";
      const response = await fetch(
        `http://localhost:8000/api/users/${user.id}/${endpoint}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                is_friend: !prev.is_friend,
                friend_count: prev.is_friend
                  ? prev.friend_count - 1
                  : prev.friend_count + 1,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Friend action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (!user) return <ErrorState message="Kullanıcı bulunamadı" />;

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
                    src={
                      user.profile_picture ||
                      "/placeholder.svg?height=120&width=120"
                    }
                    alt="Profile picture"
                    width={120}
                    height={120}
                    className="rounded-full w-full h-full object-cover bg-gray-900"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-gray-900 rounded-full"></div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-gray-400 text-lg mb-1">@{user.nickname}</p>
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">Türkiye</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-teal-500/10 to-teal-600/10 border border-teal-500/20">
                    <Users className="h-5 w-5 text-teal-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-teal-400">
                      {user.community_count}
                    </div>
                    <div className="text-xs text-gray-400">Topluluk</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                    <Heart className="h-5 w-5 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-400">
                      {user.friend_count}
                    </div>
                    <div className="text-xs text-gray-400">Arkadaş</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                    <Calendar className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-400">
                      {user.event_count}
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
                <Button
                  onClick={handleFriendAction}
                  disabled={isProcessing}
                  className={`${
                    user.is_friend
                      ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                      : "bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600"
                  } border rounded-xl px-6 py-3 transition-all duration-300`}
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : user.is_friend ? (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Arkadaşlıktan Çıkar
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Arkadaş Ekle
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 hover:border-teal-500 rounded-xl"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Mesaj Gönder
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <div className="flex overflow-x-auto">
            {[
              { name: "Panel", icon: User, active: true },
              { name: "Etkinlikler", icon: Calendar },
              { name: "Topluluklar", icon: Users },
              { name: "Sertifikalar", icon: Trophy },
              { name: "Arkadaşlar", icon: Heart },
            ].map((tab) => (
              <Link
                key={tab.name}
                href="#"
                className={`flex items-center gap-2 px-6 py-3 transition-colors ${
                  tab.active
                    ? "text-teal-400 border-b-2 border-teal-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </Link>
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
            <p className="text-gray-300 leading-relaxed">
              {user.about || "Henüz bir hakkımda yazısı bulunmuyor."}
            </p>
          </div>

          {/* Recent Activity */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Son Etkinlikler</h2>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: "React Workshop", date: "2 gün önce", color: "teal" },
                {
                  name: "AI Conference",
                  date: "1 hafta önce",
                  color: "purple",
                },
                { name: "Startup Meetup", date: "2 hafta önce", color: "blue" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.color === "teal"
                        ? "bg-teal-400"
                        : activity.color === "purple"
                        ? "bg-purple-400"
                        : "bg-blue-400"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-200">{activity.name}</p>
                    <p className="text-sm text-gray-400">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mr-3">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Başarılar</h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: "Event Organizer",
                  description: "5+ etkinlik düzenledi",
                  icon: "🎯",
                },
                {
                  name: "Community Leader",
                  description: "Topluluk lideri",
                  icon: "👑",
                },
                {
                  name: "Active Member",
                  description: "50+ etkinliğe katıldı",
                  icon: "⭐",
                },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <p className="font-medium text-gray-200">
                      {achievement.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Topics */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold">Son Konular</h2>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: "React Best Practices",
                date: "2 gün önce",
                replies: 15,
              },
              {
                title: "TypeScript Advanced Types",
                date: "1 hafta önce",
                replies: 8,
              },
              {
                title: "Next.js 14 Features",
                date: "2 hafta önce",
                replies: 23,
              },
            ].map((topic, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors border border-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-200 mb-1">
                      {topic.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {topic.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {topic.replies} yanıt
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
