import { DashboardItem } from "@/interfaces/DashboardItem";
import SideNavbar from "@/components/side-navbar/side-navbar";

type DashboardLinks = {
  children: any;
}

export default function Dashboard({ children }: any): DashboardLinks {
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
      <div>{ children }</div>

    </div>
  );
}
