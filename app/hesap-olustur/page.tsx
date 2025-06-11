"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import data from "./data.js";

export default function AccountCreationPage() {
  const router = useRouter();
  const [selectedUniversityId, setSelectedUniversityId] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nickname: "",
    password: "",
    password_confirmation: "",
    university_id: "",
    department_id: "",
    birth_day: "",
    birth_month: "",
    birth_year: "",
    birth_date: "",
    kvkk: false,
    privacy: true,
    terms: false,
  });
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }

  const handleChange = (e: ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      const { birth_day, birth_month, birth_year } = {
        ...updated,
      };

      if (birth_day && birth_month && birth_year) {
        const formattedMonth = birth_month.toString().padStart(2, "0");
        const formattedDay = birth_day.toString().padStart(2, "0");
        updated.birth_date = `${birth_year}-${formattedMonth}-${formattedDay}`;
      }

      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      const res = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Response data:", data);
      if (res.ok) {
        toast.success(
          "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz..."
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        toast.error("Bir hata oluştu!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner ads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[1, 2].map((_, idx) => (
          <div
            key={idx}
            className="bg-blue-600 rounded-lg overflow-hidden h-20 flex items-center"
          >
            <div className="w-1/4 flex justify-center">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Reeder"
                width={80}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="w-3/4 flex justify-end pr-4">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Kampüs Sözlük"
                width={80}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      <h1 className="text-2xl text-center font-bold mb-6">Hesap Oluştur</h1>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <input
                name="first_name"
                onChange={handleChange}
                placeholder="Adınız"
                className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              {errors.first_name && (
                <div className="text-red-500 text-sm ml-2 mt-3 -mb-2">
                  {errors.first_name[0]}
                </div>
              )}
            </div>
            <div>
              <input
                name="last_name"
                onChange={handleChange}
                placeholder="Soyadınız"
                className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              {errors.last_name && (
                <div className="text-red-500 text-sm ml-2 mt-3 -mb-2">
                  {errors.last_name[0]}
                </div>
              )}
            </div>
          </div>
          <input
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="E-posta"
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500 mb-6"
          />
          {errors.email && (
            <div className="text-red-500 text-sm ml-2 -mt-3 mb-4">
              {errors.email[0]}
            </div>
          )}
          <input
            name="phone"
            onChange={handleChange}
            type="tel"
            placeholder="Telefon numarası"
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500 mb-6"
          />
          {errors.phone && (
            <div className="text-red-500 text-sm ml-2 -mt-3 mb-4">
              {errors.phone[0]}
            </div>
          )}
          <input
            name="nickname"
            onChange={handleChange}
            placeholder="Kullanıcı adı"
            className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500 mb-6"
          />
          {errors.nickname && (
            <div className="text-red-500 text-sm ml-2 -mt-3 mb-4">
              {errors.nickname[0]}
            </div>
          )}

          {/* Password fields */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <input
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="Parola"
                className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              {errors.password && (
                <div className="text-red-500 text-sm ml-2 mt-3 -mb-4">
                  {errors.password[0]}
                </div>
              )}
            </div>
            <div>
              <input
                name="password_confirmation"
                onChange={handleChange}
                type="password"
                placeholder="Parola tekrarı"
                className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              {errors.password_confirmation && (
                <div className="text-red-500 text-sm ml-2 mt-3 -mb-4">
                  {errors.password_confirmation[0]}
                </div>
              )}
            </div>
          </div>

          {/* Date of birth section */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <select
              name="birth_day"
              onChange={handleChange}
              className="form-select w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">Gün</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <select
              name="birth_month"
              onChange={handleChange}
              className="form-select w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">Ay</option>
              {[
                "Ocak",
                "Şubat",
                "Mart",
                "Nisan",
                "Mayıs",
                "Haziran",
                "Temmuz",
                "Ağustos",
                "Eylül",
                "Ekim",
                "Kasım",
                "Aralık",
              ].map((m, i) => (
                <option key={i + 1} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              name="birth_year"
              onChange={handleChange}
              className="form-select w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">Yıl</option>
              {Array.from({ length: 100 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          {/* University dropdown */}
          <div className="mb-6">
            <select
              className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              onChange={(e) => {
                const universityId = e.target.value;
                setSelectedUniversityId(universityId);
                setFormData((prev) => ({
                  ...prev,
                  university_id: universityId,
                  department_id: "",
                }));
              }}
            >
              <option value="">Üniversite seç</option>
              {data.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name}
                </option>
              ))}
            </select>
          </div>
          {errors.university_id && (
            <div className="text-red-500 text-sm ml-2 -mt-3 mb-4">
              {errors.university_id[0]}
            </div>
          )}

          {/* Department dropdown */}
          {selectedUniversityId && (
            <div className="mb-6">
              <select
                className="w-full rounded-lg bg-gray-900 border border-blue-900 p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department_id: e.target.value,
                  }))
                }
              >
                <option value="">Bölüm seç</option>
                {data
                  .find((uni) => uni.id.toString() === selectedUniversityId)
                  ?.programs.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          {errors.department_id && (
            <div className="text-red-500 text-sm ml-2 -mt-3 mb-4">
              {errors.department_id[0]}
            </div>
          )}

          {/* Checkbox section */}

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">DAHA SONRA SEÇ</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  id="kvkk"
                  name="kvkk"
                  onChange={handleChange}
                  className="mr-2 h-5 w-5 rounded border-gray-700 bg-gray-900"
                />
                <label htmlFor="kvkk" className="text-sm">
                  KVKK AYDINLATMA METNİ
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  id="privacy"
                  name="privacy"
                  onChange={handleChange}
                  className="mr-2 h-5 w-5 rounded border-gray-700 bg-gray-900"
                />
                <label htmlFor="privacy" className="text-sm">
                  GİZLİLİK POLİTİKALARI
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  id="terms"
                  name="terms"
                  onChange={handleChange}
                  className="mr-2 h-5 w-5 rounded border-gray-700 bg-gray-900"
                />
                <label htmlFor="terms" className="text-sm">
                  KULLANICI SÖZLEŞMESİNİ
                </label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded-lg"
          >
            DEVAM ET
          </Button>
        </form>
      </div>
    </div>
  );
}
