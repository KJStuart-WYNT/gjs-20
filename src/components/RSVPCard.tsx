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
    watch,
    setValue,
  } = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: firstName && lastName ? `${firstName} ${lastName}` : firstName || '',
      email: email || '',
      guests: 0,
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
          guests: data.guests,
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

          {/* Guests Field */}
          <div>
            <label className="form-label">
              <Users className="w-5 h-5 inline mr-2" />
              Number of Guests
            </label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                { value: 0, label: 'Just me' },
                { value: 1, label: '+1 Guest' },
                { value: 2, label: '+2 Guests' },
                { value: 3, label: '+3 Guests' }
              ].map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  className={`
                    relative px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-center font-medium
                    ${watch('guests') === option.value
                      ? 'border-white/40 bg-white/10 text-white shadow-lg backdrop-blur-sm'
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/8 hover:text-white/90'
                    }
                  `}
                  onClick={() => setValue('guests', option.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.label}
                  {watch('guests') === option.value && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border border-white/20 bg-gradient-to-r from-white/5 to-white/10"
                      layoutId="guest-selection"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
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
