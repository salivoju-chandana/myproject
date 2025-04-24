import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Clock, Calendar, Activity, Info } from 'lucide-react';
import { useMedication } from '../context/MedicationContext';
import { useAccessibility } from '../context/AccessibilityContext';
import AccessibilityControls from '../components/AccessibilityControls';

const ResultsPage: React.FC = () => {
  const { searchResult, error, clearResults } = useMedication();
  const { announceMessage } = useAccessibility();
  const navigate = useNavigate();

  useEffect(() => {
    // If no result, redirect back to main interface
    if (!searchResult && !error) {
      navigate('/scan');
      return;
    }

    // Announce the medication information for screen readers
    if (searchResult) {
      const announcement = `Medication found: ${searchResult.name}, ${searchResult.dosage}. 
        Generic name: ${searchResult.genericName}. 
        Purpose: ${searchResult.purpose}. 
        Usage: ${searchResult.usage}. 
        Side effects: ${searchResult.sideEffects}. 
        Warnings: ${searchResult.warnings}. 
        Expiry date: ${formatExpiryDate(searchResult.expiryDate)}.`;
      
      announceMessage(announcement);
    } else if (error) {
      announceMessage(`Error: ${error}`);
    }

    return () => {
      clearResults();
    };
  }, [searchResult, error, navigate, announceMessage, clearResults]);

  const formatExpiryDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleBackClick = () => {
    navigate('/scan');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-teal-700 dark:bg-slate-800 text-white p-4 flex items-center justify-between shadow-md">
        <button 
          onClick={handleBackClick}
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-white p-2 rounded-lg"
          aria-label="Go back to scan page"
        >
          <ArrowLeft size={24} />
          <span className="ml-2 text-lg font-medium">Back to Scan</span>
        </button>
        <AccessibilityControls />
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 flex flex-col">
        {error ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 md:p-8 flex flex-col items-center text-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
              <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
              Medication Not Found
            </h2>
            <p className="text-lg mb-6 text-slate-600 dark:text-slate-300">
              {error}
            </p>
            <button
              onClick={handleBackClick}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Try Again
            </button>
          </div>
        ) : searchResult ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
              {searchResult.name} {searchResult.dosage}
            </h2>
            <p className="text-lg mb-6 text-slate-600 dark:text-slate-400 italic">
              {searchResult.genericName}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border-l-4 border-teal-500">
                <div className="flex items-start mb-2">
                  <Activity className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0" size={20} />
                  <h3 className="font-bold text-teal-800 dark:text-teal-200">Purpose</h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  {searchResult.purpose}
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-start mb-2">
                  <Clock className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" size={20} />
                  <h3 className="font-bold text-blue-800 dark:text-blue-200">Usage</h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  {searchResult.usage}
                </p>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-5 mb-6 border-l-4 border-amber-500">
              <div className="flex items-start mb-2">
                <AlertCircle className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0" size={20} />
                <h3 className="font-bold text-amber-800 dark:text-amber-200">Warnings</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                {searchResult.warnings}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                <h3 className="font-bold mb-2 text-slate-800 dark:text-white">Side Effects</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {searchResult.sideEffects}
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-start mb-2">
                  <Calendar className="text-slate-600 dark:text-slate-400 mr-2 flex-shrink-0" size={20} />
                  <h3 className="font-bold text-slate-800 dark:text-white">Expiry Date</h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  {formatExpiryDate(searchResult.expiryDate)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-4 sm:mb-0">
                <Info className="text-slate-500 dark:text-slate-400 mr-2" size={18} />
                <span className="text-slate-600 dark:text-slate-300">Manufacturer: {searchResult.manufacturer}</span>
              </div>
              
              <button
                onClick={handleBackClick}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                Scan Another
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResultsPage;