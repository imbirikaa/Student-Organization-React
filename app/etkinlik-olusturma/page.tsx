"use client";

import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image"; // Removed for preview compatibility
import { Button } from "@/components/ui/button";
import { Calendar, Upload, CheckCircle, AlertTriangle } from "lucide-react";

// --- Mocking Image component for preview ---
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
    style={{ width: width, height: height }}
    className={className}
  />
);

// --- Interfaces ---
// To type the structure of a community fetched from the API
interface Community {
  id: number;
  community: string;
}

// To type the form data
interface EventFormData {
  community_id: string;
  event: string;
  description: string;
  start_datetime: string;
  last_application_datetime: string;
  location: string;
  certificate_type: string;
  min_sessions_for_certificate: string;
  verification_type: string;
}

export default function EventCreationPage() {
  // --- State Management ---
  const [formData, setFormData] = useState<EventFormData>({
    community_id: "",
    event: "",
    description: "",
    start_datetime: "",
    last_application_datetime: "",
    location: "",
    certificate_type: "Sertifika İstemiyorum",
    min_sessions_for_certificate: "0",
    verification_type: "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Data Fetching ---
  // Fetch user's communities when the component mounts
  useEffect(() => {
    // In a real app, you would fetch this from your API
    fetch("http://localhost:8000/api/user/communities", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUserCommunities(data));

    // Using mock data for demonstration
    // const mockCommunities: Community[] = [
    //   { id: 101, community: "Kodlama Kulübü" },
    //   { id: 102, community: "Girişimcilik Topluluğu" },
    //   { id: 103, community: "Müzik Grubu" },
    // ];
    // setUserCommunities(mockCommunities);
  }, []);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // --- Form Validation ---
    if (
      !formData.community_id ||
      !formData.event ||
      !formData.description ||
      !formData.start_datetime ||
      !formData.last_application_datetime ||
      !formData.location ||
      !formData.verification_type ||
      !coverImage
    ) {
      setError(
        "Lütfen tüm zorunlu alanları doldurun ve bir kapak resmi seçin."
      );
      setIsLoading(false);
      return;
    }

    // --- Create FormData for API submission ---
    const submissionData = new FormData();
    submissionData.append("community_id", formData.community_id);
    submissionData.append("event", formData.event);
    submissionData.append("description", formData.description);
    submissionData.append("start_datetime", formData.start_datetime);
    submissionData.append(
      "last_application_datetime",
      formData.last_application_datetime
    );
    submissionData.append("location", formData.location);
    submissionData.append("certificate_type", formData.certificate_type);
    submissionData.append(
      "min_sessions_for_certificate",
      formData.min_sessions_for_certificate
    );
    submissionData.append("verification_type", formData.verification_type);
    if (coverImage) {
      submissionData.append("cover_image", coverImage);
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8000/api/events", {
        method: "POST",
        body: submissionData,
        // Add credentials if your API requires authentication
        // credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Etkinlik oluşturulurken bir hata oluştu.");
      }

      const result = await response.json();
      setSuccess("Etkinlik başarıyla oluşturuldu!");
    } catch (err: any) {
      setError(err.message || "Bilinmeyen bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Etkinlik Oluşturma</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        {/* Community and Event Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="community_id"
              className="block text-sm text-gray-400 mb-1"
            >
              Topluluk
            </label>
            <select
              id="community_id"
              name="community_id"
              value={formData.community_id}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
            >
              <option value="" disabled>
                Bir topluluk seçin...
              </option>
              {userCommunities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.community}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="event" className="block text-sm text-gray-400 mb-1">
              Etkinlik Başlığı
            </label>
            <input
              id="event"
              name="event"
              type="text"
              placeholder="Etkinlik Başlığı"
              value={formData.event}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Kapak Resmi
          </label>
          <div
            onClick={handleUploadClick}
            className="flex items-center justify-center w-full border-2 border-dashed border-blue-900 rounded-lg p-6 bg-gray-900 hover:bg-gray-800 cursor-pointer text-center"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Cover preview"
                width={400}
                height={200}
                className="rounded-lg object-cover max-h-48"
              />
            ) : (
              <div className="text-blue-500">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <span>Bir resim seçmek için tıklayın</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm text-gray-400 mb-1"
          >
            Etkinlik Hakkında
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Etkinlik hakkında detaylı bilgi..."
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          ></textarea>
        </div>

        {/* Datetimes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="start_datetime"
              className="block text-sm text-gray-400 mb-1"
            >
              Etkinlik Başlama Zamanı
            </label>
            <input
              type="datetime-local"
              id="start_datetime"
              name="start_datetime"
              value={formData.start_datetime}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label
              htmlFor="last_application_datetime"
              className="block text-sm text-gray-400 mb-1"
            >
              Son Başvuru Tarihi
            </label>
            <input
              type="datetime-local"
              id="last_application_datetime"
              name="last_application_datetime"
              value={formData.last_application_datetime}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Location and Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="location"
              className="block text-sm text-gray-400 mb-1"
            >
              Etkinlik Yeri
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Örn: Online (Zoom), Konferans Salonu"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label
              htmlFor="min_sessions_for_certificate"
              className="block text-sm text-gray-400 mb-1"
            >
              Min. Oturum Sayısı (Sertifika İçin)
            </label>
            <input
              type="number"
              id="min_sessions_for_certificate"
              name="min_sessions_for_certificate"
              placeholder="0"
              value={formData.min_sessions_for_certificate}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Certificate and Verification Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="certificate_type"
              className="block text-sm text-gray-400 mb-1"
            >
              Sertifika Türü (Opsiyonel)
            </label>
            <select
              id="certificate_type"
              name="certificate_type"
              value={formData.certificate_type}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
            >
              <option>Sertifika İstemiyorum</option>
              <option>Katılım Sertifikası</option>
              <option>Başarı Sertifikası</option>
              <option>Özel Sertifika Yükle</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="verification_type"
              className="block text-sm text-gray-400 mb-1"
            >
              Doğrulama Yöntemi
            </label>
            <select
              id="verification_type"
              name="verification_type"
              value={formData.verification_type}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
            >
              <option value="" disabled>
                Bir yöntem seçin...
              </option>
              <option>QR Kod Tarama</option>
              <option>Manuel Onay</option>
              <option>Otomatik Onay</option>
            </select>
          </div>
        </div>

        {/* --- Feedback Messages --- */}
        {error && (
          <div className="flex items-center p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-400">
            <AlertTriangle className="h-5 w-5 mr-3" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center p-4 bg-green-900/50 border border-green-500/50 rounded-lg text-green-400">
            <CheckCircle className="h-5 w-5 mr-3" />
            <span>{success}</span>
          </div>
        )}

        {/* --- Submit Button --- */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Oluşturuluyor..." : "ETKİNLİĞİ OLUŞTUR"}
        </Button>
      </form>
    </div>
  );
}
