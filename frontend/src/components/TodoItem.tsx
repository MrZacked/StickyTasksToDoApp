import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const handleToggle = async () => {
    try {
      await onToggle(todo._id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(todo._id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <div 
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      data-category={todo.category}
    >
      <div className="todo-header">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <div className="todo-content">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
          <div className="todo-meta">
            <span className={`todo-priority priority-${todo.priority}`}>
              {todo.priority}
            </span>
            {todo.category && todo.category !== 'general' && (
              <span className="todo-category">{todo.category}</span>
            )}
            {todo.dueDate && (
              <span className={`todo-due-date ${isOverdue ? 'overdue' : ''}`}>
                Due: {formatDate(todo.dueDate)}
              </span>
            )}
          </div>
        </div>
        <div className="todo-actions">
          <button
            onClick={handleDelete}
            className="btn btn-danger btn-small"
            title="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 