export interface RSVPFormData {
  name: string
  email: string
  attendance: 'yes' | 'no'
  dietary: string
}

export interface RSVPResponse {
  success: boolean
  message: string
  data?: RSVPFormData
}

export interface EventDetails {
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
  location: {
    name: string
    address: string
    access: string
    level: string
  }
  rsvpDeadline: Date
}
