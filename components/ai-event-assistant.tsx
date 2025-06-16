"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Lightbulb,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertTriangle,
  Copy,
  RefreshCw,
} from "lucide-react";
import { aiAssistant } from "@/lib/free-ai-assistant";

interface AIEventAssistantProps {
  onSuggestionApply: (field: string, value: string) => void;
  currentFormData: any;
}

interface EventSuggestion {
  title: string;
  description: string;
  suggestedDuration: string;
  recommendedCapacity: string;
  locationTips: string;
  requirements: string[];
  additionalTips: string[];
  category: string;
}

export function AIEventAssistant({
  onSuggestionApply,
  currentFormData,
}: AIEventAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<EventSuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [validationSuggestions, setValidationSuggestions] = useState<string[]>(
    []
  );

  const generateSuggestions = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate AI processing delay for better UX
    setTimeout(() => {
      const result = aiAssistant.generateEventSuggestions(prompt);
      setSuggestions(result);
      setIsGenerating(false);
    }, 1500);
  };

  const validateCurrentForm = () => {
    const validationResults =
      aiAssistant.validateAndSuggestImprovements(currentFormData);
    setValidationSuggestions(validationResults);
    setShowValidation(true);
  };

  const applySuggestion = (field: string, value: string) => {
    onSuggestionApply(field, value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            🤖 AI Etkinlik Asistanı
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ücretsiz AI destekli etkinlik önerileri
          </p>
        </div>
      </div>

      {/* AI Prompt Input */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Etkinlik Fikrinizi Tanımlayın
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Örnek: 'Üniversite öğrencileri için yazılım geliştirme workshop'u' veya 'Girişimcilik hakkında panel tartışması'"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-colors"
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={generateSuggestions}
            disabled={isGenerating || !prompt.trim()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                AI Düşünüyor...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Önerileri Al
              </>
            )}
          </Button>

          <Button
            onClick={validateCurrentForm}
            variant="outline"
            className="border-purple-300 hover:bg-purple-50 dark:border-purple-600 dark:hover:bg-purple-900/20"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Formu Kontrol Et
          </Button>
        </div>
      </div>

      {/* AI Suggestions Display */}
      {suggestions && (
        <div className="space-y-6 border-t border-purple-200 dark:border-purple-700 pt-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
              AI Önerileri
            </h3>

            {/* Title Suggestion */}
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    📝 Önerilen Başlık
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(suggestions.title)}
                      className="text-xs"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        applySuggestion("event", suggestions.title)
                      }
                      className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Uygula
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {suggestions.title}
                </p>
              </div>

              {/* Description Suggestion */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    📄 Önerilen Açıklama
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(suggestions.description)}
                      className="text-xs"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        applySuggestion("description", suggestions.description)
                      }
                      className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Uygula
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded leading-relaxed">
                  {suggestions.description}
                </p>
              </div>
            </div>

            {/* Additional Suggestions */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Süre Önerisi
                  </h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {suggestions.suggestedDuration}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Users className="w-4 h-4 text-green-600 mr-2" />
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Kapasite Önerisi
                  </h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {suggestions.recommendedCapacity}
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 text-purple-600 mr-2" />
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Mekan Önerisi
                  </h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {suggestions.locationTips}
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Lightbulb className="w-4 h-4 text-orange-600 mr-2" />
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Kategori
                  </h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {suggestions.category}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {suggestions.requirements.length > 0 && (
              <div className="mt-6">
                <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Gerekli Malzemeler
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.requirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {suggestions.additionalTips.length > 0 && (
              <div className="mt-6">
                <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <Lightbulb className="w-4 h-4 text-yellow-600 mr-2" />
                  AI İpuçları
                </h5>
                <div className="space-y-2">
                  {suggestions.additionalTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                    >
                      <Lightbulb className="w-3 h-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validation Results */}
      {showValidation && (
        <div className="space-y-4 border-t border-purple-200 dark:border-purple-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
            Form Kontrolü
          </h3>

          {validationSuggestions.length === 0 ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 dark:text-green-200 font-medium">
                  Harika! Formunuz eksiksiz görünüyor.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-3">
                İyileştirme Önerileri:
              </h4>
              <div className="space-y-2">
                {validationSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start text-sm text-orange-700 dark:text-orange-300"
                  >
                    <AlertTriangle className="w-3 h-3 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
          💡 Hızlı İpuçları:
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Ne kadar detaylı yazarsanız, AI o kadar iyi öneriler verir</li>
          <li>• Hedef kitlenizi ve etkinlik türünü belirtin</li>
          <li>• Önerileri kendi ihtiyaçlarınıza göre düzenleyebilirsiniz</li>
          <li>• Form kontrolü ile eksiklikleri tespit edebilirsiniz</li>
        </ul>
      </div>
    </div>
  );
}

export default AIEventAssistant;
