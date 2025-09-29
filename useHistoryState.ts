import { useState, useCallback, useEffect } from 'react';

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

// Custom hook to manage state with undo/redo capabilities
export const useHistoryState = <T>(initialState: T) => {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  // Set a new state, adding the current state to the history
  const set = useCallback((newState: T | ((prevState: T) => T)) => {
    setState(currentState => {
      const newPresent = newState instanceof Function ? newState(currentState.present) : newState;
      
      // Don't add to history if state is the same
      if (JSON.stringify(newPresent) === JSON.stringify(currentState.present)) {
        return currentState;
      }

      return {
        past: [...currentState.past, currentState.present],
        present: newPresent,
        future: [], // Clear future on new state
      };
    });
  }, []);

  // Revert to the previous state
  const undo = useCallback(() => {
    if (!canUndo) return;

    setState(currentState => {
      const newPresent = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, currentState.past.length - 1);
      return {
        past: newPast,
        present: newPresent,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, [canUndo]);

  // Go forward to a future state
  const redo = useCallback(() => {
    if (!canRedo) return;

    setState(currentState => {
      const newPresent = currentState.future[0];
      const newFuture = currentState.future.slice(1);
      return {
        past: [...currentState.past, currentState.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, [canRedo]);

  return {
    state: state.present,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};