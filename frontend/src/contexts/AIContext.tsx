import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
  language: string;
  video_title: string;
  sentiment: {
    polarity: number;
    subjectivity: number;
    confidence: number;
  };
}

interface AIContextType {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  clearComments: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const clearComments = () => {
    setComments([]);
  };

  const value = {
    comments,
    setComments,
    clearComments
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}; 