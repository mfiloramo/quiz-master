import { JSX } from "react";
import DashboardCard from "@/components/dashboard-card/dashboard-card";

export default function DashboardHome(): JSX.Element {
  const DashboardCards: object[] = [
    {
      label: "🧭 Discover",
      href: "/dashboard/discover",
      description: "Find new quizzes curated just for you."
    },
    {
      label: "📚 Library",
      href: "/dashboard/library",
      description: "Access all your saved and created quizzes."
    },
    {
      label: "⚙️ Settings",
      href: "/dashboard/settings",
      description: "Manage your profile and preferences."
    }
  ]


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold text-white">Welcome to Your Dashboard</h1>

      <p className="text-lg text-slate-100 max-w-2xl">
        Use the sidebar to navigate through your dashboard features like discovering new quizzes, managing your library,
        or adjusting settings.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        { DashboardCards.map((card: any, index: number) => (
          <DashboardCard
            key={ index }
            label={ card.label }
            description={ card.description }
            href={ card.href }
          />
        )) }
      </ul>
    </div>
  );
}
