'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Send, Users, Mail, CheckCircle, Clock, Copy } from 'lucide-react'

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

interface InviteManagementProps {
  invites: InviteData[]
  onRefresh: () => void
}

export default function InviteManagement({ invites, onRefresh }: InviteManagementProps) {
  const [newInvite, setNewInvite] = useState({ name: '', email: '' })
  const [adding, setAdding] = useState(false)
  const [sending, setSending] = useState(false)

  const handleAddInvite = async () => {
    if (!newInvite.name || !newInvite.email) return

    try {
      setAdding(true)
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvite)
      })

      const result = await response.json()
      
      if (result.success) {
        setNewInvite({ name: '', email: '' })
        onRefresh()
        alert('Invite created successfully!')
      } else {
        alert(result.message || 'Failed to create invite')
      }
    } catch (error) {
      console.error('Error creating invite:', error)
      alert('Failed to create invite')
    } finally {
      setAdding(false)
    }
  }

  const handleSendAllPending = async () => {
    try {
      setSending(true)
      const response = await fetch('/api/send-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sendToAll: true })
      })

      const result = await response.json()
      
      if (result.success) {
        onRefresh()
        alert(`Successfully sent ${result.successCount} invites!`)
      } else {
        alert(result.message || 'Failed to send invites')
      }
    } catch (error) {
      console.error('Error sending invites:', error)
      alert('Failed to send invites')
    } finally {
      setSending(false)
    }
  }

  const copyInviteUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('Invite URL copied to clipboard!')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responded':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'sent':
        return <Mail className="w-4 h-4 text-blue-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      default:
        return <Clock className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded':
        return 'bg-green-500/20 text-green-400'
      case 'sent':
        return 'bg-blue-500/20 text-blue-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-red-500/20 text-red-400'
    }
  }

  const pendingCount = invites.filter(i => i.status === 'pending').length
  const sentCount = invites.filter(i => i.status === 'sent').length
  const respondedCount = invites.filter(i => i.status === 'responded').length

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
          <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">{pendingCount}</p>
          <p className="text-blue-200 text-sm">Pending</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
          <Mail className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">{sentCount}</p>
          <p className="text-blue-200 text-sm">Sent</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">{respondedCount}</p>
          <p className="text-blue-200 text-sm">Responded</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="space-y-4">
          {/* Add Single Invite */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newInvite.name}
              onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
            />
            <input
              type="email"
              placeholder="Email"
              value={newInvite.email}
              onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
            />
            <button
              onClick={handleAddInvite}
              disabled={adding || !newInvite.name || !newInvite.email}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {adding ? 'Adding...' : 'Add Invite'}
            </button>
          </div>

          {/* Send All Pending */}
          <button
            onClick={handleSendAllPending}
            disabled={sending || pendingCount === 0}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{sending ? 'Sending...' : `Send All Pending (${pendingCount})`}</span>
          </button>
        </div>
      </div>

      {/* Recent Invites */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Recent Invites</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-white/70 font-medium">Name</th>
                <th className="px-6 py-4 text-left text-white/70 font-medium">Email</th>
                <th className="px-6 py-4 text-left text-white/70 font-medium">Status</th>
                <th className="px-6 py-4 text-left text-white/70 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.slice(0, 5).map((invite) => (
                <tr key={invite.id} className="border-t border-white/10">
                  <td className="px-6 py-4 text-white">{invite.name}</td>
                  <td className="px-6 py-4 text-white/70">{invite.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(invite.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}>
                        {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {invite.invite_url && (
                      <button
                        onClick={() => copyInviteUrl(invite.invite_url!)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Copy invite URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

