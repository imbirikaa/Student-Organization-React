"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Award,
  Calendar,
  MapPin,
  Building,
  User,
  Trophy,
  CheckCircle,
} from "lucide-react";

interface CertificateData {
  user_name: string;
  user_email: string;
  event_title: string;
  event_description: string;
  event_location: string;
  event_date: string;
  community_name: string;
  community_logo: string | null;
  completion_date: string;
  issue_date: string;
  score: number;
  quiz_title: string;
  passing_score: number;
  certificate_id: string;
  verification_code: string;
}

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

interface CertificateViewerProps {
  certificate: Certificate | null;
  onDownload?: () => void;
}

export function CertificateViewer({
  certificate,
  onDownload,
}: CertificateViewerProps) {
  const [certificateData, setCertificateData] =
    useState<CertificateData | null>(null);

  useEffect(() => {
    if (certificate?.certificate_data) {
      try {
        const data = JSON.parse(certificate.certificate_data);
        setCertificateData(data);
      } catch (error) {
        console.error("Error parsing certificate data:", error);
      }
    }
  }, [certificate]);

  if (!certificate || !certificateData) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Sertifika bilgileri yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  const downloadCertificate = () => {
    // Create a printable version with enhanced design
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sertifika - ${certificateData.user_name}</title>
            <style>
              @page { margin: 0; size: A4; }
              body { 
                font-family: 'Times New Roman', serif; 
                margin: 0; 
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .certificate {
                background: white;
                padding: 60px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 800px;
                width: 100%;
                border: 8px solid #f0f8ff;
                position: relative;
                overflow: hidden;
              }
              .certificate::before {
                content: '';
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                bottom: 20px;
                border: 4px solid #FFD700;
                border-radius: 15px;
                pointer-events: none;
              }
              .certificate::after {
                content: '';
                position: absolute;
                top: 30px;
                left: 30px;
                right: 30px;
                bottom: 30px;
                border: 2px solid #FFA500;
                border-radius: 10px;
                pointer-events: none;
              }
              .content {
                position: relative;
                z-index: 1;
              }
              .header { 
                border-bottom: 3px solid #667eea; 
                padding-bottom: 30px; 
                margin-bottom: 40px; 
              }
              .title { 
                font-size: 48px; 
                color: #667eea; 
                margin-bottom: 10px; 
                font-weight: bold;
                background: linear-gradient(45deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
              }
              .subtitle { 
                font-size: 18px; 
                color: #666; 
                font-style: italic;
              }
              .main-content { 
                margin: 40px 0; 
                line-height: 1.8;
              }
              .name { 
                font-size: 42px; 
                color: #2c3e50; 
                font-weight: bold; 
                background: linear-gradient(45deg, #2c3e50, #667eea);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                border-bottom: 3px solid #667eea;
                display: inline-block;
                padding-bottom: 10px;
                margin: 20px 0;
              }
              .event { 
                font-size: 28px; 
                color: #34495e; 
                margin: 20px 0;
                font-weight: 600;
                background: #f8f9fa;
                padding: 20px;
                border-radius: 15px;
                border-left: 5px solid #667eea;
              }
              .details { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 20px; 
                margin: 40px 0; 
                text-align: left;
              }
              .detail-item { 
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                padding: 20px; 
                border-radius: 12px; 
                border-left: 5px solid #667eea;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .detail-label { 
                font-weight: bold; 
                color: #667eea; 
                font-size: 14px; 
                text-transform: uppercase; 
                letter-spacing: 1px;
                margin-bottom: 8px;
              }
              .detail-value { 
                color: #2c3e50; 
                font-size: 18px; 
                font-weight: 600;
              }
              .footer { 
                border-top: 3px solid #667eea; 
                padding-top: 30px; 
                margin-top: 40px; 
                display: flex; 
                justify-content: space-between; 
                align-items: center;
              }
              .signature { 
                text-align: center; 
              }
              .signature-line { 
                border-top: 2px solid #333; 
                width: 200px; 
                margin: 10px auto; 
              }
              .verification { 
                background: linear-gradient(135deg, #e8f4f8 0%, #d1ecf1 100%); 
                padding: 20px; 
                border-radius: 12px; 
                border: 2px dashed #667eea;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              }
              .verification-code { 
                font-family: 'Courier New', monospace; 
                font-weight: bold; 
                color: #667eea;
                font-size: 20px;
                letter-spacing: 2px;
              }
              .score-badge {
                background: linear-gradient(45deg, #28a745, #20c997);
                color: white;
                padding: 15px 25px;
                border-radius: 50px;
                font-size: 20px;
                font-weight: bold;
                display: inline-block;
                margin: 15px;
                box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
              }
              .decorative-elements {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                opacity: 0.1;
              }
              .decorative-circle {
                position: absolute;
                border-radius: 50%;
                background: linear-gradient(45deg, #667eea, #764ba2);
              }
              .decorative-circle:nth-child(1) {
                top: -50px;
                left: -50px;
                width: 100px;
                height: 100px;
              }
              .decorative-circle:nth-child(2) {
                top: -30px;
                right: -30px;
                width: 60px;
                height: 60px;
              }
              .decorative-circle:nth-child(3) {
                bottom: -40px;
                left: -40px;
                width: 80px;
                height: 80px;
              }
              .decorative-circle:nth-child(4) {
                bottom: -20px;
                right: -20px;
                width: 40px;
                height: 40px;
              }
            </style>
          </head>
          <body>
            <div class="certificate">
              <div class="decorative-elements">
                <div class="decorative-circle"></div>
                <div class="decorative-circle"></div>
                <div class="decorative-circle"></div>
                <div class="decorative-circle"></div>
              </div>
              <div class="content">
                <div class="header">
                  <div class="title">SERTİFİKA</div>
                  <div class="subtitle">Başarı Belgesi</div>
                </div>
                
                <div class="main-content">
                  <p style="font-size: 20px; margin-bottom: 20px;">Bu belge,</p>
                  <div class="name">${certificateData.user_name}</div>
                  <p style="font-size: 18px; margin: 30px 0;">
                    adlı katılımcının aşağıda belirtilen etkinliği başarıyla tamamladığını ve 
                    gerekli yeterlilikleri kazandığını onaylar:
                  </p>
                  <div class="event">${certificateData.event_title}</div>
                  ${
                    certificateData.event_description
                      ? `<p style="font-style: italic; color: #666; margin: 20px 0;">${certificateData.event_description}</p>`
                      : ""
                  }
                  
                  <div class="score-badge">
                    🏆 Başarı Puanı: ${certificateData.score}% (Minimum: ${
        certificateData.passing_score
      }%)
                  </div>
                </div>

                <div class="details">
                  <div class="detail-item">
                    <div class="detail-label">🏢 Topluluk</div>
                    <div class="detail-value">${
                      certificateData.community_name
                    }</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">📅 Etkinlik Tarihi</div>
                    <div class="detail-value">${new Date(
                      certificateData.event_date
                    ).toLocaleDateString("tr-TR")}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">📍 Lokasyon</div>
                    <div class="detail-value">${
                      certificateData.event_location
                    }</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">✅ Tamamlanma Tarihi</div>
                    <div class="detail-value">${
                      certificateData.completion_date
                    }</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">🎯 Quiz</div>
                    <div class="detail-value">${
                      certificateData.quiz_title
                    }</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">📋 Düzenlenme Tarihi</div>
                    <div class="detail-value">${
                      certificateData.issue_date
                    }</div>
                  </div>
                </div>

                <div class="footer">
                  <div class="signature">
                    <div class="signature-line"></div>
                    <p style="margin: 10px 0; font-size: 16px; font-weight: 600;">Sistem Yöneticisi</p>
                    <p style="margin: 5px 0; font-size: 12px; color: #666;">Dijital Onay</p>
                  </div>
                  
                  <div class="verification">
                    <div style="font-size: 12px; color: #666; margin-bottom: 8px; font-weight: bold;">Sertifika Numarası:</div>
                    <div style="font-weight: bold; margin-bottom: 15px; font-size: 16px;">${
                      certificateData.certificate_id
                    }</div>
                    <div style="font-size: 12px; color: #666; margin-bottom: 8px; font-weight: bold;">Doğrulama Kodu:</div>
                    <div class="verification-code">${
                      certificateData.verification_code
                    }</div>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }

    if (onDownload) {
      onDownload();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Certificate Preview with Enhanced Design */}
      <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-green-500 rounded-full -translate-x-14 translate-y-14"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-yellow-500 rounded-full translate-x-10 translate-y-10"></div>
        </div>

        {/* Golden Border */}
        <div className="absolute inset-4 border-4 border-yellow-400 rounded-lg opacity-60"></div>
        <div className="absolute inset-2 border-2 border-yellow-300 rounded-xl opacity-40"></div>

        <CardHeader className="relative text-center pt-12 pb-8 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10">
          <div className="flex flex-col items-center mb-6">
            {/* Certificate Icon with Glow */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-40 scale-150"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Award className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Main Title */}
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                SERTİFİKA
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-3"></div>
              <p className="text-xl text-gray-600 font-medium tracking-wide">
                Başarı Belgesi
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative p-12">
          {/* Main Content */}
          <div className="text-center mb-10">
            <p className="text-xl mb-6 text-gray-700 font-light">Bu belge,</p>

            {/* User Name with Elegant Styling */}
            <div className="relative inline-block mb-8">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-gray-800 bg-clip-text text-transparent">
                {certificateData.user_name}
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>

            <p className="text-xl mb-8 text-gray-700 leading-relaxed max-w-2xl mx-auto">
              adlı katılımcının aşağıda belirtilen etkinliği başarıyla
              tamamladığını ve gerekli yeterlilikleri kazandığını onaylar:
            </p>

            {/* Event Title with Decorative Box */}
            <div className="relative mb-8">
              <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-3xl font-semibold text-gray-800 mb-2">
                  {certificateData.event_title}
                </h3>
                {certificateData.event_description && (
                  <p className="text-gray-600 italic leading-relaxed">
                    {certificateData.event_description}
                  </p>
                )}
              </div>
            </div>

            {/* Score Badges with Enhanced Design */}
            <div className="flex justify-center items-center space-x-6 mb-10">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span className="font-bold text-lg">
                      Başarı Puanı: {certificateData.score}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg">
                <span className="font-semibold">
                  Minimum: {certificateData.passing_score}%
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid with Enhanced Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="space-y-4">
              <div className="group hover:scale-105 transition-transform duration-200">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-700 text-sm uppercase tracking-wide">
                      Topluluk
                    </p>
                    <p className="text-gray-800 font-semibold text-lg">
                      {certificateData.community_name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group hover:scale-105 transition-transform duration-200">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-purple-700 text-sm uppercase tracking-wide">
                      Etkinlik Tarihi
                    </p>
                    <p className="text-gray-800 font-semibold text-lg">
                      {new Date(certificateData.event_date).toLocaleDateString(
                        "tr-TR"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group hover:scale-105 transition-transform duration-200">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-700 text-sm uppercase tracking-wide">
                      Lokasyon
                    </p>
                    <p className="text-gray-800 font-semibold text-lg">
                      {certificateData.event_location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="group hover:scale-105 transition-transform duration-200">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl border border-emerald-200 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-700 text-sm uppercase tracking-wide">
                      Tamamlanma
                    </p>
                    <p className="text-gray-800 font-semibold text-lg">
                      {certificateData.completion_date}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group hover:scale-105 transition-transform duration-200">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl border border-indigo-200 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-indigo-700 text-sm uppercase tracking-wide">
                      Quiz
                    </p>
                    <p className="text-gray-800 font-semibold text-lg">
                      {certificateData.quiz_title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group hover:scale-105 transition-transform duration-200">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-orange-700 text-sm uppercase tracking-wide">
                      Düzenlenme
                    </p>
                    <p className="text-gray-800 font-semibold text-lg">
                      {certificateData.issue_date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Signature and Verification */}
          <div className="border-t-2 border-gradient-to-r from-blue-200 via-purple-200 to-blue-200 pt-8">
            <div className="flex justify-between items-end">
              {/* Signature Section */}
              <div className="text-center">
                <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-3"></div>
                <p className="text-gray-600 font-semibold">Sistem Yöneticisi</p>
                <p className="text-xs text-gray-500 mt-1">Dijital Onay</p>
              </div>

              {/* Verification Box with Enhanced Design */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 rounded-2xl border-2 border-dashed border-blue-300 shadow-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                    Sertifika Numarası
                  </p>
                  <p className="font-bold text-gray-800 mb-4 text-sm">
                    {certificateData.certificate_id}
                  </p>
                  <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                    Doğrulama Kodu
                  </p>
                  <p className="font-mono font-bold text-blue-600 text-lg tracking-wider">
                    {certificateData.verification_code}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons with Enhanced Design */}
      <div className="flex justify-center space-x-6">
        <Button
          onClick={downloadCertificate}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Download className="h-5 w-5 mr-2" />
          Sertifikayı İndir/Yazdır
        </Button>
      </div>
    </div>
  );
}
