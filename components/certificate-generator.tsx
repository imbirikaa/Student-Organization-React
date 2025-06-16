"use client";

import { useState, useRef } from "react";
import {
  Download,
  Share2,
  Award,
  Calendar,
  User,
  Building,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificateProps {
  eventTitle: string;
  userName: string;
  userEmail: string;
  eventDate: string;
  issuerName: string;
  certificateId: string;
  score?: number;
  eventId: string;
}

export function CertificateGenerator({
  eventTitle,
  userName,
  userEmail,
  eventDate,
  issuerName,
  certificateId,
  score,
  eventId,
}: CertificateProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);

    try {
      // Use html2canvas if available, otherwise use basic download
      if (typeof window !== "undefined") {
        // Dynamic import for html2canvas
        const html2canvas = (await import("html2canvas")).default;

        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        });
        // Convert to blob and download
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${eventTitle}-Sertifika-${userName}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          },
          "image/png",
          1.0
        );

        // Save to backend
        const imgData = canvas.toDataURL("image/png");
        await saveCertificateToDatabase(imgData);
      }
    } catch (error) {
      console.error("Certificate generation failed:", error);
      // Fallback: save certificate data to backend without image
      await saveCertificateToDatabase("");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCertificateToDatabase = async (imageData: string) => {
    try {
      const response = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          event_id: eventId,
          certificate_path: imageData,
          issue_date: new Date().toISOString(),
          certificate_id: certificateId,
          score: score,
        }),
      });

      if (response.ok) {
        setIsSaved(true);
        console.log("Certificate saved successfully");
      }
    } catch (error) {
      console.error("Failed to save certificate:", error);
    }
  };

  const shareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${eventTitle} Sertifikası`,
          text: `${eventTitle} etkinliği için aldığım sertifikayı paylaşıyorum!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Paylaşım iptal edildi");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Sertifika bağlantısı panoya kopyalandı!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Success Message */}
      {isSaved && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800 dark:text-green-200 font-medium">
              Sertifikanız başarıyla kaydedildi!
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          onClick={downloadCertificate}
          disabled={isGenerating}
          size="lg"
          className="bg-teal-600 text-white px-8 py-3 hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          {isGenerating ? "Oluşturuluyor..." : "Sertifikayı İndir"}
        </Button>

        <Button
          onClick={shareCertificate}
          size="lg"
          variant="outline"
          className="px-8 py-3 flex items-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Paylaş
        </Button>
      </div>

      {/* Certificate */}
      <div className="flex justify-center">
        <div
          ref={certificateRef}
          className="bg-white rounded-lg shadow-2xl overflow-hidden"
          style={{ width: "842px", height: "595px" }} // A4 landscape ratio
        >
          {/* Certificate Border */}
          <div className="w-full h-full border-8 border-gradient-to-r from-teal-500 to-purple-500 p-4 relative">
            <div className="w-full h-full border-4 border-gray-300 p-8 relative bg-white">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  SERTİFİKA
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-purple-500 mx-auto"></div>
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 mb-4">
                  Bu sertifika aşağıdaki kişinin
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2 inline-block px-8">
                  {userName}
                </h2>

                <p className="text-lg text-gray-600 mb-2">
                  <span className="font-semibold text-2xl text-gray-800">
                    {eventTitle}
                  </span>
                </p>

                <p className="text-lg text-gray-600 mb-6">
                  etkinliğini başarıyla tamamladığını belgelemektedir.
                </p>

                {score && (
                  <div className="bg-gray-100 rounded-lg p-4 mb-6 inline-block">
                    <p className="text-lg font-semibold text-gray-800">
                      Başarı Puanı:{" "}
                      <span className="text-teal-600">{score}%</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Tarih: {new Date(eventDate).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{issuerName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="border-t-2 border-gray-400 pt-2 px-8 mb-2">
                    <p className="text-sm text-gray-600">Yetkili İmza</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Sertifika No: {certificateId}
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-teal-500 opacity-20"></div>
              <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-purple-500 opacity-20"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-teal-500 opacity-20"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-purple-500 opacity-20"></div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Info */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            📋 Sertifika Bilgileri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Katılımcı:
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {userName}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Etkinlik:
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {eventTitle}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Tarih:
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {new Date(eventDate).toLocaleDateString("tr-TR")}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Sertifika No:
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {certificateId}
              </span>
            </div>
            {score && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Puan:
                </span>
                <span className="ml-2 text-teal-600 font-semibold">
                  {score}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificateGenerator;
