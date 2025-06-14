"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, Info, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Community {
  id: number;
  community: string;
  description: string;
  logo?: string;
  memberships_count: number;
  event_count: number;
  events_count?: number;
  created_at: string;
}

interface Event {
  id: number;
  event: string;
  start_datetime: string;
  location: string;
}

export default function CommunityPage() {
  const { id } = useParams();
  const [community, setCommunity] = useState<Community | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch community details
  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Fetching community data for ID:", id);

        // Fetch community details
        const communityRes = await fetch(
          `http://localhost:8000/api/communities/${id}`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Community response status:", communityRes.status);

        if (!communityRes.ok) {
          const errorData = await communityRes.text();
          console.log("Community error response:", errorData);
          throw new Error(
            `Community not found (${communityRes.status}): ${errorData}`
          );
        }

        const communityData = await communityRes.json();
        console.log("Community data:", communityData);
        setCommunity(communityData);

        // Fetch community events
        const eventsRes = await fetch(
          `http://localhost:8000/api/communities/${id}/events`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          console.log("Events data:", eventsData);
          setEvents(eventsData.data || []);
        } else {
          console.log("Events fetch failed:", eventsRes.status);
        }

        // Fetch community members count (optional - if you have this endpoint)
        try {
          const membersRes = await fetch(
            `http://localhost:8000/api/communities/${id}/members`,
            {
              credentials: "include",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          if (membersRes.ok) {
            const membersData = await membersRes.json();
            console.log("Members data:", membersData);
            // Update community data with actual member count
            setCommunity((prev) =>
              prev
                ? {
                    ...prev,
                    memberships_count:
                      membersData.data?.length ||
                      membersData.total ||
                      prev.memberships_count,
                  }
                : null
            );
          }
        } catch (memberErr) {
          console.log("Members fetch optional, using community data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCommunityData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-red-500 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Hata</h2>
          <p className="mb-4">{error}</p>
          <div className="text-sm text-gray-400 mb-4">
            <p>Community ID: {id}</p>
            <p>Konsol loglarını kontrol edin.</p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Tekrar Dene
          </Button>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Topluluk Bulunamadı</h2>
          <p>Bu topluluk mevcut değil veya erişim izniniz yok.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header with Community Name */}
      <div className="mb-8">
        <nav className="text-sm text-gray-400 mb-2">
          <span>Topluluklar</span> /{" "}
          <span className="text-teal-500">{community.community}</span>
        </nav>
        <h1 className="text-3xl font-bold text-white mb-2">
          {community.community}
        </h1>
        {community.description && (
          <p className="text-gray-400 max-w-2xl">{community.description}</p>
        )}
      </div>

      {/* Community header */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex flex-col items-center">
              <Image
                src={community.logo || "/placeholder.svg?height=120&width=120"}
                alt="Community logo"
                width={120}
                height={120}
                className="rounded-full mb-4"
              />
              <h1 className="text-xl font-bold mb-2 text-center">
                {community.community}
              </h1>

              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-teal-500" />
                <span className="text-sm text-gray-400">
                  {community.memberships_count || 0} Üye
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-teal-500" />
                <span className="text-sm text-gray-400">
                  {events.length} Etkinlik
                </span>
              </div>

              <Button className="w-full bg-teal-500 hover:bg-teal-600 rounded-full mb-4">
                Üye Ol
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center text-teal-500">
              <Calendar className="h-6 w-6 mr-2" />
              {community.community} Etkinlikleri ({events.length})
            </h2>

            <div className="grid gap-4">
              {events.length > 0 ? (
                events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="border border-blue-900 rounded-lg p-4 hover:border-blue-700 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-1">
                          {new Date(event.start_datetime).toLocaleDateString(
                            "tr-TR",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <h3 className="font-medium text-lg mb-2">
                          {event.event}
                        </h3>
                        {event.location && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <Link href={`/etkinlik/${event.id}`} legacyBehavior>
                          <a className="block">
                            <Button className="bg-teal-500 hover:bg-teal-600 rounded-full w-full md:w-auto px-6 py-2 text-center">
                              Detaylar
                            </Button>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-lg font-medium mb-2">
                    Henüz etkinlik yok
                  </h3>
                  <p className="text-sm">
                    Bu topluluk henüz hiç etkinlik düzenlememiş.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-6">
              {events.length > 5 && (
                <Button className="bg-teal-500 hover:bg-teal-600 rounded-full">
                  Tüm Etkinlikleri Gör ({events.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Management section */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="md:col-span-1">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Yönetici Listesi
            </h2>

            <ul className="space-y-4">
              <li>
                <div className="font-medium">AliEmre</div>
                <div className="text-xs text-gray-400">
                  Yönetim Kurulu Başkanı
                </div>
              </li>
              <li>
                <div className="font-medium">TamaUffes</div>
                <div className="text-xs text-gray-400">
                  YK Başkan Yardımcısı
                </div>
              </li>
              <li>
                <div className="font-medium">ImbiKira0</div>
                <div className="text-xs text-gray-400">
                  Girişimcilik ve İnovasyon Direktörü
                </div>
              </li>
              <li>
                <div className="font-medium">qwesdqwe19</div>
                <div className="text-xs text-gray-400">Sekreter</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
