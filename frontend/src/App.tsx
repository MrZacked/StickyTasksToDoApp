import React from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterButtons from './components/FilterButtons';
import Statistics from './components/Statistics';
import ErrorMessage from './components/ErrorMessage';
import { useTodos } from './hooks/useTodos';
import './App.css';

const App: React.FC = () => {
  const {
    todos,
    allTodos,
    loading,
    error,
    filter,
    addTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    deleteCompleted,
    clearError
  } = useTodos();

  const completedCount = allTodos.filter(todo => todo.completed).length;
  const activeCount = allTodos.filter(todo => !todo.completed).length;

  const handleDeleteCompleted = async () => {
    if (completedCount === 0) return;
    
    if (window.confirm(`Delete ${completedCount} completed tasks?`)) {
      try {
        await deleteCompleted();
      } catch (error) {
        console.error('Failed to delete completed todos:', error);
      }
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-title">
          <img src="/favicon.png" alt="StickyTasks" className="header-icon" />
          <h1>StickyTasks</h1>
        </div>
        <p className="header-subtitle">Keep track of what needs to get done</p>
      </header>
      
      <main className="main-content">
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={clearError}
          />
        )}
        
        <Statistics 
          total={allTodos.length}
          completed={completedCount}
          active={activeCount}
        />
        
        <TodoForm 
          onSubmit={addTodo}
          loading={loading}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <FilterButtons 
            currentFilter={filter}
            onFilterChange={setFilter}
            stats={{
              total: allTodos.length,
              completed: completedCount,
              pending: activeCount
            }}
          />
          
          {completedCount > 0 && (
            <button
              onClick={handleDeleteCompleted}
              className="btn btn-danger btn-small"
            >
              Clear Completed ({completedCount})
            </button>
          )}
        </div>
        
        <TodoList 
          todos={todos}
          loading={loading}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </main>
    </div>
  );
};

export default App; 