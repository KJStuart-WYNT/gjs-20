import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function generateCalendarUrls() {
  const eventDetails = {
    title: "GJS 20th Year Celebration",
    description: "Join the GJS Property Team for our 20th year celebration! An evening of celebration, connection, and cheers to two decades of excellence.",
    location: "Level 10, Shell House, 37 Margaret Street, Sydney (Accessed via Wynyard Lane)",
    startDate: new Date('2024-10-30T17:30:00+11:00'), // Sydney time
    endDate: new Date('2024-10-30T20:00:00+11:00'),
  }

  const formatDateForCalendar = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${formatDateForCalendar(eventDetails.startDate)}/${formatDateForCalendar(eventDetails.endDate)}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`

  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventDetails.title)}&startdt=2024-10-30T17:30:00&enddt=2024-10-30T20:00:00&body=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`

  const appleCalendarUrl = `https://calendar.apple.com/?title=${encodeURIComponent(eventDetails.title)}&start=20241030T173000&end=20241030T200000&notes=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`

  return {
    google: googleCalendarUrl,
    outlook: outlookCalendarUrl,
    apple: appleCalendarUrl,
  }
}
