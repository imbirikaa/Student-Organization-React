// Free AI Event Generation - No API costs!
// Uses predefined templates and simple algorithms

interface EventTemplate {
  title: string;
  description: string;
  duration: string;
  capacity: string;
  requirements: string[];
  category: string;
  suggestedTime: string;
  venue: string;
}

interface EventContext {
  season: number;
  dayOfWeek: string;
  timeOfDay: string;
}

const EVENT_TEMPLATES: Record<string, EventTemplate[]> = {
  workshop: [
    {
      title: "Teknik Workshop",
      description: "Uygulamalı öğrenme deneyimi için tasarlanmış interaktif workshop",
      duration: "2-3 saat",
      capacity: "15-25 kişi",
      requirements: ["Projektör", "Masa düzeni", "WiFi", "Elektrik prizleri"],
      category: "Eğitim",
      suggestedTime: "14:00-17:00",
      venue: "Bilgisayar Laboratuvarı"
    },
    {
      title: "Yaratıcı Workshop",
      description: "Katılımcıların yaratıcılığını geliştiren hands-on etkinlik",
      duration: "2-4 saat",
      capacity: "10-20 kişi",
      requirements: ["Masalar", "Malzemeler", "Projeksiyon"],
      category: "Sanat & Yaratıcılık",
      suggestedTime: "10:00-14:00",
      venue: "Atölye Salonu"
    }
  ],
  seminer: [
    {
      title: "Akademik Seminer",
      description: "Uzman konuşmacı ile bilgi paylaşımı ve tartışma oturumu",
      duration: "1-2 saat",
      capacity: "50-100 kişi",
      requirements: ["Mikrofon", "Projeksiyon", "Ses sistemi"],
      category: "Eğitim",
      suggestedTime: "11:00-12:30",
      venue: "Konferans Salonu"
    },
    {
      title: "Sektör Semineri",
      description: "Sektör profesyonelleri ile networking ve bilgi edinme",
      duration: "1.5-2 saat",
      capacity: "30-80 kişi",
      requirements: ["Mikrofon", "Sunum ekranı", "Katılımcı masaları"],
      category: "Kariyer",
      suggestedTime: "15:00-17:00",
      venue: "Toplantı Salonu"
    }
  ],
  konferans: [
    {
      title: "Büyük Konferans",
      description: "Çok sayıda katılımcı için organize edilmiş kapsamlı etkinlik",
      duration: "4-8 saat",
      capacity: "100-500 kişi",
      requirements: ["Sahne", "Ses sistemi", "Kayıt ekipmanı", "Catering"],
      category: "Teknoloji",
      suggestedTime: "09:00-17:00",
      venue: "Ana Konferans Salonu"
    }
  ],
  sosyal: [
    {
      title: "Sosyal Etkinlik",
      description: "Katılımcıların sosyalleşmesi için düzenlenen eğlenceli aktivite",
      duration: "2-4 saat",
      capacity: "25-100 kişi",
      requirements: ["Müzik sistemi", "Yiyecek servisi", "Oturma alanları"],
      category: "Sosyal",
      suggestedTime: "18:00-22:00",
      venue: "Sosyal Alanlar"
    }
  ],
  spor: [
    {
      title: "Spor Etkinliği",
      description: "Fiziksel aktivite ve takım ruhu odaklı etkinlik",
      duration: "1-3 saat",
      capacity: "10-50 kişi",
      requirements: ["Spor malzemeleri", "İlk yardım", "Su"],
      category: "Spor",
      suggestedTime: "16:00-19:00",
      venue: "Spor Salonu"
    }
  ]
};

const KEYWORDS_TO_TYPES: Record<string, string> = {
  // Workshop keywords
  "workshop": "workshop",
  "atölye": "workshop",
  "uygulamalı": "workshop",
  "hands-on": "workshop",
  "pratik": "workshop",
  
  // Seminar keywords
  "seminer": "seminer",
  "konuşma": "seminer",
  "sunum": "seminer",
  "bilgi": "seminer",
  
  // Conference keywords
  "konferans": "konferans",
  "kongre": "konferans",
  "büyük": "konferans",
  
  // Social keywords
  "sosyal": "sosyal",
  "eğlence": "sosyal",
  "networking": "sosyal",
  "tanışma": "sosyal",
  
  // Sports keywords
  "spor": "spor",
  "fiziksel": "spor",
  "oyun": "spor",
  "yarışma": "spor"
};

export function detectEventType(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  for (const [keyword, type] of Object.entries(KEYWORDS_TO_TYPES)) {
    if (lowerPrompt.includes(keyword)) {
      return type;
    }
  }
  
  // Default fallback based on other hints
  if (lowerPrompt.includes("öğren") || lowerPrompt.includes("eğit")) return "workshop";
  if (lowerPrompt.includes("konuş") || lowerPrompt.includes("ders")) return "seminer";
  if (lowerPrompt.includes("büyük") || lowerPrompt.includes("çok")) return "konferans";
  
  return "workshop"; // Default
}

export function getEventContext(): EventContext {
  const now = new Date();
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  
  let timeOfDay = "sabah";
  const hour = now.getHours();
  if (hour >= 12 && hour < 17) timeOfDay = "öğleden sonra";
  else if (hour >= 17) timeOfDay = "akşam";
  
  return {
    season: now.getMonth(),
    dayOfWeek: days[now.getDay()],
    timeOfDay
  };
}

export function generateEventSuggestions(prompt: string): EventTemplate {
  const eventType = detectEventType(prompt);
  const context = getEventContext();
  const templates = EVENT_TEMPLATES[eventType] || EVENT_TEMPLATES.workshop;
  
  // Select template based on prompt content
  let selectedTemplate = templates[0];
  
  // Simple selection logic based on keywords
  if (prompt.toLowerCase().includes("teknoloji") || prompt.toLowerCase().includes("bilgisayar")) {
    selectedTemplate = templates.find(t => t.category === "Teknoloji" || t.venue.includes("Bilgisayar")) || templates[0];
  } else if (prompt.toLowerCase().includes("sanat") || prompt.toLowerCase().includes("yaratıc")) {
    selectedTemplate = templates.find(t => t.category.includes("Sanat")) || templates[0];
  } else if (prompt.toLowerCase().includes("kariyer") || prompt.toLowerCase().includes("iş")) {
    selectedTemplate = templates.find(t => t.category === "Kariyer") || templates[0];
  }
  
  // Customize based on season
  if (context.season >= 5 && context.season <= 7) { // Summer
    if (selectedTemplate.venue === "Sosyal Alanlar") {
      selectedTemplate = { ...selectedTemplate, venue: "Bahçe / Açık Alan" };
    }
  }
  
  return selectedTemplate;
}

export function extractTargetAudience(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes("öğrenci")) return "Üniversite Öğrencileri";
  if (lowerPrompt.includes("akademik") || lowerPrompt.includes("öğretmen")) return "Akademik Personel";
  if (lowerPrompt.includes("çalışan") || lowerPrompt.includes("personel")) return "Çalışanlar";
  if (lowerPrompt.includes("profesyonel") || lowerPrompt.includes("uzman")) return "Sektör Profesyonelleri";
  if (lowerPrompt.includes("yeni") || lowerPrompt.includes("başlangıç")) return "Yeni Başlayanlar";
  if (lowerPrompt.includes("ileri") || lowerPrompt.includes("deneyimli")) return "İleri Seviye Katılımcılar";
  
  return "Genel Katılımcılar";
}

export function suggestOptimalDateTime(eventType: string, context: EventContext): string {
  const baseSchedule: Record<string, string> = {
    workshop: "Cumartesi 14:00-17:00",
    seminer: "Perşembe 15:00-16:30", 
    konferans: "Cuma 09:00-17:00",
    sosyal: "Cuma 18:00-21:00",
    spor: "Çarşamba 16:00-18:00"
  };
  
  let suggestion = baseSchedule[eventType] || baseSchedule.workshop;
  
  // Adjust based on current context
  if (context.dayOfWeek === "Cumartesi" || context.dayOfWeek === "Pazar") {
    suggestion = suggestion.replace(/Perşembe|Cuma/, "Cumartesi");
  }
  
  return suggestion;
}

export function generateMaterialsList(eventType: string, prompt: string): string[] {
  const baseMaterials: Record<string, string[]> = {
    workshop: ["Masalar ve sandalyeler", "Projektör ve ekran", "WiFi bağlantısı", "Yazı tahtası", "Kırtasiye malzemeleri"],
    seminer: ["Mikrofon sistemi", "Projeksiyon ekranı", "Klicker", "Su servisi", "Not defteri"],
    konferans: ["Sahne düzeni", "Ses ve ışık sistemi", "Kayıt ekipmanları", "Catering servisi", "Kayıt masası"],
    sosyal: ["Müzik sistemi", "Dekorasyon", "Yiyecek-içecek", "Oyun malzemeleri", "Fotoğraf alanı"],
    spor: ["Spor malzemeleri", "İlk yardım çantası", "Su ve havlu", "Skor tablosu", "Ödüller"]
  };
  
  let materials = baseMaterials[eventType] || baseMaterials.workshop;
  
  // Add specific materials based on prompt
  if (prompt.toLowerCase().includes("bilgisayar") || prompt.toLowerCase().includes("kodlama")) {
    materials = [...materials, "Laptoplar/Bilgisayarlar", "Programlama ortamı", "İnternet erişimi"];
  }
  
  if (prompt.toLowerCase().includes("yemek") || prompt.toLowerCase().includes("ikram")) {
    materials = [...materials, "Catering servisi", "İkram masası"];
  }
  
  return materials;
}
