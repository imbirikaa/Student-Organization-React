"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardSkeleton, LoadingSpinner } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error-state";
import { User, FileEdit, FilePlus, Send, Search, Filter } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";
import { toast } from "react-hot-toast";

// Define a type for our community data
interface Community {
  id: number;
  community: string;
  logo: string | null;
  memberships_count: number;
  events_count: number;
}

export default function CommunitiesPage() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "members" | "events">("name");

  // Function to get the CSRF token from cookies
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/communities`);
        if (!response.ok) {
          throw new Error("Failed to fetch communities");
        }
        const data = await response.json();
        setCommunities(data);
        setFilteredCommunities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  // Filter and sort communities
  useEffect(() => {
    let filtered = communities.filter((community) =>
      community.community.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "members":
          return b.memberships_count - a.memberships_count;
        case "events":
          return b.events_count - a.events_count;
        default:
          return a.community.localeCompare(b.community);
      }
    });

    setFilteredCommunities(filtered);
  }, [communities, searchTerm, sortBy]);

  const handleApply = async (communityId: number) => {
    if (!user) {
      toast.error("You must be logged in to apply.");
      return;
    }

    setApplyingId(communityId);

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const res = await fetch(
        `http://localhost:8000/api/communities/${communityId}/apply`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit application.");
      }

      toast.success(data.message || "Application submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setApplyingId(null);
    }
  };

  const retryFetch = () => {
    setError(null);
    setIsLoading(true);
    // Re-trigger the effect
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Topluluklar</h1>
          <p className="text-gray-400">
            Üniversite topluluklarını keşfedin ve katılın
          </p>
        </div>
        <Link href="/topluluk_olustur">
          <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white flex items-center gap-2 transition-all duration-200">
            <FilePlus className="h-5 w-5" />
            Topluluk Oluştur
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 bg-gray-900/50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Topluluk ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "members" | "events")
              }
              className="px-4 py-3 rounded-lg border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="name">İsme Göre</option>
              <option value="members">Üye Sayısına Göre</option>
              <option value="events">Etkinlik Sayısına Göre</option>
            </select>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {filteredCommunities.length !== communities.length && (
          <p className="text-gray-400 text-sm mt-2">
            {filteredCommunities.length} / {communities.length} topluluk
            gösteriliyor
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState
          title="Topluluklar yüklenemedi"
          message={error}
          onRetry={retryFetch}
        />
      )}

      {/* Communities grid */}
      {!isLoading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="bg-gray-900 rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <Image
                      src={
                        community.logo ||
                        "/placeholder.svg?height=100&width=100"
                      }
                      alt={`${community.community} logo`}
                      width={100}
                      height={100}
                      className="rounded-full h-[100px] w-[100px] object-cover bg-gray-700"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {community.community}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-teal-500" />
                      <span className="text-sm text-gray-400">
                        {community.memberships_count} Üye
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileEdit className="h-4 w-4 text-teal-500" />
                      <span className="text-sm text-gray-400">
                        {community.events_count} Etkinlik
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- ACTION BUTTONS ADDED HERE --- */}
              <div className="flex items-center justify-center gap-4 mt-4 border-t border-gray-700 pt-4">
                <Link
                  href={`/topluluklar/${community.id}`}
                  className="flex-1 text-center text-blue-400 hover:text-blue-300 font-medium"
                >
                  İncele
                </Link>

                <Button
                  onClick={() => handleApply(community.id)}
                  disabled={applyingId === community.id}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  size="sm"
                >
                  {applyingId === community.id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Başvur
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
