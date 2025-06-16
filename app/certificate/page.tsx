"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CertificateViewer } from "@/components/certificate-viewer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Award } from "lucide-react";
import Link from "next/link";

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

export default function CertificatePage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchCertificate();
    } else {
      setError("Event ID not provided");
      setLoading(false);
    }
  }, [eventId]);

  const fetchCertificate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/events/${eventId}/certificate`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCertificate(data);
      } else if (response.status === 404) {
        setError("Bu etkinlik için sertifikanız bulunmuyor.");
      } else {
        setError("Sertifika bilgileri alınamadı.");
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      setError("Sertifika yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/user-certificates/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ event_id: parseInt(eventId) }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCertificate(data);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Sertifika oluşturulamadı.");
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      setError("Sertifika oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Sertifika yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            <Award className="h-8 w-8 inline mr-3 text-blue-600" />
            Sertifikam
          </h1>
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-6">
            <AlertDescription>
              {error}
              {error.includes("bulunmuyor") && (
                <div className="mt-4">
                  <Button onClick={generateCertificate} disabled={loading}>
                    Sertifika Oluştur
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Not: Sertifika alabilmek için etkinliğe kayıt olmuş ve
                    quiz'i başarıyla tamamlamış olmanız gerekir.
                  </p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Certificate Display */}
        {certificate && (
          <CertificateViewer
            certificate={certificate}
            onDownload={() => {
              // Analytics or additional actions can be added here
              console.log("Certificate downloaded");
            }}
          />
        )}

        {/* No Certificate State */}
        {!certificate && !error && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Sertifika Bulunamadı
              </h3>
              <p className="text-gray-600 mb-6">
                Bu etkinlik için henüz bir sertifikanız bulunmuyor.
              </p>
              <Button onClick={generateCertificate} disabled={loading}>
                Sertifika Oluşturmayı Dene
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
