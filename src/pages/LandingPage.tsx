import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pill, AlertCircle, Volume2 } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { speak } from '../utils/speechUtils';
import AccessibilityControls from '../components/AccessibilityControls';

const LandingPage: React.FC = () => {
  const { announceMessage } = useAccessibility();

  useEffect(() => {
    // Announce page when it loads for screen readers
    announceMessage('Welcome to MediScan, your AI medication identifier for visually impaired users. Press the Start button to begin scanning or searching for medications.');
  }, [announceMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900 to-teal-800 flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 right-0 p-4">
        <AccessibilityControls />
      </header>
      
      <main className="flex flex-col items-center justify-center text-center max-w-3xl">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12 shadow-lg w-full max-w-lg mb-8 transform transition hover:scale-102 duration-300">
          <div className="flex justify-center mb-6">
            <div className="bg-teal-500 p-4 rounded-full">
              <Pill size={48} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800 dark:text-white">
            MediScan
          </h1>
          
          <p className="text-xl mb-8 text-slate-600 dark:text-slate-300">
            AI medication identification system designed for visually impaired users
          </p>
          
          <Link
            to="/scan"
            className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:ring-amber-300 focus:outline-none text-white text-xl font-bold rounded-lg transition-all duration-300 flex items-center justify-center"
            aria-label="Start scanning medications"
            onClick={() => speak('Starting MediScan. Please wait.')}
          >
            Start
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="bg-white/90 dark:bg-slate-800/90 p-6 rounded-xl shadow-md flex items-start">
            <Volume2 className="text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0" size={24} />
            <div>
              <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Voice Guidance</h2>
              <p className="text-slate-600 dark:text-slate-300">Audio feedback helps you navigate through every step of the process</p>
            </div>
          </div>
          
          <div className="bg-white/90 dark:bg-slate-800/90 p-6 rounded-xl shadow-md flex items-start">
            <AlertCircle className="text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0" size={24} />
            <div>
              <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Medication Safety</h2>
              <p className="text-slate-600 dark:text-slate-300">Get accurate information about your medications to ensure proper usage</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="absolute bottom-0 w-full text-center p-4 text-white/80">
        <p>© 2025 MediScan - AI Medicine Identification System</p>
      </footer>
    </div>
  );
};

export default LandingPage;