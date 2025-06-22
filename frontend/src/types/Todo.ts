export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string | null;
}

export interface UpdateTodoRequest extends Partial<CreateTodoRequest> {
  completed?: boolean;
}

export interface TodoFilters {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  sortBy?: 'createdAt' | 'title' | 'priority' | 'dueDate';
  sortOrder?: 'asc' | 'desc';
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
}

export interface TodoListResponse {
  success: boolean;
  data: Todo[];
  pagination: PaginationInfo;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string;
} 