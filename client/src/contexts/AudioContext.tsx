'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

// CONTEXT INSTANCE
const AudioContext = createContext<any | null>(null);

// PROVIDER COMPONENT
export function AudioProvider({ children }: { children: ReactNode }) {
  // STATE HOOKS
  // TODO: THIS WILL LATER SHOW USER'S STATE ACCORDING TO PERSONAL SETTINGS
  const [music, setMusic] = useState<boolean>(true);
  const [sound, setSound] = useState<boolean>(true);

  // LOAD FROM LOCALSTORAGE ON INIT
  useEffect(() => {
    const storedMusic = localStorage.getItem('music');
    const storedSound = localStorage.getItem('audio');
    if (storedMusic !== null) setMusic(storedMusic === 'true');
    if (storedSound !== null) setSound(storedSound === 'true');
  }, []);

  // PERSIST TO LOCALSTORAGE WHEN STATE CHANGES
  useEffect(() => {
    localStorage.setItem('music', String(music));
  }, [music]);

  useEffect(() => {
    localStorage.setItem('sound', String(sound));
  }, [sound]);

  // HANDLER FUNCTIONS (WRAPPED IN useCallback TO PREVENT UNNECESSARY RE-RENDERS)
  const handleToggleMusic = useCallback((): void => {
    setMusic((prev) => !prev);
  }, []);

  const handleToggleSound = useCallback((): void => {
    setSound((prev) => !prev);
  }, []);

  return (
    <AudioContext.Provider
      value={{ music, handleToggleMusic, sound, handleToggleSound }}
    >
      {children}
    </AudioContext.Provider>
  );
}

// CUSTOM HOOK
export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
