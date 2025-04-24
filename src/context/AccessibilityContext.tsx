import React, { createContext, useState, useContext, useEffect } from 'react';
import { speak } from '../utils/speechUtils';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'extra-large';
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  announceMessage: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');

  useEffect(() => {
    // Apply font size to document
    document.documentElement.classList.remove('text-normal', 'text-large', 'text-xl');
    document.documentElement.classList.add(`text-${fontSize}`);
    
    // Apply contrast mode
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast, fontSize]);

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
    speak(highContrast ? 'Standard contrast mode enabled' : 'High contrast mode enabled');
  };

  const announceMessage = (message: string) => {
    speak(message);
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        highContrast, 
        toggleHighContrast, 
        fontSize, 
        setFontSize,
        announceMessage
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};