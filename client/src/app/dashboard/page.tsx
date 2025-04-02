import { ReactElement } from "react";
import { DashboardItem } from "@/interfaces/DashboardItem";
import Link from "next/link";
import SideNavbar from "@/components/side-navbar/side-navbar";

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

      {/* SIDE NAVBAR */}
      <SideNavbar dashboardLinks={ dashboardLinks }/>

      {/* MAIN CONTENT */ }
      <></>

    </div>
  );
}
