"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Brain,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

interface QuizProps {
  eventId: string;
  quizId: string;
  questions: Question[];
  passingScore: number;
  timeLimit: number; // in minutes
  onQuizComplete: (score: number, passed: boolean) => void;
}

export function QuizComponent({
  eventId,
  quizId,
  questions,
  passingScore,
  timeLimit,
  onQuizComplete,
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // convert to seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Debug: Log the questions to see if they're being passed correctly
  console.log("QuizComponent received:", {
    questionsCount: questions?.length || 0,
    questions: questions,
    currentQuestion: currentQuestion,
    timeLimit,
    passingScore,
  });

  // Timer countdown
  useEffect(() => {
    if (isStarted && timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isStarted) {
      handleQuizSubmit();
    }
  }, [timeLeft, isCompleted, isStarted]);

  const startQuiz = () => {
    setIsStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  const handleQuizSubmit = async () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    const passed = finalScore >= passingScore;
    setScore(finalScore);
    setIsCompleted(true);
    setShowResults(true);

    // Save quiz submission to backend
    try {
      const response = await fetch(
        "http://localhost:8000/api/quiz-submissions/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            quiz_id: parseInt(quizId), // Convert string to number
            answers: selectedAnswers.slice(0, questions.length), // Convert to proper array
          }),
        }
      );
      if (!response.ok) {
        console.error(
          "Quiz submission failed:",
          response.status,
          response.statusText
        );
        const errorData = await response.json();
        console.error("Error response:", errorData);
        // Still show results even if submission fails
      } else {
        const result = await response.json();
        console.log("Quiz submission successful:", result);
        // Optionally update the score with the backend calculated score
        if (result.score !== undefined) {
          setScore(result.score);
        }
      }
    } catch (error) {
      console.error("Failed to save quiz submission:", error);
    }

    onQuizComplete(finalScore, passed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Safety check for questions
  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Soru Bulunamadı
          </h3>
          <p className="text-red-600 dark:text-red-300">
            Bu sınav için henüz soru eklenmemiş.
          </p>
        </div>
      </div>
    );
  }

  // Quiz Start Screen
  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Brain className="w-12 h-12" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Sertifika Sınavı</h1>
          <p className="text-lg mb-6 opacity-90">
            Bu sınavı başarıyla geçerek etkinlik sertifikanızı alabilirsiniz
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{questions.length}</div>
              <div className="text-sm opacity-75">Soru Sayısı</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{timeLimit} dk</div>
              <div className="text-sm opacity-75">Süre</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{passingScore}%</div>
              <div className="text-sm opacity-75">Geçme Puanı</div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">📋 Sınav Kuralları:</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Sınav süreniz {timeLimit} dakikadır</li>
              <li>• Geçmek için en az %{passingScore} puan almalısınız</li>
              <li>• Her soruyu sadece bir kez cevaplayabilirsiniz</li>
              <li>• Sınav başladıktan sonra durdurulamaz</li>
            </ul>
          </div>

          <Button
            onClick={startQuiz}
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
          >
            Sınavı Başlat
          </Button>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div
            className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
              score >= passingScore
                ? "bg-green-500/20 border-2 border-green-500"
                : "bg-red-500/20 border-2 border-red-500"
            }`}
          >
            {score >= passingScore ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {score >= passingScore ? "Tebrikler! 🎉" : "Maalesef 😔"}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {score >= passingScore
              ? "Sınavı başarıyla geçtiniz ve sertifika almaya hak kazandınız!"
              : "Sınavı geçemediniz. Tekrar deneyebilirsiniz."}
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{score}%</div>
                <div className="text-gray-600 dark:text-gray-400">Puanınız</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {passingScore}%
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Geçme Puanı
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-teal-400">
                  {
                    selectedAnswers.filter(
                      (answer, index) =>
                        answer === questions[index]?.correct_answer
                    ).length
                  }
                  /{questions.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Doğru Cevap
                </div>
              </div>
            </div>
          </div>

          {score >= passingScore && (
            <Button
              onClick={() =>
                (window.location.href = `/certificate/generate/${eventId}`)
              }
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-purple-500 text-white px-8 py-3 hover:from-teal-600 hover:to-purple-600 transition-all flex items-center gap-2 mx-auto"
            >
              <Award className="w-5 h-5" />
              Sertifikamı Al
            </Button>
          )}

          {score < passingScore && (
            <Button
              onClick={() => window.location.reload()}
              size="lg"
              variant="outline"
              className="px-8 py-3"
            >
              Tekrar Dene
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Quiz Questions Screen
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8" />
            Sertifika Sınavı
          </h2>
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-1 ${
              timeLeft < 300
                ? "bg-red-500/20 border border-red-400"
                : "bg-white/20"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex justify-between text-sm opacity-90">
          <span>
            Soru {currentQuestion + 1} / {questions.length}
          </span>
          <span>Geçme Puanı: {passingScore}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mt-3">
          <div
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>{" "}
      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
        {questions[currentQuestion] ? (
          <>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {questions[currentQuestion].question}
            </h3>

            <div className="space-y-3">
              {questions[currentQuestion].options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-teal-500 bg-teal-500/20 text-teal-600 dark:text-teal-400"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? "border-teal-500 bg-teal-500"
                          : "border-gray-400 dark:border-gray-500"
                      }`}
                    >
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-300">
              Soru yüklenemedi (Soru #{currentQuestion + 1})
            </p>
          </div>
        )}
      </div>
      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          variant="outline"
          className="px-6 py-2"
        >
          Önceki
        </Button>

        <Button
          onClick={handleNextQuestion}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className="px-6 py-2 bg-teal-600 text-white hover:bg-teal-700"
        >
          {currentQuestion === questions.length - 1
            ? "Sınavı Bitir"
            : "Sonraki"}
        </Button>
      </div>
      {/* Time Warning */}
      {timeLeft < 300 && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Son 5 dakika!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizComponent;
