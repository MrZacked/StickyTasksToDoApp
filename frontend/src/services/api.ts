import axios, { AxiosResponse } from 'axios';
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoFilters,
  TodoStats,
  ApiResponse,
  TodoListResponse
} from '../types/Todo';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error - please check your connection');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

class TodoAPI {
  static async getTodos(filters?: TodoFilters): Promise<Todo[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const response: AxiosResponse<TodoListResponse> = await api.get(
        `/todos?${params.toString()}`
      );
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getTodo(id: string): Promise<Todo> {
    try {
      const response: AxiosResponse<ApiResponse<Todo>> = await api.get(`/todos/${id}`);
      
      if (!response.data.data) {
        throw new Error('Todo not found');
      }
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    try {
      const response: AxiosResponse<ApiResponse<Todo>> = await api.post('/todos', todoData);
      
      if (!response.data.data) {
        throw new Error('Failed to create todo');
      }
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateTodo(id: string, updates: UpdateTodoRequest): Promise<Todo> {
    try {
      const response: AxiosResponse<ApiResponse<Todo>> = await api.put(`/todos/${id}`, updates);
      
      if (!response.data.data) {
        throw new Error('Failed to update todo');
      }
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async toggleTodo(id: string): Promise<Todo> {
    try {
      const response: AxiosResponse<ApiResponse<Todo>> = await api.patch(`/todos/${id}/toggle`);
      
      if (!response.data.data) {
        throw new Error('Failed to toggle todo');
      }
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteTodo(id: string): Promise<void> {
    try {
      await api.delete(`/todos/${id}`);
    } catch (error) {
      throw error;
    }
  }

  static async deleteCompletedTodos(): Promise<number> {
    try {
      const response: AxiosResponse<ApiResponse<{ deletedCount: number }>> = await api.delete('/todos');
      return response.data.data?.deletedCount || 0;
    } catch (error) {
      throw error;
    }
  }

  static async getStats(): Promise<TodoStats> {
    try {
      const response: AxiosResponse<ApiResponse<TodoStats>> = await api.get('/todos/stats/summary');
      
      if (!response.data.data) {
        throw new Error('Failed to fetch stats');
      }
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export default TodoAPI; 