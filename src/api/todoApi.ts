import axios from 'axios';
import type { CreateTodoRequest, Todo } from '../types/todo';

const API_BASE_URL = 'http://localhost:8080/api';

export const todoApi = {
    getAllTodos: async (): Promise<Todo[]> => {
        const response = await axios.get(`${API_BASE_URL}/todos`);
        return response.data;
    },

    createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
        const response = await axios.post(`${API_BASE_URL}/todos`, todo);
        return response.data;
    },

    toggleTodo: async (id: number): Promise<Todo> => {
        const response = await axios.put(`${API_BASE_URL}/todos/${id}/toggle`);
        return response.data;
    },

    updateTodo: async (id: number, updates: Partial<Todo>): Promise<Todo> => {
        const response = await axios.put(`${API_BASE_URL}/todos/${id}`, updates);
        return response.data;
    },

    deleteTodo: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/todos/${id}`);
    }
};