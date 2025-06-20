import { ReactElement } from 'react';
import StaticSection from '@/components/StaticSection/StaticSection';
import teachersPageContent from '@/data/teachers/teachers-data.json';

export default function TeachersPage(): ReactElement {
  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div className={'flex flex-col items-center bg-stub-background-dashboard bg-cover text-black'}>
      {teachersPageContent.sections.map((section: any, index: number) => (
        <StaticSection key={index} section={section} listNum={index} />
      ))}
    </div>
  );
}
