import { JSX } from 'react';
import PhotoMarquee from '@/components/PhotoMarquee/PhotoMarquee';

export default function Home(): JSX.Element {
  const items = [
    '🎮 Turn quizzes into games',
    '🏆 Climb the leaderboard',
    '👩‍🏫 Engage every student',
    '📊 Track learning in real time',
    '📱 Quiz anywhere, anytime',
  ];

  return (
    <div className='h-screen bg-stub-background-home text-center text-black'>
      <div className='px-2 pt-12'>
        <div className='mx-auto mb-4 max-w-5xl px-4 text-7xl font-bold'>
          Make Every Lesson a Game Worth Playing
        </div>
        <div className='mx-auto mb-10 mt-2 max-w-3xl text-2xl'>
          QuizMaster makes it easy to create fast-paced, interactive quizzes that students will
          actually look forward to.
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

        {/* SCROLLING PHOTO GALLERY */}
        <div className={'mx-5 my-8'}>
          <PhotoMarquee />
        </div>
      </div>
    </div>
  );
}
