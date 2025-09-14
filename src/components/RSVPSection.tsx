'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, Send, User, Mail, Users, Utensils } from 'lucide-react'

const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  attendance: z.enum(['yes', 'no']).refine((val) => val !== undefined, {
    message: 'Please select your attendance',
  }),
  guests: z.number().min(0).max(3),
  dietary: z.string().optional(),
})

type RSVPFormValues = z.infer<typeof rsvpSchema>

const RSVPSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guests: 0,
    },
  })

  const onSubmit = async (data: RSVPFormValues) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('RSVP Data:', data)
      
      // In a real app, you would send this to your API
      // await fetch('/api/rsvp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })
      
      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting RSVP:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="rsvp-section" className="py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Thank You!
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              We&apos;ve received your RSVP and look forward to celebrating with you!
            </p>
            
            <motion.button
              className="btn-primary"
              onClick={() => setIsSubmitted(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Another RSVP
            </motion.button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="rsvp-section" className="py-32 bg-black relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-2xl mx-auto px-6 relative z-10">
        <motion.div
          className="glass rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h2 className="text-5xl font-bold gradient-text mb-6 tracking-wide">
              RSVP
            </h2>
            <p className="text-xl text-white/70 font-light">
              Please respond by Tuesday, 22nd October
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="form-label">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                {...register('name')}
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="form-label">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                {...register('email')}
                type="email"
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Attendance Field */}
            <div>
              <label className="form-label">
                Will you be attending? *
              </label>
              <div className="space-y-3">
                {[
                  { value: 'yes', label: "Yes, I'll be there! 🎉", color: 'text-green-400' },
                  { value: 'no', label: "Sorry, I can't make it", color: 'text-red-400' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-4 cursor-pointer group p-4 rounded-xl glass border border-white/10 hover:border-white/20 transition-all duration-300">
                    <input
                      {...register('attendance')}
                      type="radio"
                      value={option.value}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`font-medium text-white group-hover:${option.color} transition-colors`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.attendance && (
                <p className="text-red-500 text-sm mt-1">{errors.attendance.message}</p>
              )}
            </div>

            {/* Guests Field */}
            <div>
              <label className="form-label">
                <Users className="w-4 h-4 inline mr-2" />
                Number of Guests
              </label>
              <select
                {...register('guests', { valueAsNumber: true })}
                className="form-input"
              >
                <option value={0}>Just me</option>
                <option value={1}>+1 Guest</option>
                <option value={2}>+2 Guests</option>
                <option value={3}>+3 Guests</option>
              </select>
            </div>

            {/* Dietary Requirements */}
            <div>
              <label className="form-label">
                <Utensils className="w-4 h-4 inline mr-2" />
                Dietary Requirements
              </label>
              <textarea
                {...register('dietary')}
                rows={3}
                className="form-input resize-none"
                placeholder="Any dietary requirements or allergies? (Optional)"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-lg py-4 rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Send RSVP</span>
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default RSVPSection
