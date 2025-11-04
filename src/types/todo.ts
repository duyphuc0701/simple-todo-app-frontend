export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string;           // ✅ ADD
    priority?: 'low' | 'medium' | 'high';  // ✅ ADD
}

export interface CreateTodoRequest {
    title: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
}