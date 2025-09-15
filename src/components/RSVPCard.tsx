'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, Send, User, Mail, Utensils } from 'lucide-react'

const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  attendance: z.enum(['yes', 'no']).refine((val) => val !== undefined, {
    message: 'Please select your attendance',
  }),
  dietary: z.string().optional(),
})

type RSVPFormValues = z.infer<typeof rsvpSchema>

interface RSVPCardProps {
  firstName?: string
  lastName?: string
  email?: string
}

const RSVPCard = ({ firstName, lastName, email }: RSVPCardProps) => {
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
      name: firstName && lastName ? `${firstName} ${lastName}` : firstName || '',
      email: email || '',
    },
  })

  const onSubmit = async (data: RSVPFormValues) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          attendance: data.attendance,
          dietaryRequirements: data.dietary,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        reset()
      } else {
        throw new Error(result.message || 'Failed to submit RSVP')
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      alert('Failed to submit RSVP. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="rsvp-card" className="min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          className="glass-card glass max-w-2xl w-full rounded-3xl p-12 md:p-16 text-center border border-white/20 shadow-2xl"
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-400/30">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Thank You!
            </h2>
            
            <p className="text-xl text-white/70 mb-8 font-light">
              We&apos;ve received your RSVP and sent a confirmation email to you. We look forward to celebrating with you!
            </p>

            {/* Calendar Links */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Add to Calendar</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=GJS%2020th%20Year%20Celebration&dates=20251030T050000Z/20251030T090000Z&details=The%20GJS%20Property%20Team%20would%20love%20you%20to%20join%20us%20for%20our%2020th%20year%20Celebration%20for%20some%20canap%C3%A9s%20and%20drink%20or%20two%20%F0%9F%A5%82&location=Level%2010%2C%20Shell%20House%2C%2037%20Margaret%20Street%2C%20Sydney%20(Via%20Wynyard%20Lane)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  Google Calendar
                </a>
                <a
                  href="ms-outlook://calendar/action/compose?subject=GJS%2020th%20Year%20Celebration&startdt=2025-10-30T05:00:00Z&enddt=2025-10-30T09:00:00Z&body=The%20GJS%20Property%20Team%20would%20love%20you%20to%20join%20us%20for%20our%2020th%20year%20Celebration%20for%20some%20canap%C3%A9s%20and%20drink%20or%20two%20%F0%9F%A5%82&location=Level%2010%2C%20Shell%20House%2C%2037%20Margaret%20Street%2C%20Sydney%20(Via%20Wynyard%20Lane)"
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h10V4H7zm2 2h6v2H9V6zm0 4h6v2H9v-2zm0 4h6v2H9v-2z"/>
                  </svg>
                  Outlook
                </a>
                <a
                  href="webcal://p01-calendarws.icloud.com/published/2/MTUyMzQwOTI1ODQ1MTUyM3xGSlMgMjB0aCBZZWFyIENlbGVicmF0aW9ufEdKUyBQcm9wZXJ0eSBUZWFtIHdvdWxkIGxvdmUgeW91IHRvIGpvaW4gdXMgZm9yIG91ciAyMHRoIHllYXIgQ2VsZWJyYXRpb24gZm9yIGEgY2FuYXDDqSBhbmQgZHJpbmsgb3IgdHdvIOKApnwyMDI1LTEwLTMwVDA1OjAwOjAwWi8yMDI1LTEwLTMwVDA5OjAwOjAwWnxMZXZlbCAxMCwgU2hlbGwgSG91c2UsIDM3IE1hcmdhcmV0IFN0cmVldCwgU3lkbmV5IChWaWEgV3lueWFyZCBMYW5lKQ"
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  Apple Calendar
                </a>
              </div>
            </div>
            
            <motion.button
              className="btn-primary"
              onClick={() => setIsSubmitted(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Another RSVP
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
    )
  }

  return (
    <section id="rsvp-card" className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        className="glass-card glass max-w-2xl w-full rounded-3xl p-12 md:p-16 border border-white/20 shadow-2xl"
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold gradient-text mb-6 tracking-wide">
            RSVP
          </h2>
          <p className="text-xl text-white/70 font-light">
            Please respond by Tuesday, 22nd October
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Name Field */}
          <div>
            <label className="form-label">
              <User className="w-5 h-5 inline mr-2" />
              Full Name *
            </label>
            <input
              {...register('name')}
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-2">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="form-label">
              <Mail className="w-5 h-5 inline mr-2" />
              Email Address *
            </label>
            <input
              {...register('email')}
              type="email"
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>
            )}
          </div>

          {/* Attendance Field */}
          <div>
            <label className="form-label">
              Will you be attending? *
            </label>
            <div className="space-y-4">
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
              <p className="text-red-400 text-sm mt-2">{errors.attendance.message}</p>
            )}
          </div>


          {/* Dietary Requirements */}
          <div>
            <label className="form-label">
              <Utensils className="w-5 h-5 inline mr-2" />
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
            className="w-full btn-primary text-xl py-6 rounded-2xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold tracking-wide"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <Send className="w-6 h-6" />
                <span>Send RSVP</span>
              </div>
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  )
}

export default RSVPCard
