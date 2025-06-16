// API Configuration for Laravel Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
  csrfToken?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getCsrfToken(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.warn('Failed to get CSRF token:', error);
    }
  }

  async request<T = any>(
    endpoint: string, 
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { requireAuth = true, csrfToken = true, ...fetchOptions } = options;

    // Get CSRF token if required (for POST, PUT, DELETE requests)
    if (csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(fetchOptions.method || 'GET')) {
      await this.getCsrfToken();
    }

    const defaultHeaders: HeadersInit = {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    // Don't set Content-Type for FormData
    if (!(fetchOptions.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      credentials: 'include',
      ...fetchOptions,
      headers: {
        ...defaultHeaders,
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as T;
  }

  // Event API methods
  async getEvents(page = 1): Promise<any> {
    return this.request(`/api/events?page=${page}`, { method: 'GET' });
  }

  async getEvent(id: string | number): Promise<any> {
    return this.request(`/api/events/${id}`, { method: 'GET' });
  }

  async createEvent(eventData: FormData): Promise<any> {
    return this.request('/api/events', {
      method: 'POST',
      body: eventData,
    });
  }

  async updateEvent(id: string | number, eventData: FormData): Promise<any> {
    return this.request(`/api/events/${id}`, {
      method: 'PUT',
      body: eventData,
    });
  }

  async deleteEvent(id: string | number): Promise<any> {
    return this.request(`/api/events/${id}`, { method: 'DELETE' });
  }

  async registerForEvent(eventId: string | number): Promise<any> {
    return this.request(`/api/events/${eventId}/register`, { method: 'POST' });
  }

  async unregisterFromEvent(eventId: string | number): Promise<any> {
    return this.request(`/api/events/${eventId}/unregister`, { method: 'DELETE' });
  }

  async checkEventRegistration(eventId: string | number): Promise<any> {
    return this.request(`/api/events/${eventId}/check-registration`, { method: 'GET' });
  }

  // Community API methods
  async getUserCommunities(): Promise<any> {
    return this.request('/api/user/communities', { method: 'GET' });
  }

  async getCommunityEvents(communityId: string | number): Promise<any> {
    return this.request(`/api/communities/${communityId}/events`, { method: 'GET' });
  }

  // User API methods
  async getUser(): Promise<any> {
    return this.request('/api/me', { method: 'GET' });
  }

  // Quiz API methods
  async getQuizzes(): Promise<any> {
    return this.request('/api/quizzes', { method: 'GET' });
  }

  async getQuiz(id: string | number): Promise<any> {
    return this.request(`/api/quizzes/${id}`, { method: 'GET' });
  }
  async createQuiz(quizData: any): Promise<any> {
    return this.request('/api/quizzes/with-questions', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  }

  async getEventQuiz(eventId: string | number): Promise<any> {
    return this.request(`/api/events/${eventId}/quiz`, { method: 'GET' });
  }

  async submitQuiz(quizId: string | number, answers: any): Promise<any> {
    return this.request('/api/quiz-submissions', {
      method: 'POST',
      body: JSON.stringify({ quiz_id: quizId, answers }),
    });
  }

  async getQuizSubmission(submissionId: string | number): Promise<any> {
    return this.request(`/api/quiz-submissions/${submissionId}`, { method: 'GET' });
  }

  // Certificate API methods
  async getCertificates(): Promise<any> {
    return this.request('/api/certificates', { method: 'GET' });
  }

  async getUserCertificates(): Promise<any> {
    return this.request('/api/user-certificates', { method: 'GET' });
  }

  async generateCertificate(eventId: string | number): Promise<any> {
    return this.request('/api/user-certificates', {
      method: 'POST',
      body: JSON.stringify({ event_id: eventId }),
    });
  }

  async getUserCertificate(eventId: string | number): Promise<any> {
    return this.request(`/api/events/${eventId}/certificate`, { method: 'GET' });
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Legacy compatibility - individual functions
export const api = {
  get: (endpoint: string, options?: RequestInit) => 
    apiClient.request(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint: string, data?: any, options?: RequestInit) => 
    apiClient.request(endpoint, { 
      ...options, 
      method: 'POST', 
      body: data instanceof FormData ? data : JSON.stringify(data) 
    }),
  
  put: (endpoint: string, data?: any, options?: RequestInit) => 
    apiClient.request(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: data instanceof FormData ? data : JSON.stringify(data) 
    }),
  
  delete: (endpoint: string, options?: RequestInit) => 
    apiClient.request(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;