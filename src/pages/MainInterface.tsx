import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Search, ArrowLeft, Mic } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useMedication } from '../context/MedicationContext';
import { requestCameraAccess, takePhoto, stopCameraStream } from '../utils/cameraUtils';
import { speak, stopSpeaking } from '../utils/speechUtils';
import AccessibilityControls from '../components/AccessibilityControls';
import Loader from '../components/Loader';

const MainInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'camera'>('search');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  
  const { announceMessage } = useAccessibility();
  const { searchMedication, identifyMedicationFromImage, isLoading, searchResult, error } = useMedication();

  useEffect(() => {
    announceMessage('Medication scan page. You can search by text or take a photo of your medication.');
    
    return () => {
      // Clean up camera stream if active
      if (cameraStream) {
        stopCameraStream(cameraStream);
      }
      stopSpeaking();
    };
  }, [announceMessage, cameraStream]);

  useEffect(() => {
    // If we have a search result, navigate to the results page
    if (searchResult) {
      navigate('/results');
    }
  }, [searchResult, navigate]);

  useEffect(() => {
    // Handle camera stream
    if (activeTab === 'camera' && isCameraActive) {
      const startCamera = async () => {
        try {
          const stream = await requestCameraAccess();
          setCameraStream(stream);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            announceMessage('Camera activated. Point your camera at the medication and tap the screen to capture.');
          }
        } catch (error) {
          console.error('Failed to start camera:', error);
          announceMessage('Failed to start camera. Please check permissions and try again.');
          setIsCameraActive(false);
        }
      };
      
      startCamera();
    } else if (!isCameraActive && cameraStream) {
      // Stop the camera stream if we switch away from camera tab
      stopCameraStream(cameraStream);
      setCameraStream(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [activeTab, isCameraActive, cameraStream, announceMessage]);

  const handleTabChange = (tab: 'search' | 'camera') => {
    setActiveTab(tab);
    announceMessage(tab === 'search' ? 'Text search mode activated' : 'Camera mode activated');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      announceMessage('Please enter a medication name');
      return;
    }
    
    announceMessage(`Searching for ${searchQuery}`);
    await searchMedication(searchQuery);
  };

  const handleCameraToggle = () => {
    setIsCameraActive(prev => !prev);
    if (isCameraActive && cameraStream) {
      stopCameraStream(cameraStream);
      setCameraStream(null);
      announceMessage('Camera deactivated');
    }
  };

  const handleCaptureImage = async () => {
    if (!videoRef.current || !cameraStream) return;
    
    announceMessage('Capturing image. Please hold still.');
    const imageData = takePhoto(videoRef.current);
    
    // Stop the camera after taking the photo
    stopCameraStream(cameraStream);
    setCameraStream(null);
    setIsCameraActive(false);
    
    announceMessage('Processing image to identify medication. Please wait.');
    await identifyMedicationFromImage(imageData);
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      announceMessage('Voice recognition is not supported in your browser');
      return;
    }
    
    setIsListening(true);
    announceMessage('Listening for medication name. Please speak clearly.');
    
    // @ts-ignore - TypeScript doesn't know about SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      announceMessage(`You said: ${transcript}`);
      setIsListening(false);
    };
    
    recognition.onerror = () => {
      announceMessage('Error occurred in voice recognition. Please try again.');
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-teal-700 dark:bg-slate-800 text-white p-4 flex items-center justify-between shadow-md">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-white p-2 rounded-lg"
          aria-label="Go back to home page"
        >
          <ArrowLeft size={24} />
          <span className="ml-2 text-lg font-medium">MediScan</span>
        </button>
        <AccessibilityControls />
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 flex flex-col">
        {/* Tab navigation */}
        <div className="flex bg-white dark:bg-slate-800 rounded-lg shadow-md mb-6">
          <button
            className={`flex-1 py-4 text-center text-lg font-semibold transition-colors duration-200 ${
              activeTab === 'search' 
                ? 'bg-amber-500 text-white rounded-l-lg' 
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            onClick={() => handleTabChange('search')}
            aria-label="Search by text"
            aria-selected={activeTab === 'search'}
          >
            <div className="flex items-center justify-center">
              <Search size={20} className="mr-2" />
              <span>Search</span>
            </div>
          </button>
          <button
            className={`flex-1 py-4 text-center text-lg font-semibold transition-colors duration-200 ${
              activeTab === 'camera' 
                ? 'bg-amber-500 text-white rounded-r-lg' 
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            onClick={() => handleTabChange('camera')}
            aria-label="Scan with camera"
            aria-selected={activeTab === 'camera'}
          >
            <div className="flex items-center justify-center">
              <Camera size={20} className="mr-2" />
              <span>Camera</span>
            </div>
          </button>
        </div>
        
        {/* Tab content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 md:p-8 flex-1">
          {activeTab === 'search' && (
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
                Search for a Medication
              </h2>
              
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Enter medication name..."
                    className="w-full p-4 pr-20 text-lg border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-amber-500 dark:bg-slate-700 dark:text-white"
                    aria-label="Medication name"
                  />
                  
                  <button
                    type="button"
                    onClick={startVoiceRecognition}
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 p-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md"
                    aria-label={isListening ? 'Listening...' : 'Voice search'}
                    disabled={isListening}
                  >
                    <Mic size={24} className={isListening ? 'animate-pulse' : ''} />
                  </button>
                  
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-md"
                    aria-label="Search"
                    disabled={isLoading}
                  >
                    <Search size={24} />
                  </button>
                </div>
              </form>
              
              {isListening && (
                <div className="p-4 mb-4 bg-teal-100 dark:bg-teal-900 rounded-lg">
                  <p className="text-center text-lg">
                    Listening... Speak the name of the medication.
                  </p>
                </div>
              )}
              
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <p className="text-lg mb-4 text-slate-600 dark:text-slate-300">
                  Example searches: "Aspirin", "Lisinopril"
                </p>
                
                {error && (
                  <div className="p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg max-w-md mx-auto">
                    <p>{error}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'camera' && (
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
                Scan a Medication
              </h2>
              
              <div className="flex-1 flex flex-col">
                {!isCameraActive ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <button
                      onClick={handleCameraToggle}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-md transition duration-300"
                      aria-label="Activate camera"
                    >
                      <div className="flex items-center">
                        <Camera size={24} className="mr-2" />
                        <span>Activate Camera</span>
                      </div>
                    </button>
                    <p className="mt-6 text-slate-600 dark:text-slate-300 text-center">
                      Point your camera at a medication label or pill to identify it.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div 
                      className="relative flex-1 bg-black rounded-lg overflow-hidden mb-4 cursor-pointer"
                      onClick={handleCaptureImage}
                    >
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isLoading ? (
                          <Loader size="large" />
                        ) : (
                          <div className="border-2 border-white border-opacity-50 rounded-lg w-11/12 h-5/6 flex items-center justify-center">
                            <p className="text-white text-xl font-medium bg-black bg-opacity-50 p-2 rounded">
                              Tap to capture
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCameraToggle}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg self-center transition duration-300"
                      aria-label="Deactivate camera"
                    >
                      Turn Off Camera
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg text-center">
                <Loader size="large" />
                <p className="mt-4 text-xl font-medium text-slate-800 dark:text-white">
                  {activeTab === 'camera' ? 'Processing image...' : 'Searching database...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainInterface;