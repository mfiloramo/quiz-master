'use client';

import { ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import SessionManager from '@/components/session-manager/session-manager';

export default function HostPage(): ReactElement {
  // COMPONENT UTILITIES
  const router = useRouter();

  // HANDLER FUNCTIONS

  // RENDER PAGE
  return (
    <div>
      <SessionManager />
    </div>
  );
}
