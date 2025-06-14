"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Award,
  Download,
  Eye,
  Trash2,
  Plus,
  FileText,
  Star,
  Calendar,
  Users,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function CertificatesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("my-certificates");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const mockCertificates = [
    {
      id: 1,
      title: "React Advanced Workshop",
      issuer: "Tech Academy",
      date: "2024-01-15",
      type: "Workshop",
      status: "verified",
      thumbnail: "/certificate-thumb-1.png",
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      issuer: "Code Institute",
      date: "2023-12-20",
      type: "Course",
      status: "verified",
      thumbnail: "/certificate-thumb-2.png",
    },
    {
      id: 3,
      title: "Community Leadership",
      issuer: "Leadership Academy",
      date: "2023-11-10",
      type: "Achievement",
      status: "pending",
      thumbnail: "/certificate-thumb-3.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Sertifikalarım
          </h1>
          <p className="text-gray-400 text-lg">
            Başarılarınızı sergileyeceğiniz sertifikalarınızı yönetin
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 justify-center">
          <Button
            onClick={() => setActiveTab("my-certificates")}
            variant={activeTab === "my-certificates" ? "default" : "outline"}
            className={`${
              activeTab === "my-certificates"
                ? "bg-gradient-to-r from-teal-500 to-purple-500"
                : "border-gray-600 hover:border-teal-500"
            } rounded-xl`}
          >
            <Award className="h-4 w-4 mr-2" />
            Sertifikalarım
          </Button>
          <Button
            onClick={() => setActiveTab("upload")}
            variant={activeTab === "upload" ? "default" : "outline"}
            className={`${
              activeTab === "upload"
                ? "bg-gradient-to-r from-teal-500 to-purple-500"
                : "border-gray-600 hover:border-teal-500"
            } rounded-xl`}
          >
            <Upload className="h-4 w-4 mr-2" />
            Sertifika Yükle
          </Button>
          <Button
            onClick={() => setActiveTab("template")}
            variant={activeTab === "template" ? "default" : "outline"}
            className={`${
              activeTab === "template"
                ? "bg-gradient-to-r from-teal-500 to-purple-500"
                : "border-gray-600 hover:border-teal-500"
            } rounded-xl`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Şablon Oluştur
          </Button>
        </div>

        {/* My Certificates Tab */}
        {activeTab === "my-certificates" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-teal-400 mb-1">12</div>
                <div className="text-gray-400">Toplam Sertifika</div>
              </div>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-green-400 mb-1">9</div>
                <div className="text-gray-400">Onaylanmış</div>
              </div>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-amber-400 mb-1">3</div>
                <div className="text-gray-400">Bu Ay</div>
              </div>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  750
                </div>
                <div className="text-gray-400">Toplam Puan</div>
              </div>
            </div>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  {/* Certificate Thumbnail */}
                  <div className="relative mb-4">
                    <div className="aspect-[4/3] bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-xl border border-gray-700 flex items-center justify-center">
                      <Award className="h-16 w-16 text-teal-400" />
                    </div>
                    <div
                      className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                        cert.status === "verified"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {cert.status === "verified" ? "Onaylanmış" : "Beklemede"}
                    </div>
                  </div>

                  {/* Certificate Info */}
                  <h3 className="font-semibold text-gray-200 mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-1">{cert.issuer}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {cert.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {cert.type}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gray-600 hover:border-teal-500"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Görüntüle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 hover:border-blue-500"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 hover:border-red-500 text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add New Certificate Card */}
              <div
                onClick={() => setActiveTab("upload")}
                className="backdrop-blur-sm bg-white/5 border border-white/10 border-dashed rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-teal-500/30 group-hover:to-purple-500/30 transition-all">
                    <Plus className="h-8 w-8 text-teal-400" />
                  </div>
                  <h3 className="font-semibold text-gray-200 mb-2">
                    Yeni Sertifika
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Sertifika yüklemek için tıklayın
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="max-w-3xl mx-auto">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 flex items-center justify-center mr-3">
                  <Upload className="h-4 w-4 text-white" />
                </div>
                Sertifika Yükle
              </h2>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center mb-6 hover:border-teal-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="certificate-upload"
                />
                <label htmlFor="certificate-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    Dosya Seçin
                  </h3>
                  <p className="text-gray-400">
                    PNG, JPG veya PDF formatında sertifikanızı yükleyin
                  </p>
                </label>
              </div>

              {/* Preview */}
              {preview && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-gray-200">
                    Önizleme
                  </h4>
                  <div className="relative">
                    <Image
                      src={preview}
                      alt="Certificate preview"
                      width={400}
                      height={300}
                      className="rounded-xl border border-gray-700 mx-auto"
                    />
                  </div>
                </div>
              )}

              {/* Certificate Details Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Sertifika Adı
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: React Developer Certificate"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Veren Kurum
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Meta, Google, Microsoft"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Alınma Tarihi
                    </label>
                    <input
                      type="date"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Sertifika Türü
                    </label>
                    <select className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-teal-500 transition-colors">
                      <option value="">Tür seçin</option>
                      <option value="course">Kurs</option>
                      <option value="workshop">Workshop</option>
                      <option value="certification">Sertifikasyon</option>
                      <option value="achievement">Başarı</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Açıklama
                  </label>
                  <textarea
                    placeholder="Sertifika hakkında kısa bir açıklama yazın..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors min-h-[100px] resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-xl px-8 py-3 flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Sertifikayı Yükle
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 hover:border-gray-500 rounded-xl px-8 py-3"
                  >
                    İptal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Template Tab */}
        {activeTab === "template" && (
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                Sertifika Şablonu Oluştur
              </h2>

              {/* Design Guidelines */}
              <div className="mb-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h3 className="text-blue-400 font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Tasarım Gereksinimleri
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Sertifika ölçüleri: <strong>1421px × 1006px</strong>{" "}
                      olmalı
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Dosya boyutu en fazla <strong>2MB</strong> olmalı
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>İsim alanı şablon üzerinde değiştirilmemeli</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>PNG veya JPG formatında olmalı</span>
                  </li>
                </ul>
              </div>

              {/* Template Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((template) => (
                  <div
                    key={template}
                    className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-lg border border-gray-700 flex items-center justify-center mb-4">
                      <Award className="h-12 w-12 text-teal-400" />
                    </div>
                    <h4 className="font-semibold text-gray-200 mb-2">
                      Şablon {template}
                    </h4>
                    <p className="text-gray-400 text-sm mb-3">
                      Modern ve profesyonel tasarım
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-gray-600 hover:border-teal-500"
                    >
                      <Download className="h-3 w-3 mr-2" />
                      İndir
                    </Button>
                  </div>
                ))}
              </div>

              {/* Custom Upload */}
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  Özel Şablon Yükle
                </h3>
                <p className="text-gray-400 mb-4">
                  Kendi tasarladığınız şablonu yükleyerek etkinliklerinizde
                  kullanın
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl">
                  <Upload className="h-4 w-4 mr-2" />
                  Şablon Yükle
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
