import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Дэлгэцийн хэмжээ өөрчлөгдөхөд дахин шалгах
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Эхлээд нэг шалгах
    checkIfMobile();

    // Listener нэмэх
    window.addEventListener('resize', checkIfMobile);

    // Устгах
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return isMobile;
}