'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'

const HeroSection = forwardRef<HTMLElement>((props, ref) => {
  const floatingElements = ['✨', '⭐', '💫', '🌟', '✨', '⭐']

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Dramatic Background Effects */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse-slow animation-delay-4000"></div>
        
        {/* Particle system */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className={`absolute text-3xl md:text-5xl floating-element opacity-40`}
            style={{
              top: `${15 + index * 15}%`,
              left: `${5 + index * 15}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + index * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {element}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Celebration Badge */}
        <motion.div
          className="celebration-badge inline-block glass text-white px-8 py-4 rounded-full text-sm font-semibold tracking-widest mb-12 shadow-xl border border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ boxShadow: 'var(--glow-blue)' }}
        >
          TWENTY YEARS
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          className="hero-title text-responsive-xl font-bold leading-tight mb-8"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <span className="block text-white/90 text-2xl md:text-3xl font-light tracking-widest mb-4">YOU&apos;RE INVITED TO</span>
          <span className="block gradient-text text-6xl md:text-8xl lg:text-9xl font-black tracking-tight">
            GJS
          </span>
          <span className="block text-white/80 text-3xl md:text-4xl font-light tracking-wide mt-4">
            20th Year Celebration
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="hero-subtitle text-responsive-md text-white/70 max-w-4xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
        >
          An exclusive evening celebrating two decades of innovation, excellence, and the future of property
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
        >
          <motion.button
            className="btn-primary text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300 font-semibold tracking-wide"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById('rsvp-section')?.scrollIntoView({ 
                behavior: 'smooth' 
              })
            }}
          >
            RSVP NOW
            <span className="ml-3 text-2xl">→</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
          <motion.div
            className="w-1 h-4 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

export default HeroSection
