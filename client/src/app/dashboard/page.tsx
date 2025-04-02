import { ReactElement } from "react";
import { DashboardItem } from "@/interfaces/DashboardItem";
import Link from "next/link";

export default function Dashboard(): ReactElement {
  const dashboardLinks: DashboardItem[] = [
    { path: '/', label: '🏠 Home' },
    { path: '/discover', label: '🧭 Discover' },
    { path: '/library', label: '📚 Library' },
    { path: '/settings', label: '⚙️ Settings' },
  ]

  return (
    // MAIN CONTAINER
    <div
      className='min-h-[calc(100vh-4rem)] text-black bg-gradient-to-b from-sky-300 to-sky-800 flex caret-transparent '>

      {/* SIDE NAVBAR */ }
      <div className={ 'h-[calc(100vh-4rem)] w-56 bg-slate-700 overflow-y-auto' }>

        {/* MOCK SIDENAV CONTENT */ }
        <ul className="pt-1 space-y-1">
          { dashboardLinks.map((item: DashboardItem) => (
            <Link href={ item.path }>
              <li
                key={ item.label }
                className="px-3 py-2 text-slate-100 hover:bg-slate-600 active:bg-slate-500 transition cursor-pointer"
              >
                { item.label }
              </li>
            </Link>
          )) }
        </ul>

      </div>

      {/* MAIN CONTENT */ }
      <></>

    </div>
  );
}
