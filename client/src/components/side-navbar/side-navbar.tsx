import { DashboardItem } from "@/interfaces/DashboardItem";
import Link from "next/link";
import { ReactElement } from "react";

export default function SideNavbar({ dashboardLinks }: any): ReactElement {
  return (
    // MAIN CONTAINER
    <div className={ 'h-[calc(100vh-4rem)] w-56 bg-slate-700 overflow-y-auto' }>

      {/* SIDENAV BUTTONS */ }
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
  );
}
