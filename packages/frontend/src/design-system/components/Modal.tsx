import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, children, title, size = 'md', className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop — white wash in light mode, dark overlay in dark mode */}
      <div
        className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={cn(
          'relative w-full rounded-2xl bg-bg border border-border shadow-2xl',
          'max-h-[80vh] overflow-hidden',
          sizeStyles[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border bg-bg px-4 py-3">
            <h2 id="modal-title" className="text-lg font-semibold text-fg">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-fg-muted hover:bg-bg-hover hover:text-fg transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <div
          className={cn(
            'overflow-y-auto px-4 py-4',
            title ? 'max-h-[calc(80vh-56px)]' : 'max-h-[80vh]'
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
