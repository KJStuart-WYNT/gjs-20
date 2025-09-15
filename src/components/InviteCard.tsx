'use client'

import { motion } from 'framer-motion'

interface InviteCardProps {
  firstName?: string
}

const InviteCard = ({ firstName }: InviteCardProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-8">
      <motion.div
        className="glass-card glass max-w-4xl w-full rounded-3xl p-8 md:p-12 text-center border border-white/20 shadow-2xl"
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >

        {/* Personalized Greeting */}
        {firstName && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-white/80 tracking-wide">
              <span className="font-semibold text-white">{firstName}</span>
            </h2>
          </motion.div>
        )}

        {/* Main Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        >
          <div className="text-xl md:text-2xl font-light tracking-[0.3em] text-white/70 mb-6">
            YOU&apos;RE INVITED TO
          </div>
          
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
          >
            <img 
              src="/Primary_Dark-GJS@150pp.png" 
              alt="GJS" 
              className="h-16 md:h-20 lg:h-24 mx-auto drop-shadow-2xl filter brightness-110 contrast-110"
            />
          </motion.div>
          
          <div className="text-4xl md:text-5xl lg:text-6xl font-thin text-white/90 tracking-wide">
            <span className="holographic-20 text-5xl md:text-6xl lg:text-7xl font-black mr-2">20</span>
            <span className="text-3xl md:text-4xl lg:text-5xl font-light">th</span>
            <div className="text-lg md:text-xl lg:text-2xl font-light tracking-widest mt-2 text-white/60">
              YEAR CELEBRATION
            </div>
          </div>
          
          {/* Invitation Text */}
          <motion.div
            className="mt-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
          >
            <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed">
              The GJS Property Team would love you to join us for our 20th year Celebration for some canapés and drink or two 🥂
            </p>
          </motion.div>
        </motion.div>

        {/* Event Details - Elegant Typography */}
        <motion.div
          className="space-y-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
        >
          {/* Date */}
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-thin text-white/90 mb-1">
              Thursday, 30th October
            </div>
            <div className="text-lg text-white/60 font-light">
              2025
            </div>
          </div>

          {/* Time */}
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-light text-white/80 mb-1">
              4:00 PM
            </div>
            <div className="text-base text-white/50 font-light">
              until 8:00 PM
            </div>
            <div className="text-sm text-white/40 font-light italic mt-2">
              Starting from 4pm until 8pm - feel free to arrive when convenient for you!
            </div>
          </div>

          {/* Location */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xl md:text-2xl font-light text-white/80 mb-1">
              Level 10, Shell House
            </div>
            <div className="text-base text-white/60 font-light mb-1">
              37 Margaret Street, Sydney
            </div>
            <div className="text-sm text-white/40 font-light">
              Accessed via Wynyard Lane
            </div>
          </div>
        </motion.div>

        {/* Elegant RSVP Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
        >
          <div className="text-base text-white/60 font-light mb-4">
            Please respond by Tuesday, 22nd October
          </div>
          <motion.button
            className="group relative inline-flex items-center justify-center px-12 py-4 text-base font-light tracking-widest text-white border border-white/30 rounded-full hover:border-white/60 transition-all duration-500 overflow-hidden mb-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              document.getElementById('rsvp-card')?.scrollIntoView({ 
                behavior: 'smooth' 
              })
            }}
          >
            <span className="relative z-10">RSVP</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.button>

          {/* Calendar Integration */}
          <div className="text-sm text-white/50 font-light mb-4">
            Add to Calendar
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <motion.a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=GJS%2020th%20Year%20Celebration&dates=20251030T050000Z/20251030T090000Z&details=The%20GJS%20Property%20Team%20would%20love%20you%20to%20join%20us%20for%20our%2020th%20year%20Celebration%20for%20some%20canapés%20and%20drink%20or%20two%20🥂&location=Level%2010%2C%20Shell%20House%2C%2037%20Margaret%20Street%2C%20Sydney"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-light tracking-wide text-white/80 border border-white/20 rounded-full hover:border-white/40 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Google</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.a>

            <motion.a
              href="ms-outlook://calendar/action/compose?subject=GJS%2020th%20Year%20Celebration&startdt=2025-10-30T05:00:00Z&enddt=2025-10-30T09:00:00Z&body=The%20GJS%20Property%20Team%20would%20love%20you%20to%20join%20us%20for%20our%2020th%20year%20Celebration%20for%20some%20canapés%20and%20drink%20or%20two%20🥂&location=Level%2010%2C%20Shell%20House%2C%2037%20Margaret%20Street%2C%20Sydney"
              className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-light tracking-wide text-white/80 border border-white/20 rounded-full hover:border-white/40 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Outlook</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.a>

            <motion.a
              href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:20251030T050000Z%0ADTEND:20251030T090000Z%0ASUMMARY:GJS%2020th%20Year%20Celebration%0ADESCRIPTION:The%20GJS%20Property%20Team%20would%20love%20you%20to%20join%20us%20for%20our%2020th%20year%20Celebration%20for%20some%20canapés%20and%20drink%20or%20two%20🥂%0ALOCATION:Level%2010%2C%20Shell%20House%2C%2037%20Margaret%20Street%2C%20Sydney%0AEND:VEVENT%0AEND:VCALENDAR"
              className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-light tracking-wide text-white/80 border border-white/20 rounded-full hover:border-white/40 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Apple</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default InviteCard
