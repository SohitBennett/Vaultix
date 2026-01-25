'use client';

import { XCircle, AlertTriangle, Info } from 'lucide-react';

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
      icon: XCircle,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: Info,
    },
  };

  const style = styles[type];
  const IconComponent = style.icon;

  return (
    <div
      className={`${style.bg} border ${style.border} ${style.text} px-4 py-3 rounded-lg flex items-center justify-between`}
      role="alert"
    >
      <div className="flex items-center">
        <IconComponent className="w-5 h-5 mr-3" />
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