import React, { createContext, useState, useContext } from 'react';
import { Medication } from '../types/medication';

interface MedicationContextType {
  searchResult: Medication | null;
  isLoading: boolean;
  error: string | null;
  searchMedication: (query: string) => Promise<void>;
  identifyMedicationFromImage: (imageData: string) => Promise<void>;
  clearResults: () => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchResult, setSearchResult] = useState<Medication | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchMedication = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to your backend
      const result = await mockSearchMedication(query);
      setSearchResult(result);
    } catch (err) {
      setError('Failed to find medication. Please try again.');
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const identifyMedicationFromImage = async (imageData: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would send the image to Azure Computer Vision API
      // and then search the database with the extracted text
      const extractedText = await mockExtractTextFromImage(imageData);
      const result = await mockSearchMedication(extractedText);
      setSearchResult(result);
    } catch (err) {
      setError('Failed to identify medication from image. Please try again or use text search.');
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setSearchResult(null);
    setError(null);
  };

  return (
    <MedicationContext.Provider 
      value={{ 
        searchResult, 
        isLoading, 
        error, 
        searchMedication, 
        identifyMedicationFromImage,
        clearResults
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = (): MedicationContextType => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};

// Mock functions for demonstration purposes
// These would be replaced with actual API calls in production
const mockExtractTextFromImage = async (imageData: string): Promise<string> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a simulated extracted text based on the image data
  // In reality, this would be the result from Azure OCR
  return 'Aspirin 325mg';
};

const mockSearchMedication = async (query: string): Promise<Medication> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data based on the query
  const normalizedQuery = query.toLowerCase();
  
  if (normalizedQuery.includes('aspirin')) {
    return {
      id: '1',
      name: 'Aspirin',
      genericName: 'Acetylsalicylic acid',
      dosage: '325mg',
      purpose: 'Pain reliever, fever reducer',
      usage: 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 12 tablets in 24 hours.',
      sideEffects: 'Stomach upset, heartburn, nausea, vomiting, stomach bleeding',
      warnings: 'Do not use if allergic to aspirin or NSAIDs. Consult doctor if pregnant or breastfeeding.',
      expiryDate: '2025-12-31',
      manufacturer: 'Bayer'
    };
  } else if (normalizedQuery.includes('lisinopril')) {
    return {
      id: '2',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: '10mg',
      purpose: 'ACE inhibitor, blood pressure medication',
      usage: 'Take one tablet daily with or without food.',
      sideEffects: 'Dizziness, headache, dry cough, increased potassium levels',
      warnings: 'Do not use if pregnant. May cause swelling of face, lips, tongue, or throat.',
      expiryDate: '2024-08-15',
      manufacturer: 'Merck'
    };
  } else {
    throw new Error('Medication not found in database');
  }
};