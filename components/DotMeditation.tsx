import React, { useState, useEffect, useRef } from 'react';
import type { DotSettings } from '../types';
import { useWakeLock } from '../hooks/useWakeLock';

interface DotMeditationProps {
  settings: DotSettings;
  assets: { lotusImage: string };
  onComplete: (letters: string[]) => void;
  onExit: () => void;
}

const DotMeditation: React.FC<DotMeditationProps> = ({ settings, assets, onComplete, onExit }) => {
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const totalDuration = settings.duration * 60;
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const [isShowingLetter, setIsShowingLetter] = useState(false);
  const [currentLetter, setCurrentLetter] = useState('');

  const lettersRef = useRef<string[]>([]);
  const letterTimingsRef = useRef<number[]>([]);
  const letterTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    requestWakeLock();
    const timings = new Set<number>();
    while (timings.size < 5) {
      timings.add(Math.floor(Math.random() * (totalDuration - 10)) + 5);
    }
    letterTimingsRef.current = Array.from(timings).sort((a, b) => b - a);
    
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    lettersRef.current = Array.from({ length: 5 }).map(() => alphabet[Math.floor(Math.random() * alphabet.length)]);

    return () => {
      releaseWakeLock();
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(lettersRef.current);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  useEffect(() => {
    const clearLetterTimeout = () => {
        if (letterTimeoutRef.current) {
            clearTimeout(letterTimeoutRef.current);
            letterTimeoutRef.current = null;
        }
    };

    const scheduledTimeIndex = letterTimingsRef.current.indexOf(timeLeft);

    if (scheduledTimeIndex !== -1) {
      setCurrentLetter(lettersRef.current[scheduledTimeIndex]);
      setIsShowingLetter(true);

      clearLetterTimeout();
      letterTimeoutRef.current = window.setTimeout(() => {
        setIsShowingLetter(false);
        letterTimeoutRef.current = null;
      }, 3000);
    }

    return () => clearLetterTimeout();
  }, [timeLeft]);

  const progress = (totalDuration - timeLeft) / totalDuration;
  const hue = progress * 360;

  return (
    <div className="relative w-screen h-screen flex items-center justify-center text-white overflow-hidden">
        <button 
            onClick={onExit}
            className="absolute top-5 right-5 z-50 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-transform hover:scale-110"
            aria-label="종료"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

      <div 
        className={`absolute w-80 h-80 md:w-96 md:h-96 rounded-full flex items-center justify-center transition-all duration-1000`}
        style={{
          backgroundColor: `hsla(${hue}, 80%, 60%, 0.3)`,
          boxShadow: `0 0 80px hsla(${hue}, 80%, 60%, 0.7)`,
        }}
      >
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
          {isShowingLetter ? (
            <span className="text-7xl font-thin tracking-tighter" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)'}}>{currentLetter}</span>
          ) : (
            <img src={assets.lotusImage} alt="Lotus" className="w-full h-full object-cover" />
          )}
        </div>
      </div>
       <div className={`absolute bottom-10 text-center transition-opacity`}>
        <div className="text-xl text-gray-700 font-light">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
      </div>
    </div>
  );
};

export default DotMeditation;