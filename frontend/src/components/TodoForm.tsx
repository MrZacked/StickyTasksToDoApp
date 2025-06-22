import React, { useState } from 'react';
import { CreateTodoRequest } from '../types/Todo';

interface TodoFormProps {
  onSubmit: (todoData: CreateTodoRequest) => Promise<void>;
  loading?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, loading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('');
    setDueDate('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    try {
      const todoData: CreateTodoRequest = {
        title: title.trim(),
        description: description.trim(),
        priority,
        category: category.trim() || 'general',
        dueDate: dueDate || null
      };

      await onSubmit(todoData);
      resetForm();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="title">Task</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="What needs to be done?"
            required
            maxLength={200}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="form-select"
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!title.trim() || loading}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="description">Details (optional)</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            placeholder="Add more details if you want"
            maxLength={1000}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
            placeholder="Work, Personal, Health..."
            maxLength={50}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
            min={today}
            disabled={loading}
          />
        </div>
      </div>
    </form>
  );
};

export default TodoForm; 