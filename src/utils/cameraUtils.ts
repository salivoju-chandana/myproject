/**
 * Request access to the device camera and return a video stream
 * @returns Promise resolving to MediaStream
 */
export const requestCameraAccess = async (): Promise<MediaStream> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Prefer back camera
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    return stream;
  } catch (error) {
    console.error('Error accessing camera:', error);
    throw new Error('Camera access denied. Please enable camera permissions and try again.');
  }
};

/**
 * Take a photo using the video stream
 * @param videoElement The video element containing the camera stream
 * @returns Base64 encoded image data
 */
export const takePhoto = (videoElement: HTMLVideoElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not create canvas context');
  }
  
  // Draw the current video frame to the canvas
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  // Convert the canvas to a base64 encoded image
  const imageData = canvas.toDataURL('image/jpeg');
  return imageData;
};

/**
 * Stop all tracks in a media stream
 * @param stream The media stream to stop
 */
export const stopCameraStream = (stream: MediaStream): void => {
  stream.getTracks().forEach(track => track.stop());
};