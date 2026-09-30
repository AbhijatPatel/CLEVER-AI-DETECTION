const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('clever_access_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('clever_refresh_token');
  }

  public setTokens(access: string, refresh: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('clever_access_token', access);
    localStorage.setItem('clever_refresh_token', refresh);
  }

  public clearTokens() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('clever_access_token');
    localStorage.removeItem('clever_refresh_token');
    localStorage.removeItem('clever_user');
  }

  public async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = this.getAccessToken();
    const headers = new Headers(options.headers || {});

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    // Handle token expiration & auto refresh
    if (response.status === 401 && this.getRefreshToken() && !endpoint.includes('/auth/')) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers.set('Authorization', `Bearer ${this.getAccessToken()}`);
        return fetch(`${API_BASE}${endpoint}`, { ...options, headers }).then((res) => res.json());
      }
    }

    if (!response.ok) {
      let errMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errMessage = errorData.message || errorData.error || errMessage;
      } catch (e) {
        errMessage = response.statusText;
      }
      throw new Error(errMessage);
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    const refresh = this.getRefreshToken();
    if (!refresh) return false;

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh })
      });

      if (!res.ok) {
        this.clearTokens();
        return false;
      }

      const data = await res.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch (e) {
      this.clearTokens();
      return false;
    }
  }

  // --- Auth ---
  async register(payload: { email: string; password: string; name: string; organizationName?: string }) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.accessToken) {
      this.setTokens(res.accessToken, res.refreshToken);
      localStorage.setItem('clever_user', JSON.stringify(res.user));
    }
    return res;
  }

  async login(payload: { email: string; password: string }) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.accessToken) {
      this.setTokens(res.accessToken, res.refreshToken);
      localStorage.setItem('clever_user', JSON.stringify(res.user));
    }
    return res;
  }

  async logout() {
    try {
      const refresh = this.getRefreshToken();
      await this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: refresh })
      });
    } finally {
      this.clearTokens();
    }
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // --- Dashboard Usage ---
  async getDashboardStats() {
    return this.request('/usage/dashboard-stats');
  }

  // --- Analyses ---
  async createTextAnalysis(text: string, title?: string) {
    return this.request('/analysis/text', {
      method: 'POST',
      body: JSON.stringify({ text, title })
    });
  }

  async createMediaAnalysis(modality: 'document' | 'image' | 'audio' | 'video', file: File, title?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);

    return this.request(`/analysis/${modality}`, {
      method: 'POST',
      body: formData
    });
  }

  async getAnalysis(id: string) {
    return this.request(`/analysis/${id}`);
  }

  async listAnalyses(params: { page?: number; limit?: number; modality?: string; status?: string; search?: string } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.modality) query.set('modality', params.modality);
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);

    return this.request(`/analysis?${query.toString()}`);
  }

  async deleteAnalysis(id: string) {
    return this.request(`/analysis/${id}`, { method: 'DELETE' });
  }

  // --- Reports ---
  async generateReport(analysisId: string) {
    return this.request(`/reports/${analysisId}`, { method: 'POST' });
  }

  async listReports() {
    return this.request('/reports');
  }

  getReportDownloadUrl(reportId: string) {
    return `${API_BASE}/reports/${reportId}/download`;
  }

  // --- Team ---
  async listTeamMembers() {
    return this.request('/team/members');
  }

  async inviteMember(email: string, role: string, name?: string) {
    return this.request('/team/invite', {
      method: 'POST',
      body: JSON.stringify({ email, role, name })
    });
  }

  // --- API Keys ---
  async listApiKeys() {
    return this.request('/api-keys');
  }

  async createApiKey(name: string) {
    return this.request('/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  }

  async deleteApiKey(id: string) {
    return this.request(`/api-keys/${id}`, { method: 'DELETE' });
  }

  // --- Audit Logs ---
  async listAuditLogs(params: { page?: number; action?: string } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.action) query.set('action', params.action);
    return this.request(`/audit-logs?${query.toString()}`);
  }
}

export const api = new ApiClient();
