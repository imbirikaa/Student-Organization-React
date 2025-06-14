"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Check,
  X,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ExternalLink,
  Star,
  Award,
  Building,
  Heart,
} from "lucide-react";
import { useState } from "react";
import RequireRole from "@/components/RequireRole";

export default function SponsorsPage() {
  const [logos, setLogos] = useState<(string | null)[]>([null, null, null]);
  const [activeTab, setActiveTab] = useState("current");
  const [editMode, setEditMode] = useState(false);

  const handleLogoUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newLogos = [...logos];
        newLogos[index] = reader.result as string;
        setLogos(newLogos);
      };
      reader.readAsDataURL(file);
    }
  };

  const mockSponsors = [
    {
      id: 1,
      name: "TechCorp Inc.",
      logo: "/sponsor-logo-1.png",
      tier: "Platinum",
      website: "https://techcorp.com",
      description:
        "Leading technology company specializing in AI and machine learning solutions.",
      since: "2023",
      status: "active",
    },
    {
      id: 2,
      name: "InnovateLab",
      logo: "/sponsor-logo-2.png",
      tier: "Gold",
      website: "https://innovatelab.com",
      description: "Innovation hub for startups and emerging technologies.",
      since: "2023",
      status: "active",
    },
    {
      id: 3,
      name: "DevTools Pro",
      logo: "/sponsor-logo-3.png",
      tier: "Silver",
      website: "https://devtools.pro",
      description: "Professional development tools and software solutions.",
      since: "2024",
      status: "pending",
    },
  ];

  return (
    <RequireRole role="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Sponsor Yönetimi
            </h1>
            <p className="text-gray-400 text-lg">
              Etkinlik ve topluluk sponsorlarınızı yönetin
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 justify-center">
            <Button
              onClick={() => setActiveTab("current")}
              variant={activeTab === "current" ? "default" : "outline"}
              className={`${
                activeTab === "current"
                  ? "bg-gradient-to-r from-teal-500 to-purple-500"
                  : "border-gray-600 hover:border-teal-500"
              } rounded-xl`}
            >
              <Building className="h-4 w-4 mr-2" />
              Mevcut Sponsorlar
            </Button>
            <Button
              onClick={() => setActiveTab("add")}
              variant={activeTab === "add" ? "default" : "outline"}
              className={`${
                activeTab === "add"
                  ? "bg-gradient-to-r from-teal-500 to-purple-500"
                  : "border-gray-600 hover:border-teal-500"
              } rounded-xl`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Sponsor Ekle
            </Button>
            <Button
              onClick={() => setActiveTab("manage")}
              variant={activeTab === "manage" ? "default" : "outline"}
              className={`${
                activeTab === "manage"
                  ? "bg-gradient-to-r from-teal-500 to-purple-500"
                  : "border-gray-600 hover:border-teal-500"
              } rounded-xl`}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Logo Yönetimi
            </Button>
          </div>

          {/* Current Sponsors Tab */}
          {activeTab === "current" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-teal-400 mb-1">
                    12
                  </div>
                  <div className="text-gray-400">Toplam Sponsor</div>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-amber-400 mb-1">
                    3
                  </div>
                  <div className="text-gray-400">Platinum</div>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-400 mb-1">5</div>
                  <div className="text-gray-400">Gold</div>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-400 mb-1">
                    4
                  </div>
                  <div className="text-gray-400">Silver</div>
                </div>
              </div>

              {/* Sponsors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockSponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    {/* Sponsor Logo */}
                    <div className="relative mb-4">
                      <div className="aspect-[3/2] bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-xl border border-gray-700 flex items-center justify-center">
                        <Building className="h-16 w-16 text-teal-400" />
                      </div>
                      <div
                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                          sponsor.tier === "Platinum"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : sponsor.tier === "Gold"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}
                      >
                        {sponsor.tier}
                      </div>
                      <div
                        className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                          sponsor.status === "active"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {sponsor.status === "active" ? "Aktif" : "Beklemede"}
                      </div>
                    </div>

                    {/* Sponsor Info */}
                    <h3 className="font-semibold text-gray-200 mb-2">
                      {sponsor.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {sponsor.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>Sponsor başlangıç: {sponsor.since}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-600 hover:border-teal-500"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Detay
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 hover:border-blue-500"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 hover:border-amber-500"
                      >
                        <Edit3 className="h-3 w-3" />
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
              </div>
            </div>
          )}

          {/* Add Sponsor Tab */}
          {activeTab === "add" && (
            <div className="max-w-3xl mx-auto">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 flex items-center justify-center mr-3">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  Yeni Sponsor Ekle
                </h2>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Sponsor Adı
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: TechCorp Inc."
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Sponsor Seviyesi
                      </label>
                      <select className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-teal-500 transition-colors">
                        <option value="">Seviye seçin</option>
                        <option value="platinum">Platinum</option>
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="bronze">Bronze</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        İletişim E-postası
                      </label>
                      <input
                        type="email"
                        placeholder="contact@sponsor.com"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Açıklama
                    </label>
                    <textarea
                      placeholder="Sponsor hakkında kısa bir açıklama..."
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors min-h-[100px] resize-none"
                    />
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Sponsor Logosu
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-teal-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="sponsor-logo"
                      />
                      <label htmlFor="sponsor-logo" className="cursor-pointer">
                        <div className="w-12 h-12 bg-gradient-to-r from-teal-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Upload className="h-6 w-6 text-teal-400" />
                        </div>
                        <p className="text-gray-400">
                          Logo yüklemek için tıklayın
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, SVG (Max 2MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-xl px-8 py-3 flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Sponsor Ekle
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 hover:border-gray-500 rounded-xl px-8 py-3"
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Logo Management Tab */}
          {activeTab === "manage" && (
            <div className="max-w-4xl mx-auto">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                      <Edit3 className="h-4 w-4 text-white" />
                    </div>
                    Logo Yönetimi
                  </h2>
                  <Button
                    onClick={() => setEditMode(!editMode)}
                    variant="outline"
                    className="border-gray-600 hover:border-teal-500"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {editMode ? "Düzenlemeyi Bitir" : "Düzenle"}
                  </Button>
                </div>

                {/* Logo Upload Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">
                          Logo {index + 1}
                        </h3>
                      </div>

                      <div className="aspect-[3/2] bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-xl border border-gray-700 flex items-center justify-center relative">
                        {logos[index] ? (
                          <Image
                            src={logos[index] as string}
                            alt={`Logo ${index + 1}`}
                            fill
                            className="object-contain rounded-xl"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="h-12 w-12 text-teal-400 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">
                              Logo {index + 1}
                            </p>
                          </div>
                        )}

                        {editMode && (
                          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleLogoUpload(index, e)}
                              className="hidden"
                              id={`logo-${index}`}
                            />
                            <label
                              htmlFor={`logo-${index}`}
                              className="cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              <Upload className="h-4 w-4 mr-2 inline" />
                              Değiştir
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {editMode && (
                  <div className="flex gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl px-8 py-3">
                      <Check className="h-4 w-4 mr-2" />
                      Değişiklikleri Kaydet
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 hover:border-red-500 text-red-400 rounded-xl px-8 py-3"
                    >
                      <X className="h-4 w-4 mr-2" />
                      İptal
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </RequireRole>
  );
}
