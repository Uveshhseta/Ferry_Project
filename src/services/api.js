// Toronto Island Ferry Services Frontend API Client
const API_BASE = '/api';

const getStoredToken = () => {
  try {
    return localStorage.getItem('ferry_auth_token') || null;
  } catch (e) {
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('ferry_auth_token', token);
    } else {
      localStorage.removeItem('ferry_auth_token');
    }
  } catch (e) {
    console.error('Storage error:', e);
  }
};

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    login: async (email, password) => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.token) setStoredToken(res.token);
      return res;
    },
    register: async (name, email, password, phone) => {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone })
      });
      if (res.token) setStoredToken(res.token);
      return res;
    },
    getMe: async () => {
      return request('/auth/me');
    },
    logout: async () => {
      try {
        await request('/auth/logout', { method: 'POST' });
      } catch (e) {
        // continue logout anyway
      }
      setStoredToken(null);
    },
    updateProfile: async (data) => {
      return request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
  },

  // Pricing & GST
  pricing: {
    get: async () => request('/pricing'),
    update: async (data) => request('/pricing', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // Routes
  routes: {
    getAll: async () => request('/routes'),
    create: async (data) => request('/routes', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => request(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => request(`/routes/${id}`, { method: 'DELETE' })
  },

  // Schedules
  schedules: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/schedules${query ? `?${query}` : ''}`);
    },
    create: async (data) => request('/schedules', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => request(`/schedules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => request(`/schedules/${id}`, { method: 'DELETE' })
  },

  // Fleet Ferries
  ferries: {
    getAll: async () => request('/ferries'),
    create: async (data) => request('/ferries', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => request(`/ferries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => request(`/ferries/${id}`, { method: 'DELETE' })
  },

  // Alerts
  alerts: {
    getActive: async () => request('/alerts'),
    getAll: async () => request('/alerts/all'),
    create: async (data) => request('/alerts', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => request(`/alerts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => request(`/alerts/${id}`, { method: 'DELETE' })
  },

  // Parks & Trails
  parks: {
    getAll: async () => request('/parks'),
    create: async (data) => request('/parks', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => request(`/parks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id) => request(`/parks/${id}`, { method: 'DELETE' })
  },

  // Bookings
  bookings: {
    getMy: async () => request('/bookings/my'),
    getById: async (id) => request(`/bookings/${id}`),
    create: async (bookingData) => request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    }),
    cancel: async (id) => request(`/bookings/${id}/cancel`, { method: 'POST' })
  },

  // Tickets & Turnstile Scanner
  tickets: {
    verify: async (code) => request(`/tickets/verify/${encodeURIComponent(code)}`),
    scan: async (ticketCode, gate) => request('/tickets/scan', {
      method: 'POST',
      body: JSON.stringify({ ticketCode, gate })
    })
  },

  // Admin Dashboard
  admin: {
    getStats: async () => request('/admin/stats'),
    getUsers: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/admin/users${q ? `?${q}` : ''}`);
    },
    updateUser: async (id, data) => request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    getBookings: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/admin/bookings${q ? `?${q}` : ''}`);
    },
    getAuditLogs: async () => request('/admin/audit-logs')
  }
};

export default api;
