'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Send, Users, Mail, CheckCircle, Clock, XCircle, Copy, Trash2, RefreshCw } from 'lucide-react'

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

interface BulkInviteData {
  name: string
  email: string
}

export default function InviteManagement() {
  const [invites, setInvites] = useState<InviteData[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showBulkForm, setShowBulkForm] = useState(false)
  const [bulkData, setBulkData] = useState<BulkInviteData[]>([])
  const [selectedInvites, setSelectedInvites] = useState<number[]>([])
  const [newInvite, setNewInvite] = useState({ name: '', email: '' })

  const fetchInvites = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/invites')
      const data = await response.json()
      
      if (data.success) {
        setInvites(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching invites:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvites()
  }, [])

  const handleAddInvite = async () => {
    if (!newInvite.name || !newInvite.email) return

    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvite)
      })

      const result = await response.json()
      
      if (result.success) {
        setNewInvite({ name: '', email: '' })
        fetchInvites()
        alert('Invite created successfully!')
      } else {
        alert(result.message || 'Failed to create invite')
      }
    } catch (error) {
      console.error('Error creating invite:', error)
      alert('Failed to create invite')
    }
  }

  const handleBulkAdd = async () => {
    if (bulkData.length === 0) return

    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invites: bulkData })
      })

      const result = await response.json()
      
      if (result.success) {
        setBulkData([])
        setShowBulkForm(false)
        fetchInvites()
        alert(`Successfully created ${result.results?.filter((r: { success: boolean }) => r.success).length || 0} invites!`)
      } else {
        alert(result.message || 'Failed to create invites')
      }
    } catch (error) {
      console.error('Error creating bulk invites:', error)
      alert('Failed to create invites')
    }
  }

  const handleSendInvites = async (sendToAll = false) => {
    try {
      setSending(true)
      
      const inviteIds = sendToAll ? [] : selectedInvites
      const response = await fetch('/api/send-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          inviteIds: sendToAll ? undefined : inviteIds,
          sendToAll 
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setSelectedInvites([])
        fetchInvites()
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
        return <XCircle className="w-4 h-4 text-red-400" />
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

  const addBulkRow = () => {
    setBulkData([...bulkData, { name: '', email: '' }])
  }

  const updateBulkRow = (index: number, field: keyof BulkInviteData, value: string) => {
    const updated = [...bulkData]
    updated[index][field] = value
    setBulkData(updated)
  }

  const removeBulkRow = (index: number) => {
    setBulkData(bulkData.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading invites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Invite Management</h1>
          <p className="text-xl text-blue-200">Manage and send event invitations</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowBulkForm(!showBulkForm)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Bulk Add Invites</span>
          </button>
          
          <button
            onClick={() => handleSendInvites(true)}
            disabled={sending || invites.filter(i => i.status === 'pending').length === 0}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {sending ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>Send All Pending</span>
          </button>

          <button
            onClick={() => handleSendInvites(false)}
            disabled={sending || selectedInvites.length === 0}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {sending ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>Send Selected ({selectedInvites.length})</span>
          </button>
        </div>

        {/* Bulk Add Form */}
        {showBulkForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Bulk Add Invites</h3>
            
            <div className="space-y-4">
              {bulkData.map((row, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <input
                    type="text"
                    placeholder="Name"
                    value={row.name}
                    onChange={(e) => updateBulkRow(index, 'name', e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={row.email}
                    onChange={(e) => updateBulkRow(index, 'email', e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
                  <button
                    onClick={() => removeBulkRow(index)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="flex gap-4">
                <button
                  onClick={addBulkRow}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Row</span>
                </button>
                
                <button
                  onClick={handleBulkAdd}
                  disabled={bulkData.length === 0 || bulkData.some(r => !r.name || !r.email)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Create Invites</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Single Add Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Add Single Invite</h3>
          
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
              disabled={!newInvite.name || !newInvite.email}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Invite
            </button>
          </div>
        </div>

        {/* Invites Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedInvites.length === invites.length && invites.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInvites(invites.map(i => i.id))
                        } else {
                          setSelectedInvites([])
                        }
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">Name</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">Email</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">Sent Date</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => (
                  <tr key={invite.id} className="border-t border-white/10">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedInvites.includes(invite.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInvites([...selectedInvites, invite.id])
                          } else {
                            setSelectedInvites(selectedInvites.filter(id => id !== invite.id))
                          }
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                    </td>
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
                    <td className="px-6 py-4 text-white/70">
                      {invite.invite_sent_date ? new Date(invite.invite_sent_date).toLocaleDateString('en-AU') : '-'}
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

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{invites.length}</p>
            <p className="text-blue-200 text-sm">Total Invites</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{invites.filter(i => i.status === 'pending').length}</p>
            <p className="text-blue-200 text-sm">Pending</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{invites.filter(i => i.status === 'sent').length}</p>
            <p className="text-blue-200 text-sm">Sent</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{invites.filter(i => i.status === 'responded').length}</p>
            <p className="text-blue-200 text-sm">Responded</p>
          </div>
        </div>
      </div>
    </div>
  )
}

