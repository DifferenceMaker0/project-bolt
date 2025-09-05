import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Portal from './Portal';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle keyboard events (Escape to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        aria-modal="true"
        role="dialog"
        aria-labelledby={title ? "dialog-title" : undefined}
      >
        <div 
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl ${maxWidth} w-full transform transition-all duration-300 ease-in-out`}
          ref={dialogRef}
          style={{
            animation: 'dialog-enter 0.3s ease-out'
          }}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            {title && (
              <h2 id="dialog-title" className="text-lg font-medium text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            <button
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
            {children}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes dialog-enter {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        body.dialog-open {
          overflow: hidden;
        }
      `}</style>
    </Portal>
  );
};

export default Dialog;