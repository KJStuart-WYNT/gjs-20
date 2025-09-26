'use client'

import { useState, useEffect } from 'react'
import { Download, Users, Mail, CheckCircle, XCircle, RefreshCw, BarChart3, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface RSVPData {
  id: number
  name: string
  email: string
  attendance: 'yes' | 'no'
  dietary_requirements: string | null
  rsvp_date: string
  confirmation_id: string | null
  created_at: string
}

interface InviteData {
  id: number
  name: string
  email: string
  invite_sent_date: string | null
  invite_url: string | null
  rsvp_id: number | null
  status: 'pending' | 'sent' | 'responded' | 'declined'
  created_at: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rsvps, setRsvps] = useState<RSVPData[]>([])
  const [invites, setInvites] = useState<InviteData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return // Still loading
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login')
      return
    }
  }, [session, status, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [rsvpResponse, inviteResponse] = await Promise.all([
        fetch('/api/admin/rsvps'),
        fetch('/api/admin/invites')
      ])
      
      if (!rsvpResponse.ok || !inviteResponse.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const rsvpData = await rsvpResponse.json()
      const inviteData = await inviteResponse.json()
      
      setRsvps(rsvpData.data || [])
      setInvites(inviteData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const stats = {
    totalRSVPs: rsvps.length,
    attending: rsvps.filter(r => r.attendance === 'yes').length,
    notAttending: rsvps.filter(r => r.attendance === 'no').length,
    totalInvites: invites.length,
    sent: invites.filter(i => i.status === 'sent').length,
    responded: invites.filter(i => i.status === 'responded').length,
    pending: invites.filter(i => i.status === 'pending').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md">
            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <p className="text-red-200 mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!session || session.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2 text-green-400">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Secure Admin Portal</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">GJS 20th Anniversary</h1>
          <h2 className="text-2xl text-blue-200">Admin Dashboard</h2>
          <p className="text-gray-300 mt-2">Manage RSVPs and Invites</p>
          <p className="text-sm text-gray-400 mt-1">Welcome, {session.user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total RSVPs</p>
                <p className="text-3xl font-bold text-white">{stats.totalRSVPs}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Attending</p>
                <p className="text-3xl font-bold text-white">{stats.attending}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm">Not Attending</p>
                <p className="text-3xl font-bold text-white">{stats.notAttending}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Total Invites</p>
                <p className="text-3xl font-bold text-white">{stats.totalInvites}</p>
              </div>
              <Mail className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/admin/invites"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Manage Invites
            </Link>
            <button 
              onClick={() => window.open('/api/export?type=rsvps&format=xlsx', '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export RSVPs
            </button>
            <button 
              onClick={() => window.open('/api/export?type=invites&format=xlsx', '_blank')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Invites
            </button>
            <button 
              onClick={fetchData}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Recent RSVPs */}
        {rsvps.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Recent RSVPs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Attendance</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.slice(0, 10).map((rsvp) => (
                    <tr key={rsvp.id} className="border-b border-white/10">
                      <td className="py-2">{rsvp.name}</td>
                      <td className="py-2">{rsvp.email}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          rsvp.attendance === 'yes' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {rsvp.attendance === 'yes' ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-2 text-sm text-gray-300">
                        {new Date(rsvp.rsvp_date).toLocaleDateString('en-AU')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">Database Connected</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">APIs Working</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">Admin Dashboard Active</span>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="text-white">Export Functions Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}