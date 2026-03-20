import React, { useState, useRef, useEffect } from 'react';

const CYBER_CHARS = 'ABCDEF0123456789_!@#$^&%*()[]{}<>?';

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealSpeed?: number;
  as?: any;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ 
  text, 
  className = '', 
  scrambleSpeed = 40,
  revealSpeed = 0.4,
  as: Component = 'span' 
}) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const startScramble = () => {
    let iteration = 0;
    
    if (intervalRef.current) window.clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
      }

      iteration += revealSpeed;
    }, scrambleSpeed);
  };

  return (
    <Component 
      className={`${className}`}
      onMouseEnter={startScramble}
    >
      {displayText}
    </Component>
  );
};

export default ScrambleText;