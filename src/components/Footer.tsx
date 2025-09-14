'use client'

import { motion } from 'framer-motion'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-16">
            <h3 className="text-4xl font-bold mb-6 gradient-text">
              We Hope You Can Join Us!
            </h3>
            <p className="text-xl text-white/70 mb-10 max-w-4xl mx-auto font-light leading-relaxed">
              This exclusive celebration wouldn&apos;t be complete without you. Thank you for being part of our remarkable journey 
              and for helping us reach this incredible milestone.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-lg">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-6 h-6 text-red-500 fill-current" />
              </motion.div>
              <span>by the GJS Property Team</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex items-center justify-center space-x-4 glass px-6 py-4 rounded-xl border border-white/10">
              <Mail className="w-6 h-6 text-blue-400" />
              <span className="text-white/80">events@gjsproperty.com.au</span>
            </div>
            
            <div className="flex items-center justify-center space-x-4 glass px-6 py-4 rounded-xl border border-white/10">
              <Phone className="w-6 h-6 text-green-400" />
              <span className="text-white/80">(02) 1234 5678</span>
            </div>
            
            <div className="flex items-center justify-center space-x-4 glass px-6 py-4 rounded-xl border border-white/10">
              <MapPin className="w-6 h-6 text-purple-400" />
              <span className="text-white/80">Sydney, Australia</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center space-x-6 mb-12">
            {['✨', '⭐', '💫', '🌟', '✨', '⭐'].map((emoji, index) => (
              <motion.div
                key={index}
                className="text-3xl"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + index * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-white/50 text-sm font-light">
              © 2024 GJS Property. All rights reserved. | Celebrating 20 years of excellence
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
