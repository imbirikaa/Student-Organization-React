"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  Brain,
  Clock,
  Target,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Question {
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

interface QuizData {
  event_id: string;
  title: string;
  description: string;
  time_limit: number; // minutes
  passing_score: number; // percentage
  questions: Question[];
}

export default function QuizCreatePage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [quizData, setQuizData] = useState<QuizData>({
    event_id: "",
    title: "",
    description: "",
    time_limit: 30, // minutes
    passing_score: 70, // percentage
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: "",
    options: ["", "", "", ""],
    correct_answer: 0,
    explanation: "",
  });

  const getCookieValue = (name: string): string => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()!.split(";").shift()!;
      return decodeURIComponent(cookieValue);
    }
    return "";
  };

  // Fetch available events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });
        const token = getCookieValue("XSRF-TOKEN");
        const response = await fetch("http://localhost:8000/api/admin/events", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
        } else {
          setEvents([]);
        }
      } catch (error) {
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const addQuestion = () => {
    if (
      currentQuestion.question.trim() &&
      currentQuestion.options.every((opt) => opt.trim())
    ) {
      setQuizData((prev) => ({
        ...prev,
        questions: [...prev.questions, currentQuestion],
      }));

      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correct_answer: 0,
        explanation: "",
      });
    }
  };

  const removeQuestion = (index: number) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion((prev) => ({ ...prev, options: newOptions }));
  };
  const saveQuiz = async () => {
    if (
      !quizData.event_id ||
      !quizData.title ||
      quizData.questions.length === 0
    ) {
      setError(
        "Lütfen tüm gerekli alanları doldurun ve en az bir soru ekleyin."
      );
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Transform the data to match backend expectations
      const transformedQuizData = {
        ...quizData,
        questions: quizData.questions.map((question) => ({
          question: question.question,
          answers: question.options.map((option, index) => ({
            answer: option,
            is_correct: index === question.correct_answer,
          })),
        })),
      };

      const response = await fetch(
        "http://localhost:8000/api/quizzes/with-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(transformedQuizData),
        }
      );

      if (response.ok) {
        setSuccess("Quiz başarıyla oluşturuldu!");
        setTimeout(() => {
          router.push("/admin/quizzes");
        }, 2000);
      } else {
        throw new Error("Quiz oluşturulurken bir hata oluştu.");
      }
    } catch (error: any) {
      setError(error.message || "Quiz oluşturma hatası");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Sertifika Sınavı Oluştur
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Etkinlik katılımcıları için sertifika almak üzere sınav
                oluşturun
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Quiz Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Sınav Ayarları
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Etkinlik Seçin *
              </label>
              {isLoading ? (
                <div className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
                  Yükleniyor...
                </div>
              ) : (
                <select
                  value={quizData.event_id}
                  onChange={(e) =>
                    setQuizData((prev) => ({
                      ...prev,
                      event_id: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Etkinlik seçin...</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.event}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Sınav Başlığı *
              </label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) =>
                  setQuizData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Örn: JavaScript Temel Bilgiler Sınavı"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              {" "}
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-2">
                <Clock className="w-4 h-4" />
                Süre (Dakika)
              </label>
              <input
                type="number"
                value={quizData.time_limit}
                onChange={(e) =>
                  setQuizData((prev) => ({
                    ...prev,
                    time_limit: parseInt(e.target.value),
                  }))
                }
                min="5"
                max="180"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              {" "}
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-2">
                <Target className="w-4 h-4" />
                Geçme Puanı (%)
              </label>
              <input
                type="number"
                value={quizData.passing_score}
                onChange={(e) =>
                  setQuizData((prev) => ({
                    ...prev,
                    passing_score: parseInt(e.target.value),
                  }))
                }
                min="50"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Sınav Açıklaması
            </label>
            <textarea
              value={quizData.description}
              onChange={(e) =>
                setQuizData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Sınav hakkında katılımcılara bilgi verin..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Question Creation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Yeni Soru Ekle
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Soru *
              </label>
              <textarea
                value={currentQuestion.question}
                onChange={(e) =>
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    question: e.target.value,
                  }))
                }
                placeholder="Sorunuzu buraya yazın..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Cevap Seçenekleri *
              </label>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={currentQuestion.correct_answer === index}
                      onChange={() =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          correct_answer: index,
                        }))
                      }
                      className="w-4 h-4 text-green-600"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Seçenek ${String.fromCharCode(65 + index)}`}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                ✓ Doğru cevabı seçmek için sol taraftaki radio butonları
                kullanın
              </p>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Açıklama (Opsiyonel)
              </label>
              <textarea
                value={currentQuestion.explanation}
                onChange={(e) =>
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    explanation: e.target.value,
                  }))
                }
                placeholder="Doğru cevap hakkında açıklama..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <Button
              onClick={addQuestion}
              disabled={
                !currentQuestion.question.trim() ||
                !currentQuestion.options.every((opt) => opt.trim())
              }
              className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Soru Ekle
            </Button>
          </div>
        </div>

        {/* Questions List */}
        {quizData.questions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Eklenen Sorular ({quizData.questions.length})
            </h2>

            <div className="space-y-4">
              {quizData.questions.map((question, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Soru {index + 1}
                    </h3>
                    <Button
                      onClick={() => removeQuestion(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {question.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`px-3 py-2 rounded text-sm ${
                          optIndex === question.correct_answer
                            ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}) {option}
                        {optIndex === question.correct_answer && " ✓"}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 dark:text-green-200">
                {success}
              </span>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={saveQuiz}
            disabled={isSaving || quizData.questions.length === 0}
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-purple-600 text-white px-8 py-3 hover:from-teal-700 hover:to-purple-700 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Kaydediliyor..." : "Sınavı Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
