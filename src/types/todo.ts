export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string;           // ✅ ADD
    priority?: 'low' | 'medium' | 'high';  // ✅ ADD
    // Optional tag for a task. Single tag per task allowed.
    tag?: 'Work' | 'Entertainment' | 'Health';
}

export interface CreateTodoRequest {
    title: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
    tag?: 'Work' | 'Entertainment' | 'Health';
}