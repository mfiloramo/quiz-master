import { RegisterProvider } from '@/contexts/RegisterContext';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RegisterProvider>
      <div className={'h-screen bg-gradient-to-b from-cyan-300 to-cyan-500'}>
        {children}
      </div>
    </RegisterProvider>
  );
}
