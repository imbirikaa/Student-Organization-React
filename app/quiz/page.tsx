"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  ChevronDown,
  Plus,
  Award,
  BookOpen,
  CheckCircle,
  X,
  Settings,
} from "lucide-react";
import { useState } from "react";

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctAnswer: 0,
  });
  const [requiredScore, setRequiredScore] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addQuestion = () => {
    if (
      currentQuestion.question &&
      currentQuestion.answers.some((answer) => answer.trim())
    ) {
      const newQuestion: Question = {
        id: Date.now(),
        question: currentQuestion.question,
        answers: currentQuestion.answers.filter((answer) => answer.trim()),
        correctAnswer: currentQuestion.correctAnswer,
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        question: "",
        answers: ["", "", "", ""],
        correctAnswer: 0,
      });
    }
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSubmit = async () => {
    if (questions.length === 0) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle success
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quiz Oluşturucu
            </h1>
            <p className="text-gray-400">
              Topluluğunuz için etkileşimli quiz oluşturun
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
            {/* Quiz Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-400" />
                Quiz Ayarları
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sertifika için Gereken Doğru Cevap Sayısı
                </label>
                <input
                  type="number"
                  value={requiredScore}
                  onChange={(e) => setRequiredScore(e.target.value)}
                  placeholder="Örn: 7"
                  className="w-full rounded-lg bg-gray-800 border border-gray-600 p-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Add Question Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                Yeni Soru Ekle
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Soru
                  </label>
                  <textarea
                    value={currentQuestion.question}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        question: e.target.value,
                      })
                    }
                    placeholder="Sorunuzu yazınız..."
                    rows={3}
                    className="w-full rounded-lg bg-gray-700 border border-gray-600 p-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.answers.map((answer, index) => (
                    <div key={index} className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {index + 1}. Cevap{" "}
                        {index === currentQuestion.correctAnswer && "(Doğru)"}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => {
                            const newAnswers = [...currentQuestion.answers];
                            newAnswers[index] = e.target.value;
                            setCurrentQuestion({
                              ...currentQuestion,
                              answers: newAnswers,
                            });
                          }}
                          placeholder={`${index + 1}. seçenek`}
                          className={`w-full rounded-lg bg-gray-700 border p-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                            index === currentQuestion.correctAnswer
                              ? "border-green-500 focus:ring-green-500"
                              : "border-gray-600 focus:ring-blue-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              correctAnswer: index,
                            })
                          }
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                            index === currentQuestion.correctAnswer
                              ? "text-green-400 bg-green-500/20"
                              : "text-gray-500 hover:text-green-400"
                          }`}
                          title="Doğru cevap olarak işaretle"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={addQuestion}
                  disabled={
                    !currentQuestion.question ||
                    !currentQuestion.answers.some((a) => a.trim())
                  }
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg py-3 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Soruyu Ekle
                </Button>
              </div>

              {/* Questions List */}
              {questions.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-green-400" />
                    Eklenen Sorular ({questions.length})
                  </h3>
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="bg-gray-800/50 rounded-lg p-4 border border-gray-600"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-white flex-1">
                            {index + 1}. {question.question}
                          </h4>
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-400 hover:text-red-300 ml-4"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.answers.map((answer, answerIndex) => (
                            <div
                              key={answerIndex}
                              className={`text-sm p-2 rounded ${
                                answerIndex === question.correctAnswer
                                  ? "bg-green-500/20 text-green-300 border border-green-500/50"
                                  : "bg-gray-700 text-gray-300"
                              }`}
                            >
                              {String.fromCharCode(65 + answerIndex)}) {answer}
                              {answerIndex === question.correctAnswer && (
                                <CheckCircle className="w-4 h-4 inline ml-2" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={questions.length === 0 || isLoading}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl text-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Award className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? "Quiz Oluşturuluyor..." : "Quiz'i Kaydet"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
