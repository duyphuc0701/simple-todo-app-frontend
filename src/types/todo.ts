export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string;           // ✅ ADD
    priority?: 'low' | 'medium' | 'high';  // ✅ ADD
    // Optional tags for a task. Backend expects array but UI shows first tag only.
    tags?: string[];
}

export interface CreateTodoRequest {
    title: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
}