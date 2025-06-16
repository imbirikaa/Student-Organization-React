"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface Event {
  id: number;
  event: string;
  start_datetime: string;
  location: string;
}

interface PaginatedResponse {
  current_page: number;
  data: Event[];
  last_page: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:8000/api/events?page=${page}`)
      .then((res) => res.json() as Promise<PaginatedResponse>)
      .then((data) => {
        setEvents(data.data);
        setLoading(false);
        setLastPage(data.last_page);
      });
  }, [page]);

  if (loading) {
    return (
      <header className="border-b border-gray-800 bg-[#111827] py-2 sticky top-0 z-50 flex justify-center items-center h-16">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </header>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner ads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="bg-blue-600 rounded-lg overflow-hidden h-20 flex items-center">
          <div className="w-1/4 flex justify-center">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Reeder"
              width={80}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="w-3/4 flex justify-end pr-4">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Kampüs Sözlük"
              width={80}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
        <div className="bg-blue-600 rounded-lg overflow-hidden h-20 flex items-center">
          <div className="w-1/4 flex justify-center">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Reeder"
              width={80}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="w-3/4 flex justify-end pr-4">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Kampüs Sözlük"
              width={80}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Events grid */}
      {/* Events header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Etkinlikler</h1>
        <Link href="/etkinlik-olusturma">
          <Button className="bg-teal-500 hover:bg-teal-600 rounded-full">
            Etkinlik Oluştur
          </Button>
        </Link>
      </div>
        {events.map((event) => (
          <div key={event.id} className="border border-blue-900 mb-5 rounded-lg  p-4">
            {/* Main container:
              - On medium screens (md) and up: uses flex-row to align items horizontally.
            */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              {/* ===== Left Side Content (Grows to fill space) ===== */}
              {/*
                - Takes all available width on all screens (`w-full`).
                - On medium screens, it becomes a flex item that can grow (`md:flex-1`).
              */}
              <div className="flex-1 w-full">
                {/* Date and Event Title */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">
                      {event.start_datetime.split("T")[0]}
                    </div>
                    <h3 className="font-medium text-lg">{event.event}</h3>
                  </div>
                </div>

                {/* Location - with top margin for spacing on mobile */}
                <div className="flex items-center gap-4 mt-3 md:mt-2">
                  <div className="flex-shrink-0">
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-sm">{event.location}</div>
                </div>
              </div>

              {/* ===== Right Side Action (Button) ===== */}
              {/*
                - Has a top margin on mobile for separation (`mt-4`).
                - On medium screens, the margin is removed (`md:mt-0`).
                - `flex-shrink-0` prevents the button from shrinking on desktop.
              */}
              <div className="flex-shrink-0 mt-4 md:mt-0">
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
        ))}

      {/* --- Pagination Controls (No changes needed here) --- */}
      <div className="flex justify-center mt-4">
        <div className="bg-gray-900 p-2 rounded-full shadow-md flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-full disabled:opacity-40 transition-opacity"
          >
            Prev
          </button>
          <span className="text-white text-sm font-medium px-2">
            Page {page} / {lastPage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            disabled={page === lastPage}
            className="px-4 py-2 bg-gray-800 text-white rounded-full disabled:opacity-40 transition-opacity"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
