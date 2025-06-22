import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoRequest, UpdateTodoRequest, FilterType } from '../types/Todo';
import TodoAPI from '../services/api';

interface UseTodosState {
  allTodos: Todo[];
  loading: boolean;
  error: string | null;
  filter: FilterType;
}

interface UseTodosActions {
  addTodo: (todoData: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: string, updates: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  setFilter: (filter: FilterType) => void;
  deleteCompleted: () => Promise<void>;
  refreshTodos: () => Promise<void>;
  clearError: () => void;
}

type UseTodosReturn = UseTodosState & UseTodosActions & {
  todos: Todo[];
};

export const useTodos = (): UseTodosReturn => {
  const [state, setState] = useState<UseTodosState>({
    allTodos: [],
    loading: true,
    error: null,
    filter: 'all'
  });

  const updateState = useCallback((updates: Partial<UseTodosState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleError = useCallback((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    updateState({ error: errorMessage, loading: false });
  }, [updateState]);

  const fetchTodos = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      
      const allTodos = await TodoAPI.getTodos();
      updateState({ allTodos, loading: false });
    } catch (error) {
      handleError(error);
    }
  }, [updateState, handleError]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (todoData: CreateTodoRequest) => {
    try {
      updateState({ loading: true, error: null });
      const newTodo = await TodoAPI.createTodo(todoData);
      
      setState(prev => ({
        ...prev,
        allTodos: [newTodo, ...prev.allTodos],
        loading: false
      }));
    } catch (error) {
      handleError(error);
    }
  }, [updateState, handleError]);

  const updateTodoItem = useCallback(async (id: string, updates: UpdateTodoRequest) => {
    try {
      updateState({ loading: true, error: null });
      const updatedTodo = await TodoAPI.updateTodo(id, updates);
      
      setState(prev => ({
        ...prev,
        allTodos: prev.allTodos.map(todo => 
          todo._id === id ? updatedTodo : todo
        ),
        loading: false
      }));
    } catch (error) {
      handleError(error);
    }
  }, [updateState, handleError]);

  const deleteTodoItem = useCallback(async (id: string) => {
    try {
      updateState({ loading: true, error: null });
      await TodoAPI.deleteTodo(id);
      
      setState(prev => ({
        ...prev,
        allTodos: prev.allTodos.filter(todo => todo._id !== id),
        loading: false
      }));
    } catch (error) {
      handleError(error);
    }
  }, [updateState, handleError]);

  const toggleTodoItem = useCallback(async (id: string) => {
    try {
      updateState({ error: null });
      const updatedTodo = await TodoAPI.toggleTodo(id);
      
      setState(prev => ({
        ...prev,
        allTodos: prev.allTodos.map(todo => 
          todo._id === id ? updatedTodo : todo
        )
      }));
    } catch (error) {
      handleError(error);
    }
  }, [updateState, handleError]);

  const setFilter = useCallback((filter: FilterType) => {
    updateState({ filter });
  }, [updateState]);

  const deleteCompleted = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      await TodoAPI.deleteCompletedTodos();
      
      setState(prev => ({
        ...prev,
        allTodos: prev.allTodos.filter(todo => !todo.completed),
        loading: false
      }));
    } catch (error) {
      handleError(error);
    }
  }, [updateState, handleError]);

  const refreshTodos = useCallback(async () => {
    await fetchTodos();
  }, [fetchTodos]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const filteredTodos = state.allTodos.filter(todo => {
    switch (state.filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return {
    ...state,
    todos: filteredTodos,
    addTodo,
    updateTodo: updateTodoItem,
    deleteTodo: deleteTodoItem,
    toggleTodo: toggleTodoItem,
    setFilter,
    deleteCompleted,
    refreshTodos,
    clearError
  };
}; 