import React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  return (
    <div className="error">
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="btn btn-secondary btn-small"
        style={{ marginLeft: '1rem' }}
      >
        Dismiss
      </button>
    </div>
  );
};

export default ErrorMessage; 