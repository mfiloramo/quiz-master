import { ReactElement } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { AudioToggleType } from '@/types/AudioToggleType';

export default function AudioToggle(): ReactElement {
  // CONTEXT STATE
  const { music, handleToggleMusic, sound, handleToggleSound }: AudioToggleType = useAudio();

  return (
    <div className='inline-flex items-center gap-6 pt-3 text-2xl font-bold'>
      {/* MUSIC TOGGLE */}
      <label className='flex cursor-pointer items-center gap-2'>
        <div className='relative h-5 w-5'>
          <input
            type='checkbox'
            className='peer absolute h-full w-full cursor-pointer appearance-none rounded border border-slate-300 shadow transition-all checked:border-slate-800 checked:bg-slate-800 hover:shadow-md'
            onChange={handleToggleMusic}
            checked={music}
          />
          <span className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-3.5 w-3.5'
              viewBox='0 0 20 20'
              fill='currentColor'
              stroke='currentColor'
              strokeWidth='1'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </span>
        </div>
        🎵 Music
      </label>

      {/* SOUND TOGGLE */}
      <label className='flex cursor-pointer items-center gap-2'>
        <div className='relative h-5 w-5'>
          <input
            type='checkbox'
            className='peer absolute h-full w-full cursor-pointer appearance-none rounded border border-slate-300 shadow transition-all checked:border-slate-800 checked:bg-slate-800 hover:shadow-md'
            onChange={handleToggleSound}
            checked={sound}
          />
          <span className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-3.5 w-3.5'
              viewBox='0 0 20 20'
              fill='currentColor'
              stroke='currentColor'
              strokeWidth='1'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </span>
        </div>
        🔊 Sound
      </label>
    </div>
  );
}
