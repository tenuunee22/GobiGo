import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Define the media query
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    // Set the initial value
    setIsMobile(mediaQuery.matches);
    
    // Define a callback function to handle changes
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    
    // Add the callback as a listener for changes to the media query
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    
    // Cleanup function to remove the listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return isMobile;
}