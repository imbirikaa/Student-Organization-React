// Free AI Event Assistant - No external APIs required
// Uses rule-based AI and pattern matching

interface EventTemplate {
  type: string;
  keywords: string[];
  suggestedTitle: string;
  description: string;
  duration: string;
  capacity: string;
  location: string;
  requirements: string[];
  tips: string[];
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

// Event templates database (completely free, no API)
const eventTemplates: EventTemplate[] = [
  {
    type: "workshop",
    keywords: ["workshop", "atölye", "eğitim", "öğretim", "kurs", "ders", "pratik", "uygulama"],
    suggestedTitle: "Uygulamalı Workshop",
    description: "Katılımcıların aktif olarak öğrenip pratik yapabileceği interaktif bir eğitim etkinliği.",
    duration: "2-4 saat",
    capacity: "15-25 kişi",
    location: "Sınıf veya laboratuvar ortamı",
    requirements: ["Projeksiyon", "Masalar", "İnternet bağlantısı", "Çalışma materyalleri"],
    tips: ["Küçük gruplar halinde organize edin", "Bol pratik imkanı sunun", "Materyalleri önceden hazırlayın"]
  },
  {
    type: "seminar",
    keywords: ["seminer", "konferans", "sunum", "anlatım", "bilgilendirme", "ders"],
    suggestedTitle: "Bilgilendirme Semineri",
    description: "Uzman konuşmacıların bilgi paylaştığı, dinleyici odaklı bir eğitim etkinliği.",
    duration: "1-2 saat",
    capacity: "50-200 kişi",
    location: "Amfi veya konferans salonu",
    requirements: ["Mikrofon sistemi", "Projeksiyon", "Sahne aydınlatması"],
    tips: ["Soru-cevap bölümü ekleyin", "Konuşmacı CV'sini paylaşın", "Kayıt imkanı sağlayın"]
  },
  {
    type: "panel",
    keywords: ["panel", "tartışma", "söyleşi", "münazara", "görüş", "uzman"],
    suggestedTitle: "Uzman Panel Tartışması",
    description: "Farklı uzmanların bir araya gelip görüş paylaştığı interaktif tartışma ortamı.",
    duration: "1.5-2.5 saat",
    capacity: "30-100 kişi",
    location: "Konferans salonu veya amfi",
    requirements: ["Mikrofon sistemi", "Panel masası", "Moderatör kürsüsü"],
    tips: ["Deneyimli moderatör seçin", "Katılımcı sorularına zaman ayırın", "Farklı görüşlere yer verin"]
  },
  {
    type: "networking",
    keywords: ["networking", "tanışma", "ağ", "sosyal", "buluşma", "kahve", "sohbet"],
    suggestedTitle: "Networking Etkinliği",
    description: "Profesyonellerin tanışıp iş bağlantıları kurduğu sosyal bir buluşma.",
    duration: "2-3 saat",
    capacity: "20-80 kişi",
    location: "Sosyal alan veya kafeterya",
    requirements: ["İkram alanı", "Rahat oturma düzeni", "Müzik sistemi"],
    tips: ["Buz kırıcı aktiviteler planlayın", "İsim etiketleri kullanın", "Rahat atmosfer yaratın"]
  },
  {
    type: "competition",
    keywords: ["yarışma", "kompetisyon", "turnuva", "müsabaka", "ödül", "kazanan"],
    suggestedTitle: "Rekabet Etkinliği",
    description: "Katılımcıların yeteneklerini sergileyip yarıştığı eğlenceli bir aktivite.",
    duration: "3-6 saat",
    capacity: "10-50 kişi",
    location: "Spor salonu veya geniş alan",
    requirements: ["Değerlendirme sistemi", "Ödüller", "Hakem/jüri", "Kayıt sistemi"],
    tips: ["Adil kurallar belirleyin", "Katılım ödülleri verin", "Sonuçları şeffaf açıklayın"]
  },
  {
    type: "cultural",
    keywords: ["kültür", "sanat", "müzik", "dans", "tiyatro", "sergi", "gösteri"],
    suggestedTitle: "Kültürel Etkinlik",
    description: "Sanatsal ve kültürel içerik sunan, katılımcıları eğlendiren etkinlik.",
    duration: "1-3 saat",
    capacity: "50-300 kişi",
    location: "Sahne veya sergi alanı",
    requirements: ["Ses sistemi", "Sahne aydınlatması", "Sergi alanı"],
    tips: ["Yerel sanatçıları destekleyin", "Fotoğraf çekimi planlayın", "Sosyal medya paylaşımı yapın"]
  },
  {
    type: "technology",
    keywords: ["teknoloji", "yazılım", "program", "kod", "bilgisayar", "dijital", "AI", "yapay zeka"],
    suggestedTitle: "Teknoloji Etkinliği",
    description: "Teknolojik gelişmeleri ve yenilikleri konu alan bilgilendirici etkinlik.",
    duration: "2-4 saat",
    capacity: "20-100 kişi",
    location: "Bilgisayar laboratuvarı veya teknik sınıf",
    requirements: ["Bilgisayarlar", "İnternet", "Projektör", "Teknik donanım"],
    tips: ["Demo hazırlayın", "Hands-on deneyim sunun", "Güncel konuları seçin"]
  }
];

// Seasonal and contextual suggestions
const seasonalSuggestions = {
  spring: ["bahçe etkinlikleri", "doğa yürüyüşü", "açık hava", "piknik"],
  summer: ["yaz okulu", "plaj", "outdoor", "festival"],
  autumn: ["hasat", "sonbahar", "akademik başlangıç", "yeni dönem"],
  winter: ["kış", "kapalı alan", "sıcak", "yılsonu"]
};

const timeSuggestions = {
  morning: { 
    recommended: "09:00-12:00", 
    benefits: ["Daha enerjik katılım", "Daha iyi konsantrasyon"] 
  },
  afternoon: { 
    recommended: "14:00-17:00", 
    benefits: ["Öğleden sonra molası", "Rahat zamanlama"] 
  },
  evening: { 
    recommended: "18:00-21:00", 
    benefits: ["İş/ders sonrası katılım", "Sosyal atmosfer"] 
  }
};

export class FreeAIEventAssistant {
  
  // Analyze user input and suggest event type
  analyzeEventType(input: string): string {
    const normalizedInput = input.toLowerCase().trim();
    
    for (const template of eventTemplates) {
      for (const keyword of template.keywords) {
        if (normalizedInput.includes(keyword)) {
          return template.type;
        }
      }
    }
    
    // Default fallback
    return "workshop";
  }
  
  // Generate comprehensive event suggestions
  generateEventSuggestions(userPrompt: string): EventSuggestion {
    const eventType = this.analyzeEventType(userPrompt);
    const template = eventTemplates.find(t => t.type === eventType) || eventTemplates[0];
    
    // Generate smart title
    const smartTitle = this.generateSmartTitle(userPrompt, template);
    
    // Generate enhanced description
    const enhancedDescription = this.generateEnhancedDescription(userPrompt, template);
    
    // Generate contextual tips
    const contextualTips = this.generateContextualTips(userPrompt, template);
    
    return {
      title: smartTitle,
      description: enhancedDescription,
      suggestedDuration: template.duration,
      recommendedCapacity: template.capacity,
      locationTips: template.location,
      requirements: template.requirements,
      additionalTips: [...template.tips, ...contextualTips],
      category: template.type
    };
  }
  
  private generateSmartTitle(prompt: string, template: EventTemplate): string {
    const promptWords = prompt.toLowerCase().split(' ');
    const importantWords = promptWords.filter(word => 
      word.length > 3 && 
      !['için', 'hakkında', 'ile', 'olan', 'etkinlik', 'yapmak', 'istiyorum'].includes(word)
    );
    
    if (importantWords.length > 0) {
      const mainTopic = importantWords[0];
      const capitalizedTopic = mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1);
      
      switch (template.type) {
        case 'workshop':
          return `${capitalizedTopic} Workshop'u`;
        case 'seminar':
          return `${capitalizedTopic} Semineri`;
        case 'panel':
          return `${capitalizedTopic} Panel Tartışması`;
        case 'networking':
          return `${capitalizedTopic} Networking Buluşması`;
        case 'competition':
          return `${capitalizedTopic} Yarışması`;
        case 'cultural':
          return `${capitalizedTopic} Kültür Etkinliği`;
        case 'technology':
          return `${capitalizedTopic} Teknoloji Etkinliği`;
        default:
          return `${capitalizedTopic} Etkinliği`;
      }
    }
    
    return template.suggestedTitle;
  }
  
  private generateEnhancedDescription(prompt: string, template: EventTemplate): string {
    let description = template.description;
    
    // Add specific details based on user prompt
    if (prompt.includes('öğrenci')) {
      description += " Özellikle öğrencilerin ihtiyaçlarına yönelik tasarlanmış bu etkinlik, akademik ve kişisel gelişime katkı sağlayacaktır.";
    }
    
    if (prompt.includes('başlangıç') || prompt.includes('yeni')) {
      description += " Yeni başlayanlar için özel olarak hazırlanmış, temel seviyeden başlayarak ilerlenen bir program sunulmaktadır.";
    }
    
    if (prompt.includes('uzman') || prompt.includes('ileri')) {
      description += " İleri seviye katılımcılar için derinlemesine bilgi ve uzman görüşleri paylaşılacaktır.";
    }
    
    return description;
  }
  
  private generateContextualTips(prompt: string, template: EventTemplate): string[] {
    const tips: string[] = [];
    
    // Seasonal tips
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 4) { // Spring
      tips.push("Bahar aylarında açık hava alternatifi düşünebilirsiniz");
    } else if (currentMonth >= 5 && currentMonth <= 7) { // Summer
      tips.push("Yaz döneminde serin saatler tercih edilmelidir");
    } else if (currentMonth >= 8 && currentMonth <= 10) { // Autumn
      tips.push("Yeni akademik yıl başlangıcı için ideal zamanlama");
    } else { // Winter
      tips.push("Kış aylarında sıcak ve rahat bir ortam sağlayın");
    }
    
    // Audience-specific tips
    if (prompt.includes('öğrenci') || prompt.includes('genç')) {
      tips.push("Sosyal medya tanıtımına önem verin");
      tips.push("İnteraktif içerikler ekleyin");
    }
    
    if (prompt.includes('profesyonel') || prompt.includes('iş')) {
      tips.push("LinkedIn'de paylaşım yapın");
      tips.push("Sertifika vermeyi düşünün");
    }
    
    // Technology-specific tips
    if (template.type === 'technology') {
      tips.push("Güncel teknoloji trendlerini takip edin");
      tips.push("Uygulamalı demo hazırlayın");
    }
    
    return tips;
  }
  
  // Generate time recommendations
  generateTimeRecommendations(eventType: string): any {
    const baseRecommendations = timeSuggestions;
    
    switch (eventType) {
      case 'workshop':
        return {
          ...baseRecommendations.morning,
          reason: "Workshop'lar sabah saatlerinde daha verimli geçer"
        };
      case 'networking':
        return {
          ...baseRecommendations.evening,
          reason: "Networking etkinlikleri akşam saatlerinde daha sosyal olur"
        };
      case 'seminar':
        return {
          ...baseRecommendations.afternoon,
          reason: "Seminerler öğleden sonra daha rahat takip edilir"
        };
      default:
        return baseRecommendations.afternoon;
    }
  }
  
  // Generate location suggestions
  generateLocationSuggestions(eventType: string, capacity: string): string[] {
    const suggestions: string[] = [];
    const participantCount = parseInt(capacity.split('-')[1]) || 50;
    
    if (participantCount < 30) {
      suggestions.push("Sınıf ortamı", "Toplantı odası", "Küçük konferans salonu");
    } else if (participantCount < 100) {
      suggestions.push("Orta boy amfi", "Konferans salonu", "Çok amaçlı salon");
    } else {
      suggestions.push("Büyük amfi", "Kongre merkezi", "Spor salonu");
    }
    
    // Event-specific locations
    switch (eventType) {
      case 'technology':
        suggestions.push("Bilgisayar laboratuvarı", "Teknik sınıf");
        break;
      case 'cultural':
        suggestions.push("Sanat galerisi", "Tiyatro salonu", "Sergi alanı");
        break;
      case 'networking':
        suggestions.push("Kafeterya", "Sosyal alan", "Bahçe");
        break;
    }
    
    return suggestions;
  }
  
  // Check and suggest improvements for event details
  validateAndSuggestImprovements(eventData: any): string[] {
    const suggestions: string[] = [];
    
    if (!eventData.title || eventData.title.length < 10) {
      suggestions.push("Etkinlik başlığını daha açıklayıcı hale getirin (en az 10 karakter)");
    }
    
    if (!eventData.description || eventData.description.length < 50) {
      suggestions.push("Açıklamayı daha detaylandırın (en az 50 karakter)");
    }
    
    if (eventData.description && !eventData.description.includes('katılımcı')) {
      suggestions.push("Açıklamada hedef katılımcıları belirtin");
    }
    
    // Date validation
    const eventDate = new Date(eventData.start_datetime);
    const today = new Date();
    const daysDiff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 7) {
      suggestions.push("Etkinlik tarihi için daha fazla hazırlık süresi bırakın (en az 1 hafta)");
    }
    
    return suggestions;
  }
}

// Export singleton instance
export const aiAssistant = new FreeAIEventAssistant();
