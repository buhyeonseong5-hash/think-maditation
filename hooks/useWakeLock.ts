
import React, { useState, useEffect, useCallback, useRef } from 'react';

export const useWakeLock = () => {
  const [isSupported, setIsSupported] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      console.log('Wake Lock is active.');
      wakeLockRef.current.addEventListener('release', () => {
        console.log('Wake Lock was released.');
      });
    } catch (err: any) {
      console.error(`${err.name}, ${err.message}`);
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  }, []);

  return { requestWakeLock, releaseWakeLock, isSupported };
};
