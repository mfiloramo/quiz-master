import { JSX } from 'react';
import ImageMarquee from '@/components/ImageMarquee/ImageMarquee';
import StaticSection from '@/components/StaticSection/StaticSection';
import homePageContent from '@/data/app-data.json';

export default function Home(): JSX.Element {
  const items = [
    '🎮 Turn quizzes into games',
    '🏆 Climb the leaderboard',
    '👩‍🏫 Engage every student',
    '📊 Track learning in real time',
    '📱 Quiz anywhere, anytime',
  ];

  return (
    <div className='mx-auto overflow-x-hidden bg-stub-background-home bg-cover py-10 text-black'>
      <div className='px-4 text-center'>
        {/* HERO TITLE */}
        <h1 className='mx-auto mb-6 max-w-5xl text-5xl font-bold leading-tight md:text-6xl lg:text-7xl'>
          Make Every Lesson a Game Worth Playing
        </h1>

        {/* HERO SUBTEXT */}
        <p className='mx-auto mb-12 max-w-3xl text-xl md:text-2xl'>
          QuizMaster makes it easy to create fast-paced, interactive quizzes
          that students will actually look forward to.
        </p>

        {/* SCROLLING WORDS MARQUEE */}
        <div className='relative -ml-4 h-12 w-screen cursor-default overflow-hidden bg-blue-800'>
          <div className='flex animate-marquee items-center whitespace-nowrap py-3'>
            {[...items, ...items].map((item, index) => (
              <span
                key={index}
                className='mx-8 shrink-0 text-base text-white md:text-lg'
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* SCROLLING PHOTO MARQUEE */}
        <ImageMarquee />

        {/* STATIC TEXT SECTIONS */}
        <div className='mx-auto my-16 justify-items-center space-y-16 px-4'>
          {homePageContent.sections.map((section: any, index: number) => (
            <StaticSection key={index} section={section} listNum={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
