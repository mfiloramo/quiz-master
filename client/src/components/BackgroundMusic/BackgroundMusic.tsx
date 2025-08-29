'use client';

import { useEffect, useRef } from 'react';
import useSound from 'use-sound';

type Props = {
  tracks: string[];
  onStart?: () => void; // OPTIONAL CALLBACK WHEN MUSIC STARTS
};

export default function BackgroundMusic({ tracks, onStart }: Props) {
  // SELECT ONE RANDOM TRACK ONCE
  const selectedTrack = useRef(
    tracks[Math.floor(Math.random() * tracks.length)]
  );

  // SETUP LOOPING SOUND
  const [play, { sound }] = useSound(selectedTrack.current, {
    volume: 0.3,
    loop: true,
  });

  useEffect(() => {
    play(); // START MUSIC ON MOUNT
    onStart?.(); // TRIGGER CALLBACK IF PROVIDED

    return () => {
      sound?.stop(); // STOP MUSIC ON UNMOUNT
    };
  }, [play, sound, onStart]);

  return null;
}
