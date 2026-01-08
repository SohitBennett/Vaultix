'use client';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export function ErrorAlert({
  message,
  onDismiss,
  type = 'error',
}: ErrorAlertProps) {
  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: '❌',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠️',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'ℹ️',
    },
  };

  const style = styles[type];

  return (
    <div
      className={`${style.bg} border ${style.border} ${style.text} px-4 py-3 rounded-lg flex items-center justify-between`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="text-xl mr-3">{style.icon}</span>
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 font-bold hover:opacity-75"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}