'use client'

import { useEffect, useRef, Suspense, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import InviteCard from '@/components/InviteCard'
import RSVPCard from '@/components/RSVPCard'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function TwentyYearsContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showLogoVideo, setShowLogoVideo] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const searchParams = useSearchParams()
  
  // Extract dynamic parameters
  const firstName = searchParams.get('firstName') || ''
  const lastName = searchParams.get('lastName') || ''
  const email = searchParams.get('email') || ''

  const handleVideoEnd = () => {
    setShowContent(true)
    setShowLogoVideo(false)
  }

  useEffect(() => {
    if (!showContent) return

    // GSAP animations for card reveals
    const ctx = gsap.context(() => {
      // Card animations
      gsap.utils.toArray('.glass-card').forEach((element: unknown) => {
        const el = element as Element
        gsap.fromTo(el,
          { y: 100, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      // Smooth scroll behavior
      gsap.registerPlugin(ScrollTrigger)
      
    }, containerRef)

    return () => ctx.revert()
  }, [showContent])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Logo Sting Video */}
      <AnimatePresence>
        {showLogoVideo && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <div className="w-full h-full flex items-center justify-center relative">
              <video
                autoPlay
                muted
                playsInline
                className="w-full h-[50%] md:w-full md:h-full object-cover"
                onEnded={handleVideoEnd}
              >
                <source src="/GJS Logo Sting v1.mp4" type="video/mp4" />
              </video>
              
              {/* Feathered edges to hide 16:9 aspect ratio */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-full h-[50%] md:h-full relative">
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black via-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Background */}
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

      {/* Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="relative z-10 min-h-screen flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading invitation...</div>
              </div>
            }>
              <InviteCard firstName={firstName} />
            </Suspense>
            <RSVPCard 
              firstName={firstName}
              lastName={lastName}
              email={email}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function TwentyYears() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <TwentyYearsContent />
    </Suspense>
  )
}
