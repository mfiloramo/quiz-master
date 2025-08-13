import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement, useState } from 'react';

type ToastNotificationProps = {
  notificationType: string;
  notificationMsg: string;
};

enum ToastMode {
  Success = 'green',
  Warning = 'amber',
  Error = 'red',
}

export default function ToastNotification({
  notificationType,
  notificationMsg,
}: ToastNotificationProps): ReactElement {
  // COMPONENT STATE
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // COMPONENT VARIABLES
  const toastColor = ToastMode[notificationType];
  let timer: NodeJS.Timeout | number | null = null;
  const timeout: number = 5000;

  // TIMER TO DISAPPEAR
  timer = setTimeout(() => setIsVisible(false), timeout);

  // RENDER COMPONENT
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute bottom-4 z-50 bg-${toastColor}-500 rounded-xl px-24 py-8 text-center text-xl shadow-2xl`}
        >
          {notificationMsg}
          <button className={'p-1'} onClick={() => setIsVisible(false)}>
            X
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
