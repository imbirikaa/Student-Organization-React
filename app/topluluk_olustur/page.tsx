"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Users } from "lucide-react";
import { toast } from "react-hot-toast";

// Define an interface for the expected validation error structure from Laravel
interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

// A type guard to check if an object is a ValidationError
function isValidationError(obj: any): obj is ValidationError {
  return (
    obj && typeof obj.message === "string" && typeof obj.errors === "object"
  );
}

export default function CommunityCreationPage() {
  const router = useRouter();
  // State for all the fields
  const [community, setCommunity] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [about, setAbout] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [foundingYear, setFoundingYear] = useState("");
  const [achievements, setAchievements] = useState("");
  const [traditionalEvents, setTraditionalEvents] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [sponsors, setSponsors] = useState("");
  const [faq, setFaq] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    // ... appending all your form data ...
    formData.append("community", community);
    formData.append("about", about);
    formData.append("mission", mission);
    formData.append("vision", vision);
    formData.append("founding_year", foundingYear);
    formData.append("achievements", achievements);
    formData.append("traditional_events", traditionalEvents);
    formData.append("contact_email", contactEmail);
    formData.append("sponsors", sponsors);
    formData.append("faq", faq);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      // Step 1: Get CSRF cookie. This part is correct.
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      // Step 2: Send the form data with credentials
      const res = await fetch(`http://localhost:8000/api/communities`, {
        method: "POST",
        body: formData,
        // *** THE FIX IS HERE ***
        credentials: "include", // <-- ADD THIS LINE. It's critical for sending cookies.
        headers: {
          // DO NOT set Content-Type. The browser sets it for FormData.
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 419) {
          throw new Error("CSRF token mismatch. Please refresh the page.");
        }
        if (res.status === 422 && isValidationError(data)) {
          const firstError = Object.values(data.errors)[0][0];
          throw new Error(firstError || "Please check your input.");
        }
        throw new Error(data.message || "An error occurred on the server.");
      }

      toast.success("Community created successfully!");
      router.push("/topluluklar");
    } catch (error) {
      let errorMessage = "Failed to create community.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Users className="h-7 w-7 mr-3 text-teal-400" />
        Topluluk Oluşturma
      </h1>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        {/* The rest of your form JSX remains the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            placeholder="Topluluk Adı (Gerekli)"
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            required
          />
          <label className="flex items-center border border-blue-900 rounded-lg p-3 bg-gray-900 cursor-pointer">
            <Upload className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-blue-500 truncate">
              {logo ? logo.name : "Logo Yükle (İsteğe bağlı)"}
            </span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>

        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Hakkında"
          rows={4}
          className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
        ></textarea>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="Misyon"
            rows={4}
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          ></textarea>
          <textarea
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="Vizyon"
            rows={4}
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            value={foundingYear}
            onChange={(e) => setFoundingYear(e.target.value)}
            placeholder="Kuruluş Yılı (YYYY)"
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="İletişim E-postası"
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <textarea
          value={achievements}
          onChange={(e) => setAchievements(e.target.value)}
          placeholder="Başarılar"
          rows={4}
          className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
        ></textarea>

        <textarea
          value={traditionalEvents}
          onChange={(e) => setTraditionalEvents(e.target.value)}
          placeholder="Geleneksel Etkinlikler"
          rows={4}
          className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
        ></textarea>

        <textarea
          value={sponsors}
          onChange={(e) => setSponsors(e.target.value)}
          placeholder="Sponsorlar"
          rows={2}
          className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
        ></textarea>

        <textarea
          value={faq}
          onChange={(e) => setFaq(e.target.value)}
          placeholder="Sıkça Sorulan Sorular"
          rows={4}
          className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
        ></textarea>

        <Button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? "Oluşturuluyor..." : "TOPLULUĞU OLUŞTUR"}
        </Button>
      </form>
    </div>
  );
}
