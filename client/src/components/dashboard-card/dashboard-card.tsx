import Link from 'next/link';

// TODO: MAKE DashBoardCard TYPE
export default function DashboardCard({
  label,
  description,
  href,
}: {
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className='h-full cursor-pointer rounded-xl bg-white p-6 shadow-md transition hover:bg-slate-200 hover:shadow-lg focus:bg-slate-300 active:bg-slate-300'>
        <div className='mb-2 text-2xl font-semibold'>{label}</div>
        <p className='text-sm text-gray-600'>{description}</p>
      </div>
    </Link>
  );
}
