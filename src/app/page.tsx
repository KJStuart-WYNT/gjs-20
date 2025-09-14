'use client'

import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/abstract-blue-folding-and-unfolding-animation-2025-09-02-06-29-11-utc.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* GJS Logo */}
      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center px-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div className="text-center">
          {/* GJS Logo */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          >
            <img 
              src="/Primary_Dark-GJS@150pp.png" 
              alt="GJS Property" 
              className="h-32 md:h-40 lg:h-48 mx-auto drop-shadow-2xl filter brightness-110 contrast-110"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}