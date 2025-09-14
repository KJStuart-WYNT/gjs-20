'use client'

import { motion } from 'framer-motion'
import { Calendar, ExternalLink } from 'lucide-react'
import { generateCalendarUrls } from '@/lib/utils'

const CalendarSection = () => {
  const calendarUrls = generateCalendarUrls()

  const calendarButtons = [
    {
      name: 'Google Calendar',
      url: calendarUrls.google,
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: '📅',
    },
    {
      name: 'Outlook',
      url: calendarUrls.outlook,
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: '📅',
    },
    {
      name: 'Apple Calendar',
      url: calendarUrls.apple,
      color: 'bg-gray-900 hover:bg-gray-800',
      icon: '📅',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <section className="py-32 bg-black relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-responsive-lg font-bold gradient-text mb-6">
            Add to Calendar
          </h2>
          <p className="text-responsive-md text-white/70 max-w-3xl mx-auto font-light">
            Don&apos;t forget to save the date! Click on your preferred calendar below to add the event.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {calendarButtons.map((button) => (
            <motion.a
              key={button.name}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button.color} text-white rounded-2xl p-8 shadow-2xl hover:shadow-2xl transition-all duration-300 group glass border border-white/10`}
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {button.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{button.name}</h3>
                <div className="flex items-center justify-center space-x-2 text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                  <span>Open in {button.name}</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Event Summary Card */}
        <motion.div
          className="mt-20 glass rounded-3xl p-8 md:p-12 border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-8">
              Event Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Calendar className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white text-lg">Date & Time</div>
                    <div className="text-white/70">Thursday, 30th October 2024</div>
                    <div className="text-white/70">5:30 PM - 8:00 PM</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 text-green-400 mt-1 flex-shrink-0">📍</div>
                  <div>
                    <div className="font-semibold text-white text-lg">Location</div>
                    <div className="text-white/70">Level 10, Shell House</div>
                    <div className="text-white/70">37 Margaret Street, Sydney</div>
                    <div className="text-sm text-white/50">Accessed via Wynyard Lane</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0">🎉</div>
                  <div>
                    <div className="font-semibold text-white text-lg">What to Expect</div>
                    <div className="text-white/70">Gourmet canapés, premium drinks, live music, and exclusive networking</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0">📅</div>
                  <div>
                    <div className="font-semibold text-white text-lg">RSVP Deadline</div>
                    <div className="text-white/70">Tuesday, 22nd October 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CalendarSection
