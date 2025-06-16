"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CertificateViewer } from "@/components/certificate-viewer";
import { LoadingSpinner } from "@/components/ui/loading";
import { AlertTriangle, Award } from "lucide-react";

interface Certificate {
  id: number;
  user_id: number;
  event_id: number;
  certificate_data: string;
  issued_at: string;
  event?: {
    id: number;
    event: string;
    community: {
      community: string;
      logo: string;
    };
  };
}

export default function CertificateGenerationPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        // First try to get existing certificate
        const existingResponse = await fetch(
          `http://localhost:8000/api/events/${eventId}/certificate`,
          {
            credentials: "include",
          }
        );

        if (existingResponse.ok) {
          const certificateData = await existingResponse.json();
          setCertificate(certificateData);
        } else {
          // If no certificate exists, try to generate one
          const generateResponse = await fetch(
            `http://localhost:8000/api/user-certificates/generate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ event_id: parseInt(eventId) }),
            }
          );

          if (generateResponse.ok) {
            const newCertificate = await generateResponse.json();
            setCertificate(newCertificate);
          } else {
            const errorData = await generateResponse.json();
            setError(errorData.message || "Sertifika oluşturulamadı.");
          }
        }
      } catch (error) {
        console.error("Failed to fetch certificate:", error);
        setError("Sertifika yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchCertificate();
    }
  }, [eventId]);
  const generateCertificateId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `CERT-${eventId}-${timestamp}-${random}`;
  };

  // Parse certificate data
  const certificateData = certificate?.certificate_data
    ? JSON.parse(certificate.certificate_data)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Sertifika verileriniz yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Hata Oluştu
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!certificate || !certificateData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sertifika Bulunamadı
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Bu etkinlik için sertifikanız bulunmuyor veya oluşturulamadı.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tebrikler! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {certificateData.event_title} etkinliği sertifikanız hazır
            </p>
          </div>
        </div>
      </div>

      {/* Certificate */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <CertificateViewer certificate={certificate} />
        </div>
      </div>
    </div>
  );
}
