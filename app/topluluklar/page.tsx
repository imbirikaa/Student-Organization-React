"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, FileEdit, FilePlus, Loader2, Send } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";
import { toast } from "react-hot-toast";

// Define a type for our community data
interface Community {
  id: number;
  community: string;
  logo: string | null;
  about?: string;
  founding_year?: number;
  memberships_count: number;
  events_count: number;
  created_at?: string;
}

export default function CommunitiesPage() {
  const { user } = useAuth(); // Get user from AuthContext to check if logged in
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<number | null>(null); // State to manage loading status for each button
  const [error, setError] = useState<string | null>(null);

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
        // The API returns {communities: [...]} so we need to access data.communities
        setCommunities(data.communities || []);
      } catch (err: any) {
        setError("Topluluklar yüklenirken hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const handleApply = async (communityId: number) => {
    if (!user) {
      toast.error("Başvuru yapmak için giriş yapmalısınız.");
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
        throw new Error(data.message || "Başvuru gönderilirken hata oluştu.");
      }

      toast.success(data.message || "Başvurunuz başarıyla gönderildi!");
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu.");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ...Header... */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Topluluklar</h1>
        <div className="flex items-center gap-4">
          <Link href="/topluluk_olustur">
            <Button className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2">
              <FilePlus className="h-5 w-5" />
              Topluluk Oluştur
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center p-16">
          <Loader2 className="h-12 w-12 animate-spin text-teal-500" />
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Communities grid */}
      {!isLoading && !error && communities && Array.isArray(communities) && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {communities.map((community) => (
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
                    <Loader2 className="h-4 w-4 animate-spin" />
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

      {/* No communities fallback */}
      {!isLoading &&
        !error &&
        (!communities ||
          !Array.isArray(communities) ||
          communities.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Şu anda müsait topluluk bulunmamaktadır.
            </p>
          </div>
        )}
    </div>
  );
}
