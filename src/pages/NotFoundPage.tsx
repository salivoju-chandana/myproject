import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, Home } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const NotFoundPage: React.FC = () => {
  const { announceMessage } = useAccessibility();

  useEffect(() => {
    announceMessage('Page not found. We could not find the page you were looking for.');
  }, [announceMessage]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
            <AlertOctagon size={48} className="text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">
          Page Not Found
        </h1>
        
        <p className="text-lg mb-8 text-slate-600 dark:text-slate-300">
          We couldn't find the page you were looking for. It might have been moved or deleted.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          <Home size={20} className="mr-2" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;