import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  onToggle,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks yet</h3>
        <p>Your list is empty. Add a task above to get started.</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList; 