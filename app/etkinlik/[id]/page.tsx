"use client";

import React, { useEffect, useState } from "react";
// import { useParams } from 'next/navigation'; // Removed for preview compatibility
// import Image from 'next/image'; // Removed for preview compatibility
// import Link from 'next/link'; // Removed for preview compatibility
// import { Button } from '@/components/ui/button'; // Removed for preview compatibility
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";

// --- Mocking Components for Preview ---
const Button = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => <button className={className}>{children}</button>;
const Image = ({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className: string;
}) => (
  <img
    src={src}
    alt={alt}
    className={className}
    style={{ width: width, height: height }}
  />
);
const Link = ({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) => (
  <a href={href} className={className}>
    {children}
  </a>
);

// --- Interface for Event Data ---
interface EventType {
  id: number;
  community: {
    id: number;
    community: string;
    logo: string;
  };
  event: string;
  cover_image: string;
  description: string;
  start_datetime: string;
  last_application_datetime: string;
  location: string;
  certificate_type: string;
  min_sessions_for_certificate: number;
  verification_type: string;
}

// --- Helper Function to Format Dates ---
const formatDateTime = (isoString: string) => {
  if (!isoString) return { date: "N/A", time: "N/A" };
  try {
    const date = new Date(isoString);
    const optionsDate: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return {
      date: date.toLocaleDateString("tr-TR", optionsDate),
      time: date.toLocaleTimeString("tr-TR", optionsTime),
    };
  } catch (error) {
    console.error("Invalid date format:", isoString);
    return { date: "Geçersiz Tarih", time: "" };
  }
};

// --- Main Event Detail Page Component ---
export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8000/api/events/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Etkinlik bulunamadı veya getirme yetkiniz yok.");
        }
        return res.json();
      })
      .then((data) => {
        setEvent(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id]);

  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!event)
    return <div className="text-gray-400 text-center mt-10">Yükleniyor...</div>;

  const { date: startDate, time: startTime } = formatDateTime(
    event.start_datetime
  );
  const { date: lastAppDate, time: lastAppTime } = formatDateTime(
    event.last_application_datetime
  );

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* --- Cover Image --- */}
      <div className="relative h-64 w-full">
        <Image
          src="/images/bg.png"
          alt="Event cover image"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-16 mb-8">
          {/* Header section */}
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            {/* Event Icon */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-[120px] h-[120px] bg-gray-900 border-4 border-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="h-16 w-16 text-teal-500" />
              </div>
            </div>

            {/* Event Title and Location */}
            <div className="flex-1 mt-4 md:mt-0">
              <h1 className="text-3xl font-bold mb-1">{event.event}</h1>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.location}
              </p>
            </div>

            {/* Apply Button */}
            <div className="flex gap-2 w-full md:w-auto">
              <Button className="w-full md:w-auto bg-teal-500 hover:bg-teal-600 rounded-full px-8 py-3 text-white font-bold transition-transform duration-200 hover:scale-105 shadow-lg shadow-teal-500/20">
                Başvur
              </Button>
            </div>
          </div>
        </div>

        {/* --- Main content grid --- */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Column 1: Description */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800/80 rounded-lg p-6 border border-gray-800 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-6 border-b border-gray-700 pb-3">
              <h2 className="text-xl font-semibold text-teal-400">
                Etkinlik Açıklaması
              </h2>
            </div>
            <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Column 2: Details & Host */}
          <div className="space-y-6">
            {/* Hosted by Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 rounded-lg p-6 border border-gray-800 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-medium">Ev Sahibi</h2>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src={event.community.logo}
                  alt={event.community.community}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{event.community.community}</h3>
                  <Link
                    href={`/topluluklar/${event.community.id}`}
                    className="text-xs text-teal-400 hover:underline"
                  >
                    Topluluğu Görüntüle
                  </Link>
                </div>
              </div>
            </div>

            {/* Key Details Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 rounded-lg p-6 border border-gray-800 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-6 border-b border-gray-700 pb-3">
                <h2 className="text-xl font-semibold text-teal-400">
                  Detaylar
                </h2>
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-4 text-sm">
                  <Calendar className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{startDate}</span>
                    <span className="text-xs text-gray-400">
                      Başlangıç: {startTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Clock className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-semibold">Son Başvuru</span>
                    <span className="text-xs text-gray-400">{lastAppDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Award className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>{event.certificate_type}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <ShieldCheck className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>Doğrulama: {event.verification_type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
