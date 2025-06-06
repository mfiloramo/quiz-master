import { motion } from 'framer-motion';
import Link from 'next/link';
import { DashboardCardType } from '@/types/DashboardCard.type';

export default function DashboardCard({ label, description, href }: DashboardCardType) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.001 }}
        className='h-full max-w-xs cursor-pointer rounded-xl bg-white/70 p-6 shadow-md transition hover:bg-slate-200 hover:shadow-lg focus:bg-slate-300/70 active:bg-slate-300/70'
      >
        <div className='mb-2 text-2xl font-semibold'>{label}</div>
        <p className='text-sm text-gray-600'>{description}</p>
      </motion.div>
    </Link>
  );
}
