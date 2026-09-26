import { useState } from 'react';

export type Message = {
  id: string;
  text: string;
  isBot: boolean;
  action: string | null;
  intent: string | null;
  payload?: any;
};

const INITIAL_MSG: Message = {
  id: "init-1",
  text: "Namaskaram. How can I help you today?",
  isBot: true,
  action: null,
  intent: null
};

export function useChatStore() {
  const [messages, setMessagesState] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem('tarangChat');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to parse chat store", e);
    }
    return [INITIAL_MSG];
  });

  const setMessages = (updateFn: (prev: Message[]) => Message[]) => {
    setMessagesState((prev) => {
      const next = updateFn(prev);
      localStorage.setItem('tarangChat', JSON.stringify(next));
      return next;
    });
  };

  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages((prev) => [...prev, { ...msg, id: Date.now() + Math.random().toString() }]);
  };
  
  const updateLastMessageAction = (action: string) => {
    setMessages((prev) => {
       const copy = [...prev];
       if (copy.length > 0) {
         copy[copy.length - 1] = { ...copy[copy.length - 1], action };
       }
       return copy;
    });
  };

  const clearChat = () => {
    const newChat = [{ ...INITIAL_MSG, id: Date.now() + Math.random().toString() }];
    setMessagesState(newChat);
    localStorage.setItem('tarangChat', JSON.stringify(newChat));
  };

  return { messages, addMessage, updateLastMessageAction, clearChat };
}
