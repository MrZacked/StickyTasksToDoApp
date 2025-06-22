import React from 'react';

interface StatisticsProps {
  total: number;
  completed: number;
  active: number;
}

const Statistics: React.FC<StatisticsProps> = ({ total, completed, active }) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats">
      <div className="stat-card">
        <span className="stat-number">{total}</span>
        <span className="stat-label">Total Tasks</span>
      </div>
      
      <div className="stat-card">
        <span className="stat-number">{active}</span>
        <span className="stat-label">Active</span>
      </div>
      
      <div className="stat-card">
        <span className="stat-number">{completed}</span>
        <span className="stat-label">Completed</span>
      </div>
      
      <div className="stat-card">
        <span className="stat-number">{completionRate}%</span>
        <span className="stat-label">Completion Rate</span>
      </div>
    </div>
  );
};

export default Statistics; 