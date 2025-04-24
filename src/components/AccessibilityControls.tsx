import React, { useState } from 'react';
import { Settings, Sun, Moon, ZoomIn } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const AccessibilityControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { highContrast, toggleHighContrast, fontSize, setFontSize, announceMessage } = useAccessibility();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      announceMessage('Accessibility controls opened');
    }
  };

  const handleFontSizeChange = (size: 'normal' | 'large' | 'extra-large') => {
    setFontSize(size);
    announceMessage(`Font size set to ${size}`);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        aria-label="Accessibility settings"
      >
        <Settings size={24} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 z-50 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="font-medium text-slate-800 dark:text-white">Accessibility</span>
            <button
              onClick={toggleMenu}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <button
                onClick={toggleHighContrast}
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-pressed={highContrast}
              >
                <div className="flex items-center">
                  {highContrast ? (
                    <Moon size={20} className="mr-2 text-amber-500" />
                  ) : (
                    <Sun size={20} className="mr-2 text-amber-500" />
                  )}
                  <span className="text-slate-800 dark:text-white">
                    {highContrast ? 'Standard Contrast' : 'High Contrast'}
                  </span>
                </div>
                <div className={`w-10 h-5 rounded-full p-1 ${highContrast ? 'bg-teal-500' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-3 h-3 rounded-full transform transition-transform ${highContrast ? 'translate-x-5' : ''}`}></div>
                </div>
              </button>
            </div>
            
            <div className="px-2">
              <div className="flex items-center mb-2">
                <ZoomIn size={20} className="mr-2 text-amber-500" />
                <span className="text-slate-800 dark:text-white">Font Size</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFontSizeChange('normal')}
                  className={`flex-1 p-2 rounded-md ${fontSize === 'normal' ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'}`}
                  aria-pressed={fontSize === 'normal'}
                  aria-label="Normal font size"
                >
                  A
                </button>
                <button
                  onClick={() => handleFontSizeChange('large')}
                  className={`flex-1 p-2 rounded-md ${fontSize === 'large' ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'}`}
                  aria-pressed={fontSize === 'large'}
                  aria-label="Large font size"
                >
                  <span className="text-lg">A</span>
                </button>
                <button
                  onClick={() => handleFontSizeChange('extra-large')}
                  className={`flex-1 p-2 rounded-md ${fontSize === 'extra-large' ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'}`}
                  aria-pressed={fontSize === 'extra-large'}
                  aria-label="Extra large font size"
                >
                  <span className="text-xl">A</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityControls;