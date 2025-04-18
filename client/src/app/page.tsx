import { JSX } from 'react';
import DisplayBanner from '@/components/display-banner/display-banner';

export default function Home(): JSX.Element {
  const items = [
    '🚀 Learn fast',
    '🔥 Fail smart',
    '🔁 Iterate constantly',
    '🌱 Always be learning',
    '💡 Keep shipping',
  ];

  return (
    <div className='h-screen bg-stub-background-home text-center text-black'>
      <div className='px-2 pt-12'>
        <div className='mx-auto max-w-5xl text-7xl font-bold'>
          Build quizzes for your entire classroom
        </div>
        <div className='mx-auto mt-2 max-w-3xl text-2xl'>
          A dynamic and fun way to create an engaging learning environment among students
        </div>
        <div className={'mx-5 my-8'}>
          <DisplayBanner />
        </div>

        {/* SCROLLING MARQUEE */}
        <div className='relative h-12 w-full overflow-hidden bg-blue-800 pt-3'>
          <div className='flex animate-marquee whitespace-nowrap align-middle'>
            {[...items, ...items].map((item, index) => (
              <span key={index} className='mx-8 shrink-0 text-lg text-white'>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
