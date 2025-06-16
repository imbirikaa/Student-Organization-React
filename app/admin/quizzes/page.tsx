"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Search,
  Download,
  Trash2,
  Users,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Award,
  Target,
  Calendar,
  Eye,
  Filter,
  RefreshCw,
  Star,
  Activity,
  MapPin,
  Building,
} from "lucide-react";

interface QuizStats {
  total_questions: number;
  total_submissions: number;
  passed_submissions: number;
  pass_rate: number;
  average_score: number;
}

interface Quiz {
  id: number;
  title?: string;
  description: string;
  event: {
    id: number;
    title: string;
    community: string;
    start_date: string;
    location: string;
  };
  settings: {
    passing_score: number;
    time_limit: number;
    required_correct_answers: number;
  };
  statistics: QuizStats;
  created_at: string;
  updated_at: string;
}

interface QuizDetails {
  quiz: {
    id: number;
    title: string;
    description: string;
    passing_score: number;
    time_limit: number;
    created_at: string;
  };
  event: {
    id: number;
    title: string;
    community: string;
    start_date: string;
    location: string;
  };
  questions: Array<{
    id: number;
    question: string;
    explanation: string;
    answers: Array<{
      id: number;
      answer: string;
      is_correct: boolean;
    }>;
  }>;
  submissions: Array<{
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    score: number;
    passed: boolean;
    submitted_at: string;
    time_taken: number;
  }>;
  statistics: QuizStats & {
    score_distribution: {
      "0-25": number;
      "26-50": number;
      "51-75": number;
      "76-100": number;
    };
  };
}

interface Analytics {
  overview: {
    total_quizzes: number;
    total_submissions: number;
    passed_submissions: number;
    overall_pass_rate: number;
    average_score: number;
  };
  top_quizzes: Array<{
    id: number;
    title: string;
    event_title: string;
    submissions: number;
    pass_rate: number;
  }>;
  recent_activity: Array<{
    user_name: string;
    quiz_title: string;
    event_title: string;
    score: number;
    passed: boolean;
    submitted_at: string;
  }>;
  monthly_stats: Array<{
    year: number;
    month: number;
    total_submissions: number;
    passed_submissions: number;
    average_score: number;
  }>;
}

export default function AdminQuizManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDetails | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchQuizzes();
    fetchAnalytics();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/quizzes", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizDetails = async (quizId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/quizzes/${quizId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedQuiz(data);
      }
    } catch (error) {
      console.error("Failed to fetch quiz details:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/quizzes/analytics/dashboard",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const exportQuizData = async (quizId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/quizzes/${quizId}/export`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `quiz-${quizId}-export.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to export quiz data:", error);
    }
  };

  const deleteSubmission = async (submissionId: number) => {
    if (!confirm("Bu submission'ı silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/quiz-submissions/${submissionId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        if (selectedQuiz) {
          fetchQuizDetails(selectedQuiz.quiz.id);
        }
        fetchAnalytics();
      }
    } catch (error) {
      console.error("Failed to delete submission:", error);
    }
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      (quiz.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.event.community.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 dark:from-gray-950 dark:via-slate-950 dark:to-blue-950">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600/30 opacity-25"></div>
          </div>
          <p className="text-gray-300 font-medium">
            Quiz verileriniz yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 dark:from-gray-950 dark:via-slate-950 dark:to-blue-950">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl"></div>
          <div className="relative bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 dark:border-gray-600/50 rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Quiz Yönetim Paneli
                    </h1>
                    <p className="text-gray-300 text-lg">
                      Sistemdeki tüm quizleri yönetin ve detaylı istatistikleri
                      görüntüleyin
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="lg"
                  className="bg-gray-700/50 hover:bg-gray-600/50 border-gray-600 hover:border-gray-500 text-gray-200 hover:text-white transition-all duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Rapor İndir
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 dark:border-gray-600/50 rounded-2xl p-2 shadow-lg">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold transition-all duration-200 text-gray-300 hover:text-white"
              >
                <Activity className="h-4 w-4 mr-2" />
                Genel Bakış
              </TabsTrigger>
              <TabsTrigger
                value="quizzes"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold transition-all duration-200 text-gray-300 hover:text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Quiz Listesi
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold transition-all duration-200 text-gray-300 hover:text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Quiz Detayları
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold transition-all duration-200 text-gray-300 hover:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analitik
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="space-y-8 mt-8">
            {analytics && (
              <>
                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {" "}
                  <Card className="group hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700 shadow-lg hover:shadow-xl backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-semibold text-blue-300 uppercase tracking-wide">
                        Toplam Quiz
                      </CardTitle>
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-200">
                        {analytics.overview.total_quizzes}
                      </div>
                      <p className="text-xs text-blue-400 mt-1">
                        Aktif quizler
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="group hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700 shadow-lg hover:shadow-xl backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                        Toplam Gönderim
                      </CardTitle>
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-800">
                        {analytics.overview.total_submissions}
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Tüm denemeler
                      </p>
                    </CardContent>
                  </Card>{" "}
                  <Card className="group hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 border-emerald-700 shadow-lg hover:shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-semibold text-emerald-300 uppercase tracking-wide">
                        Başarılı
                      </CardTitle>
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-emerald-200">
                        {analytics.overview.passed_submissions}
                      </div>
                      <p className="text-xs text-emerald-400 mt-1">
                        Geçen öğrenci
                      </p>
                    </CardContent>
                  </Card>{" "}
                  <Card className="group hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700 shadow-lg hover:shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-semibold text-purple-300 uppercase tracking-wide">
                        Başarı Oranı
                      </CardTitle>
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-200">
                        {analytics.overview.overall_pass_rate.toFixed(1)}%
                      </div>
                      <p className="text-xs text-purple-400 mt-1">
                        Genel başarı
                      </p>
                    </CardContent>
                  </Card>{" "}
                  <Card className="group hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-700 shadow-lg hover:shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-semibold text-orange-300 uppercase tracking-wide">
                        Ortalama Puan
                      </CardTitle>
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-200">
                        {analytics.overview.average_score.toFixed(1)}
                      </div>
                      <p className="text-xs text-orange-400 mt-1">
                        Puan ortalaması
                      </p>
                    </CardContent>
                  </Card>
                </div>{" "}
                {/* Enhanced Charts and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2 text-gray-200">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span>En Popüler Quizler</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {analytics.top_quizzes.map((quiz, index) => (
                          <div
                            key={quiz.id}
                            className="group hover:bg-gray-700/50 p-3 rounded-lg transition-colors duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                                      {quiz.title}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      {quiz.event_title}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <div className="bg-blue-800/50 text-blue-300 px-2 py-1 rounded-full text-xs font-semibold">
                                    {quiz.submissions} deneme
                                  </div>
                                  <div className="bg-green-800/50 text-green-300 px-2 py-1 rounded-full text-xs font-semibold">
                                    {quiz.pass_rate}% başarı
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2 text-gray-200">
                        <Activity className="h-5 w-5 text-green-400" />
                        <span>Son Aktiviteler</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {analytics.recent_activity.map((activity, index) => (
                          <div
                            key={index}
                            className="group hover:bg-gray-700/50 p-3 rounded-lg transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                {activity.passed ? (
                                  <div className="w-10 h-10 bg-green-800/50 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 bg-red-800/50 rounded-full flex items-center justify-center">
                                    <XCircle className="h-5 w-5 text-red-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                                  {activity.user_name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {activity.quiz_title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {activity.event_title}
                                </p>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    activity.passed
                                      ? "bg-green-800/50 text-green-300"
                                      : "bg-red-800/50 text-red-300"
                                  }`}
                                >
                                  {activity.score}%
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(
                                    activity.submitted_at
                                  ).toLocaleDateString("tr-TR")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>{" "}
          <TabsContent value="quizzes" className="space-y-8 mt-8">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-200 mb-2">
                    Quiz Listesi
                  </h3>
                  <p className="text-gray-400">
                    Tüm quizleri görüntüleyin ve yönetin
                  </p>
                </div>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Quiz, etkinlik veya topluluk ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 bg-gray-700/50 border-gray-600 focus:border-blue-400 rounded-xl shadow-sm text-gray-200 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <Card className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/50 hover:to-gray-500/50 border-b border-gray-600">
                        <TableHead className="font-semibold text-gray-300 px-6 py-4">
                          Quiz Bilgileri
                        </TableHead>
                        <TableHead className="font-semibold text-gray-300 px-6 py-4">
                          Etkinlik
                        </TableHead>
                        <TableHead className="font-semibold text-gray-300 px-6 py-4">
                          Topluluk
                        </TableHead>
                        <TableHead className="font-semibold text-gray-300 px-6 py-4 text-center">
                          Sorular
                        </TableHead>
                        <TableHead className="font-semibold text-gray-300 px-6 py-4 text-center">
                          Denemeler
                        </TableHead>
                        <TableHead className="font-semibold text-gray-300 px-6 py-4 text-center">
                          Başarı Oranı
                        </TableHead>
                        <TableHead className="font-semibold text-gray-300 px-6 py-4 text-center">
                          Ort. Puan
                        </TableHead>
                        <TableHead className="font-semibold text-gray-300 px-6 py-4 text-center">
                          İşlemler
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuizzes.map((quiz, index) => (
                        <TableRow
                          key={quiz.id}
                          className="group hover:bg-gray-700/30 transition-all duration-200 border-b border-gray-700/50"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {index + 1}
                                </div>
                                <p className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                                  {quiz.title || `Quiz ${quiz.id}`}
                                </p>
                              </div>
                              <p className="text-sm text-gray-400 ml-10 max-w-xs truncate">
                                {quiz.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-blue-400" />
                                <p className="font-medium text-gray-200">
                                  {quiz.event.title}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 ml-6">
                                <MapPin className="h-3 w-3 text-gray-500" />
                                <p className="text-sm text-gray-400">
                                  {quiz.event.location}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-purple-400" />
                              <span className="font-medium text-gray-200">
                                {quiz.event.community}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center">
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-800/50 text-blue-300 rounded-full font-bold">
                              {quiz.statistics.total_questions}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center">
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-800/50 text-green-300 rounded-full font-bold">
                              {quiz.statistics.total_submissions}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center">
                            <Badge
                              variant={
                                quiz.statistics.pass_rate >= 70
                                  ? "default"
                                  : "destructive"
                              }
                              className={`px-3 py-1 text-sm font-semibold ${
                                quiz.statistics.pass_rate >= 70
                                  ? "bg-green-800/50 text-green-300 hover:bg-green-700/50"
                                  : "bg-red-800/50 text-red-300 hover:bg-red-700/50"
                              }`}
                            >
                              {quiz.statistics.pass_rate.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center">
                            <div className="font-semibold text-gray-200">
                              {quiz.statistics.average_score.toFixed(1)}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex justify-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  fetchQuizDetails(quiz.id);
                                  setActiveTab("details");
                                }}
                                className="bg-blue-800/30 hover:bg-blue-700/50 border-blue-600 text-blue-300 hover:text-blue-200 transition-all duration-200"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Detay
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => exportQuizData(quiz.id)}
                                className="bg-green-800/30 hover:bg-green-700/50 border-green-600 text-green-300 hover:text-green-200 transition-all duration-200"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>{" "}
          <TabsContent value="details" className="space-y-8 mt-8">
            {selectedQuiz ? (
              <>
                {" "}
                <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-200">
                          {selectedQuiz.quiz.title}
                        </h2>
                        <p className="text-lg text-gray-400">
                          {selectedQuiz.event.title} -{" "}
                          {selectedQuiz.event.community}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => exportQuizData(selectedQuiz.quiz.id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Quiz
                    </Button>
                  </div>
                </div>{" "}
                {/* Enhanced Quiz Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-blue-300">
                        <FileText className="h-5 w-5" />
                        <span>Quiz Bilgileri</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-400 font-medium">
                          Geçme Puanı:
                        </span>
                        <span className="font-bold text-blue-200">
                          {selectedQuiz.quiz.passing_score}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-400 font-medium">
                          Süre Limiti:
                        </span>
                        <span className="font-bold text-blue-200">
                          {selectedQuiz.quiz.time_limit || "Sınırsız"} dk
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-400 font-medium">
                          Oluşturulma:
                        </span>
                        <span className="font-bold text-blue-200">
                          {new Date(
                            selectedQuiz.quiz.created_at
                          ).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-green-300">
                        <BarChart3 className="h-5 w-5" />
                        <span>İstatistikler</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-400 font-medium">
                          Toplam Soru:
                        </span>
                        <span className="font-bold text-green-200">
                          {selectedQuiz.statistics.total_questions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400 font-medium">
                          Toplam Deneme:
                        </span>
                        <span className="font-bold text-green-200">
                          {selectedQuiz.statistics.total_submissions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400 font-medium">
                          Başarılı:
                        </span>
                        <span className="font-bold text-green-200">
                          {selectedQuiz.statistics.passed_submissions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400 font-medium">
                          Ortalama:
                        </span>
                        <span className="font-bold text-green-200">
                          {selectedQuiz.statistics.average_score.toFixed(1)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-purple-300">
                        <Target className="h-5 w-5" />
                        <span>Puan Dağılımı</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "0-25%",
                                value:
                                  selectedQuiz.statistics.score_distribution[
                                    "0-25"
                                  ],
                                color: "#ef4444",
                              },
                              {
                                name: "26-50%",
                                value:
                                  selectedQuiz.statistics.score_distribution[
                                    "26-50"
                                  ],
                                color: "#f97316",
                              },
                              {
                                name: "51-75%",
                                value:
                                  selectedQuiz.statistics.score_distribution[
                                    "51-75"
                                  ],
                                color: "#eab308",
                              },
                              {
                                name: "76-100%",
                                value:
                                  selectedQuiz.statistics.score_distribution[
                                    "76-100"
                                  ],
                                color: "#22c55e",
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={50}
                            dataKey="value"
                          >
                            {["#ef4444", "#f97316", "#eab308", "#22c55e"].map(
                              (color, index) => (
                                <Cell key={index} fill={color} />
                              )
                            )}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>{" "}
                {/* Enhanced Questions and Submissions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2 text-gray-200">
                        <FileText className="h-5 w-5 text-blue-400" />
                        <span>Sorular ({selectedQuiz.questions.length})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                        {selectedQuiz.questions.map((question, index) => (
                          <div
                            key={question.id}
                            className="group hover:bg-gray-700/30 border border-gray-600 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-200"
                          >
                            <div className="flex items-start space-x-3 mb-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors mb-2">
                                  {question.question}
                                </h5>
                                {question.explanation && (
                                  <p className="text-sm text-gray-400 italic mb-3 bg-blue-900/20 p-2 rounded-lg">
                                    💡 {question.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2 ml-11">
                              {question.answers.map((answer, answerIndex) => (
                                <div
                                  key={answer.id}
                                  className={`text-sm p-3 rounded-lg border transition-all duration-200 ${
                                    answer.is_correct
                                      ? "bg-green-900/30 border-green-600/50 text-green-300 font-medium"
                                      : "bg-gray-700/30 border-gray-600/50 text-gray-300 hover:bg-gray-600/30"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>
                                      <strong>
                                        {String.fromCharCode(65 + answerIndex)}.
                                      </strong>{" "}
                                      {answer.answer}
                                    </span>
                                    {answer.is_correct && (
                                      <CheckCircle className="h-4 w-4 text-green-400" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2 text-gray-200">
                        <Users className="h-5 w-5 text-green-400" />
                        <span>
                          Denemeler ({selectedQuiz.submissions.length})
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {selectedQuiz.submissions.map((submission) => (
                          <div
                            key={submission.id}
                            className="group hover:bg-gray-700/30 border border-gray-600 hover:border-green-500/50 rounded-xl p-4 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    submission.passed
                                      ? "bg-green-800/50 text-green-400"
                                      : "bg-red-800/50 text-red-400"
                                  }`}
                                >
                                  {submission.passed ? (
                                    <CheckCircle className="h-5 w-5" />
                                  ) : (
                                    <XCircle className="h-5 w-5" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-200 group-hover:text-green-400 transition-colors">
                                    {submission.user.name}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {submission.user.email}
                                  </p>
                                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {new Date(
                                        submission.submitted_at
                                      ).toLocaleString("tr-TR")}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="text-right space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={
                                      submission.passed
                                        ? "default"
                                        : "destructive"
                                    }
                                    className={`px-3 py-1 text-sm font-semibold ${
                                      submission.passed
                                        ? "bg-green-800/50 text-green-300"
                                        : "bg-red-800/50 text-red-300"
                                    }`}
                                  >
                                    {submission.score}%
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{submission.time_taken} dk</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    deleteSubmission(submission.id)
                                  }
                                  className="hover:bg-red-800/30 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Alert className="bg-gray-800/50 border-gray-700 text-gray-300">
                <AlertDescription>
                  Quiz detaylarını görüntülemek için quiz listesinden bir quiz
                  seçin.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>{" "}
          <TabsContent value="analytics" className="space-y-8 mt-8">
            {analytics && (
              <>
                {" "}
                <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-200">
                        Detaylı Analitik
                      </h3>
                      <p className="text-gray-400">
                        Quiz performansı ve trend analizi
                      </p>
                    </div>
                  </div>
                </div>
                <Card className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardHeader className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2 text-gray-200">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      <span>Aylık Submission Trendi</span>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Aylık bazda toplam ve başarılı submission sayıları
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={analytics.monthly_stats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis
                          dataKey={(data) =>
                            `${data.year}-${String(data.month).padStart(
                              2,
                              "0"
                            )}`
                          }
                          stroke="#6b7280"
                          fontSize={12}
                        />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="total_submissions"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          name="Toplam Submission"
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                          activeDot={{
                            r: 8,
                            stroke: "#3b82f6",
                            strokeWidth: 2,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="passed_submissions"
                          stroke="#10b981"
                          strokeWidth={3}
                          name="Başarılı Submission"
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                          activeDot={{
                            r: 8,
                            stroke: "#10b981",
                            strokeWidth: 2,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>{" "}
                <Card className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardHeader className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2 text-gray-200">
                      <Award className="h-5 w-5 text-green-400" />
                      <span>Quiz Başarı Oranları</span>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Her quiz için başarı oranı karşılaştırması
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={analytics.top_quizzes}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis
                          dataKey="title"
                          stroke="#6b7280"
                          fontSize={12}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="pass_rate"
                          name="Başarı Oranı %"
                          radius={[4, 4, 0, 0]}
                        >
                          {analytics.top_quizzes.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.pass_rate >= 70
                                  ? "#10b981"
                                  : entry.pass_rate >= 50
                                  ? "#f59e0b"
                                  : "#ef4444"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
