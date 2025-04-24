import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MainInterface from './pages/MainInterface';
import ResultsPage from './pages/ResultsPage';
import NotFoundPage from './pages/NotFoundPage';
import { MedicationProvider } from './context/MedicationContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

function App() {
  return (
    <AccessibilityProvider>
      <MedicationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/scan" element={<MainInterface />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </MedicationProvider>
    </AccessibilityProvider>
  );
}

export default App;