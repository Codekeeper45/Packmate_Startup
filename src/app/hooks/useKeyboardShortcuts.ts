import { useEffect } from 'react';
import { useNavigate } from 'react-router';

/**
 * Custom hook for keyboard shortcuts
 * ESC - Go back to previous page
 */
export function useKeyboardShortcuts(enabled = true) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC key - navigate back
      if (event.key === 'Escape') {
        event.preventDefault();
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, enabled]);
}
