const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me'),
    updateModel: (model) => request('/auth/preferred-model', { method: 'PATCH', body: JSON.stringify({ model }) }),
    updateProfile: (data) => request('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  conversations: {
    list: () => request('/conversations'),
    get: (id) => request(`/conversations/${id}`),
    create: (data) => request('/conversations', { method: 'POST', body: JSON.stringify(data || {}) }),
    update: (id, data) => request(`/conversations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id) => request(`/conversations/${id}`, { method: 'DELETE' }),
  },
  chat: {
    models: () => request('/chat/models'),
    send: (conversationId, message, model) =>
      fetch(`${BASE}/chat`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message, model }),
      }),
  },
};
