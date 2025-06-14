"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageLoader, CardSkeleton } from "@/components/ui/loading";
import { ErrorState, EmptyState } from "@/components/ui/error-state";
import { Calendar, MapPin, Info, Plus, Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";

interface Event {
  id: number;
  event: string;
  start_datetime: string;
  location: string;
  description?: string;
  community?: {
    id: number;
    community: string;
  };
}

interface PaginatedResponse {
  current_page: number;
  data: Event[];
  last_page: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:8000/api/events?page=${page}`
      );
      if (!response.ok) {
        throw new Error("Etkinlikler yüklenirken hata oluştu");
      }
      const data: PaginatedResponse = await response.json();
      setEvents(data.data);
      setLastPage(data.last_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  // Filter events based on search term
  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [events, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading && events.length === 0) {
    return <PageLoader text="Etkinlikler yükleniyor..." />;
  }

  if (error && events.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Etkinlikler yüklenemedi"
          message={error}
          onRetry={fetchEvents}
        />
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Etkinlikler</h1>
          <p className="text-gray-400">
            Yaklaşan topluluk etkinliklerini keşfedin
          </p>
        </div>
        <Link href="/etkinlik-olusturma">
          <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white flex items-center gap-2 transition-all duration-200">
            <Plus className="h-5 w-5" />
            Etkinlik Oluştur
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-8 bg-gray-900/50 rounded-lg p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Etkinlik ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        {filteredEvents.length !== events.length && (
          <p className="text-gray-400 text-sm mt-2">
            {filteredEvents.length} / {events.length} etkinlik gösteriliyor
          </p>
        )}
      </div>

      {/* Loading skeleton for pagination */}
      {loading && events.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Events grid */}
      {!loading && filteredEvents.length > 0 && (
        <div className="grid gap-6 mb-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-[1.01] group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                {/* Left side content */}
                <div className="flex-1 w-full">
                  {/* Event title and date */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 p-3 bg-teal-500/20 rounded-lg">
                      <Calendar className="h-6 w-6 text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-white group-hover:text-teal-300 transition-colors duration-300 mb-1">
                        {event.event}
                      </h3>
                      <div className="text-teal-400 font-medium">
                        {formatDate(event.start_datetime)}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{event.location}</span>
                  </div>

                  {/* Community info if available */}
                  {event.community && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                        <span className="text-blue-400 text-sm font-medium">
                          {event.community.community}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side action button */}
                <div className="flex-shrink-0 mt-4 md:mt-0">
                  <Link href={`/etkinlik/${event.id}`}>
                    <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-lg w-full md:w-auto px-6 py-3 flex items-center gap-2 transition-all duration-200">
                      <Info className="h-4 w-4" />
                      Detayları Gör
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredEvents.length === 0 && events.length === 0 && (
        <EmptyState
          title="Henüz etkinlik yok"
          message="İlk etkinliği oluşturun ve topluluğunuzu büyütün"
          icon={Calendar}
          action={
            <Link href="/etkinlik-olusturma">
              <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                İlk Etkinliği Oluştur
              </Button>
            </Link>
          }
        />
      )}

      {/* No search results */}
      {!loading && filteredEvents.length === 0 && events.length > 0 && (
        <EmptyState
          title="Arama sonucu bulunamadı"
          message={`"${searchTerm}" araması için etkinlik bulunamadı`}
          icon={Search}
        />
      )}

      {/* Pagination */}
      {!loading && filteredEvents.length > 0 && lastPage > 1 && (
        <div className="flex justify-center mt-8">
          <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-700 flex items-center gap-3">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
            >
              Önceki
            </Button>
            <span className="text-white text-sm font-medium px-4">
              Sayfa {page} / {lastPage}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page === lastPage}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
