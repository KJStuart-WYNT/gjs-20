'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

const EventDetailsSection = () => {
  const eventDetails = [
    {
      icon: Calendar,
      title: 'Date',
      content: 'Thursday, 30th October 2025',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Clock,
      title: 'Time',
      content: '4:00 PM - 8:00 PM',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: (
        <div>
          <div className="font-semibold">Level 10, Shell House</div>
          <div className="text-gray-600">37 Margaret Street, Sydney</div>
          <div className="text-sm text-gray-500 mt-1">Accessed via Wynyard Lane</div>
        </div>
      ),
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Users,
      title: 'RSVP Deadline',
      content: 'Tuesday, 22nd October',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-responsive-lg font-bold text-white mb-6">
            Event Details
          </h2>
          <p className="text-responsive-md text-white/70 max-w-3xl mx-auto font-light">
            Everything you need to know about our exclusive celebration
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {eventDetails.map((detail, index) => (
            <motion.div
              key={index}
              className="group"
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -5 }}
            >
              <div className="glass rounded-3xl p-8 h-full transition-all duration-300 group-hover:bg-white/5 group-hover:shadow-2xl group-hover:shadow-blue-500/10 border border-white/10">
                <div className={`w-16 h-16 ${detail.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg`} style={{ boxShadow: `var(--glow-${detail.color.split('-')[1]})` }}>
                  <detail.icon className={`w-8 h-8 ${detail.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {detail.title}
                </h3>
                
                <div className="text-white/70 leading-relaxed">
                  {detail.content}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          className="mt-20 glass rounded-3xl p-8 md:p-12 border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              What to Expect
            </h3>
            <p className="text-lg text-white/70 mb-6 leading-relaxed font-light">
              An exclusive evening featuring premium experiences, gourmet cuisine, 
              and the opportunity to connect with industry leaders who have been 
              part of our remarkable journey over the past two decades.
            </p>
            <p className="text-base text-white/60 mb-10 leading-relaxed font-light italic">
              Starting from 4pm until 8pm - feel free to arrive when convenient for you!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="glass px-6 py-3 rounded-full text-white/90 border border-white/20">🍾 Premium Drinks</span>
              <span className="glass px-6 py-3 rounded-full text-white/90 border border-white/20">🥂 Some Canapés</span>
              <span className="glass px-6 py-3 rounded-full text-white/90 border border-white/20">🎵 Live Music</span>
              <span className="glass px-6 py-3 rounded-full text-white/90 border border-white/20">📸 Photo Experience</span>
              <span className="glass px-6 py-3 rounded-full text-white/90 border border-white/20">🎁 Exclusive Gifts</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default EventDetailsSection
