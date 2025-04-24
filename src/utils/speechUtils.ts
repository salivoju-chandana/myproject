// Speech utility functions for text-to-speech functionality

/**
 * Speaks the provided text using the browser's speech synthesis API
 * @param text The text to be spoken
 * @param rate The rate at which the text should be spoken (0.1 to 10)
 * @param pitch The pitch at which the text should be spoken (0 to 2)
 */
export const speak = (
  text: string, 
  rate: number = 1, 
  pitch: number = 1
): void => {
  // Stop any current speech
  stopSpeaking();
  
  // Create a new speech synthesis utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Configure the utterance
  utterance.rate = rate;
  utterance.pitch = pitch;
  
  // Use the browser's speech synthesis to speak the text
  window.speechSynthesis.speak(utterance);
};

/**
 * Stops any ongoing speech
 */
export const stopSpeaking = (): void => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Checks if the browser supports speech synthesis
 * @returns true if the browser supports speech synthesis, false otherwise
 */
export const isSpeechSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

/**
 * Gets all available voices for speech synthesis
 * @returns Array of SpeechSynthesisVoice objects
 */
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  return window.speechSynthesis.getVoices();
};