import { DashboardItem } from '@/types/DashboardItem.type';
import Link from 'next/link';
import { ReactElement } from 'react';

export default function SideNavbar({ dashboardLinks }: any): ReactElement {
  return (
    // MAIN CONTAINER
    <div className={'h-[calc(100vh-4rem)] w-56 overflow-y-auto bg-slate-700'}>
      {/* SIDENAV BUTTONS */}
      <ul className='space-y-1 pt-1'>
        {dashboardLinks.map((item: DashboardItem, index: number) => (
          <Link href={item.path} key={item.label || index}>
            <li className='cursor-pointer px-3 py-2 text-xl text-slate-100 transition hover:bg-slate-600 active:bg-slate-500'>
              {item.label}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
