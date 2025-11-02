import React, { useState, useEffect, useRef } from 'react';
import type { BreathingSettings } from '../types';
import { SoundOption } from '../types';
import { useWakeLock } from '../hooks/useWakeLock';

interface BreathingMeditationProps {
  settings: BreathingSettings;
  assets: { 
    soundEffect: string;
    voiceFiles: { [key: number]: string };
  };
  onComplete: (letters: string[]) => void;
  onExit: () => void;
}

const BreathingMeditation: React.FC<BreathingMeditationProps> = ({ settings, assets, onComplete, onExit }) => {
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const totalDuration = settings.duration * 60;
  const initialCount = Math.floor(totalDuration / settings.interval);
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const [currentDisplay, setCurrentDisplay] = useState<string | number>(initialCount);
  
  const lettersRef = useRef<string[]>([]);
  const letterIndicesRef = useRef<number[]>([]);
  const effectAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    requestWakeLock();
    const indices = new Set<number>();
    while(indices.size < 5) {
        indices.add(Math.floor(Math.random() * (initialCount - 2)) + 1);
    }
    letterIndicesRef.current = Array.from(indices).sort((a, b) => b - a);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    lettersRef.current = Array.from({length: 5}).map(() => alphabet[Math.floor(Math.random() * alphabet.length)]);

    if (assets.soundEffect) {
        effectAudioRef.current = new Audio(assets.soundEffect);
    }
    
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
      const currentCount = Math.floor(timeLeft / settings.interval);
      let displayValue: string | number = currentCount;

      if(letterIndicesRef.current.includes(currentCount)) {
          const letterIndex = letterIndicesRef.current.indexOf(currentCount);
          displayValue = lettersRef.current[letterIndex];
      }

      setCurrentDisplay(displayValue);

      if (typeof displayValue === 'number') {
        if(settings.sound === SoundOption.VOICE) {
            const unitDigit = displayValue % 10;
            const voiceSrc = assets.voiceFiles?.[unitDigit];
            if (voiceSrc) {
                if (!voiceAudioRef.current) {
                    voiceAudioRef.current = new Audio();
                }
                voiceAudioRef.current.src = voiceSrc;
                voiceAudioRef.current.play().catch(e => console.error("Error playing voice file:", e));
            }
        } else if (settings.sound === SoundOption.EFFECT && effectAudioRef.current) {
            effectAudioRef.current.play().catch(e => console.error("Error playing sound effect:", e));
        }
      } else {
        if (settings.sound === SoundOption.EFFECT && effectAudioRef.current) {
            effectAudioRef.current.play().catch(e => console.error("Error playing sound effect:", e));
        }
      }
      
  }, [Math.floor(timeLeft / settings.interval), settings.sound, settings.interval, assets]);

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
        <span className="text-8xl md:text-9xl font-thin tracking-tighter" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)'}}>
          {currentDisplay}
        </span>
      </div>
       <div className={`absolute bottom-10 text-center transition-opacity`}>
        <div className="text-xl text-gray-700 font-light">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
      </div>
    </div>
  );
};

export default BreathingMeditation;