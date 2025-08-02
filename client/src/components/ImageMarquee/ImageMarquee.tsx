'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ImageMarquee() {
  const images = [...Array(9)].map((_, i) => `/screenshots/${i + 1}.png`);
  const allImages = [...images, ...images];

  return (
    <div className='mx-auto my-12 w-full max-w-[85vw] overflow-hidden rounded-lg bg-gradient-to-b from-emerald-600 to-emerald-500 px-4 shadow-xl'>
      <motion.div
        className='flex animate-marquee items-center whitespace-nowrap py-3'
        aria-hidden='true'
      >
        {allImages.map((src, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.08 }}
            className='mx-4 min-w-fit'
          >
            <Image
              src={src}
              width={400}
              height={250}
              alt={`Screenshot ${index + 1}`}
              className='rounded-md shadow-xl'
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
