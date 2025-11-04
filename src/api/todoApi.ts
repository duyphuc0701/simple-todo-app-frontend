import axios from 'axios';
import type { CreateTodoRequest, Todo } from '../types/todo';

// For Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// We'll read the username from localStorage key 'todoUserName' and send it as X-User-Name
const STORAGE_KEY = 'todoUserName';

function getStoredUserName(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function storeUserName(name: string) {
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch (e) {
    // ignore
  }
}

function headersForUser(): Record<string, string> | undefined {
  const name = getStoredUserName();
  if (!name) return undefined;
  return { 'X-User-Name': name };
}

export const todoApi = {
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await axios.get(`${API_BASE_URL}/todos`, { headers: headersForUser() });
    return response.data;
  },

  createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    const response = await axios.post(`${API_BASE_URL}/todos`, todo, { headers: headersForUser() });
    return response.data;
  },

  toggleTodo: async (id: number): Promise<Todo> => {
    const response = await axios.put(`${API_BASE_URL}/todos/${id}/toggle`, null, { headers: headersForUser() });
    return response.data;
  },

  updateTodo: async (id: number, updates: Partial<Todo>): Promise<Todo> => {
    const response = await axios.put(`${API_BASE_URL}/todos/${id}`, updates, { headers: headersForUser() });
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/todos/${id}`, { headers: headersForUser() });
  },

  createUser: async (user: { name: string }): Promise<any> => {
    // Call backend to register/echo name and persist locally
    const response = await axios.post(`${API_BASE_URL}/users`, user);
    const data = response.data;
    if (data && data.name) {
      storeUserName(String(data.name));
    }
    return data;
  },

  setCurrentUserName: (name: string | null) => {
    if (name) storeUserName(name);
    else {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }
  },

  getCurrentUserName: () => getStoredUserName(),
};
