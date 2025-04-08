import Link from "next/link";


export default function DashboardCard({ label, description, href }: {
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={ href }>
      <div
        className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:bg-slate-200 active:bg-slate-300 focus:bg-slate-300 transition cursor-pointer h-full ">
        <div className="text-2xl font-semibold mb-2">{ label }</div>
        <p className="text-sm text-gray-600">{ description }</p>
      </div>
    </Link>
  );
}
