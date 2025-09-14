'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [showLogoVideo, setShowLogoVideo] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // After 3 seconds, fade to invite
    const timer = setTimeout(() => {
      setShowInvite(true)
      // After fade completes, redirect to 20-years page
      setTimeout(() => {
        router.push('/20-years')
      }, 2000)
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Logo Sting Video */}
      <AnimatePresence>
        {showLogoVideo && (
          <motion.div
            className="fixed inset-0 z-20 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <video
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              onEnded={() => setShowLogoVideo(false)}
            >
              <source src="/GJS Logo Sting v1.mp4" type="video/mp4" />
            </video>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Invite Content */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            className="relative z-10 min-h-screen flex items-center justify-center px-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
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

              {/* Invitation Text */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
              >
                <h1 className="text-2xl md:text-3xl font-light text-white/80 tracking-wide mb-8">
                  YOU&apos;RE INVITED TO
                </h1>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  20th Year Celebration
                </h2>
                <p className="text-lg text-white/60 font-light">
                  Thursday, 30th October 2025
                </p>
              </motion.div>

              {/* Loading indicator */}
              <motion.div
                className="flex items-center justify-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}