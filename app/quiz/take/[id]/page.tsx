"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizComponent from "@/components/quiz-component";
import { LoadingSpinner } from "@/components/ui/loading";
import { AlertTriangle, CheckCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizData {
  id: string;
  title: string;
  description: string;
  time_limit: number;
  passing_score: number;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correct_answer: number;
    explanation?: string;
  }>;
}

export default function QuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasAlreadyTaken, setHasAlreadyTaken] = useState(false);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [passed, setPassed] = useState(false);
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        console.log("Fetching quiz data for event ID:", eventId);

        // Check if user has already taken the quiz
        const submissionResponse = await fetch(
          `http://localhost:8000/api/quiz-submissions?event_id=${eventId}`,
          {
            credentials: "include",
          }
        );

        if (submissionResponse.ok) {
          const submissionData = await submissionResponse.json();
          console.log("Submission data:", submissionData);
          if (submissionData.data && submissionData.data.length > 0) {
            const latestSubmission = submissionData.data[0];
            setHasAlreadyTaken(true);
            setPreviousScore(latestSubmission.score);
            if (latestSubmission.passed) {
              setPassed(true);
            }
          }
        }

        // Fetch quiz data
        console.log("Fetching quiz for event:", eventId);
        const quizResponse = await fetch(
          `http://localhost:8000/api/events/${eventId}/quiz`,
          {
            credentials: "include",
          }
        );

        console.log("Quiz response status:", quizResponse.status);

        if (quizResponse.ok) {
          const quiz = await quizResponse.json();
          console.log("Fetched quiz data:", quiz);
          console.log("Questions count:", quiz.questions?.length || 0);
          console.log("First question:", quiz.questions?.[0]);
          setQuizData(quiz);
        } else if (quizResponse.status === 404) {
          setError("Bu etkinlik için sınav bulunmamaktadır.");
        } else {
          console.error(
            "Quiz fetch failed:",
            quizResponse.status,
            quizResponse.statusText
          );
          setError("Sınav verilerine erişilemiyor.");
        }
      } catch (error) {
        console.error("Failed to fetch quiz data:", error);
        setError("Sınav yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchQuizData();
    }
  }, [eventId]);

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizCompleted(true);
    setFinalScore(score);
    setPassed(passed);
  };

  const goToCertificate = () => {
    router.push(`/certificate/generate/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Sınav yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sınav Bulunamadı
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  // Show completion message
  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div
            className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
              passed
                ? "bg-green-500/20 border-2 border-green-500"
                : "bg-red-500/20 border-2 border-red-500"
            }`}
          >
            {passed ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-red-500" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {passed ? "Tebrikler! 🎉" : "Maalesef 😔"}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {passed
              ? "Sınavı başarıyla geçtiniz ve sertifika almaya hak kazandınız!"
              : "Sınavı geçemediniz. Daha sonra tekrar deneyebilirsiniz."}
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {finalScore}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Final Puanınız
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            {passed && (
              <Button
                onClick={goToCertificate}
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:from-teal-600 hover:to-purple-600 flex items-center gap-2"
              >
                <Award className="w-5 h-5" />
                Sertifikamı Al
              </Button>
            )}

            <Button onClick={() => router.back()} size="lg" variant="outline">
              Etkinliklere Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show already taken message
  if (hasAlreadyTaken && passed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-500/20 border-2 border-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sınavı Zaten Geçtiniz! 🎉
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bu etkinlik için sınavı başarıyla tamamladınız.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div className="text-xl font-bold text-green-500">
              {previousScore}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Önceki Puanınız
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={goToCertificate}
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:from-teal-600 hover:to-purple-600 flex items-center gap-2"
            >
              <Award className="w-5 h-5" />
              Sertifikamı Görüntüle
            </Button>

            <Button onClick={() => router.back()} size="lg" variant="outline">
              Geri Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sınav Verisi Bulunamadı
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sınav verileri yüklenemedi.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Quiz Header Information */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {quizData.title || "Etkinlik Sınavı"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {quizData.description ||
                  "Sertifika almak için bu sınavı tamamlayın"}
              </p>
            </div>
            <div className="flex gap-4 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 min-w-[80px]">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {quizData.questions?.length || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Soru
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 min-w-[80px]">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {quizData.time_limit || 0} dk
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Süre
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 min-w-[80px]">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {quizData.passing_score || 0}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Geçme
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuizComponent
        eventId={eventId}
        quizId={quizData.id}
        questions={quizData.questions}
        passingScore={quizData.passing_score}
        timeLimit={quizData.time_limit}
        onQuizComplete={handleQuizComplete}
      />
    </div>
  );
}
