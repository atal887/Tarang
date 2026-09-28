import { useState, useEffect } from 'react';

export type ChatMode = "Normal" | "Research";

// Simple global state manager using a singleton pattern since we don't have Zustand
// and want to avoid modifying App.tsx to add a Provider.
let globalMode: ChatMode = "Normal";
const listeners: Set<() => void> = new Set();

export function useAppStore() {
  const [activeMode, setLocalMode] = useState<ChatMode>(globalMode);

  useEffect(() => {
    const listener = () => setLocalMode(globalMode);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setActiveMode = (mode: ChatMode) => {
    globalMode = mode;
    listeners.forEach((listener) => listener());
  };

  return { activeMode, setActiveMode };
}
