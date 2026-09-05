'use client'

import { useEffect, useState } from 'react'
import {
  Mail,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Message } from '@/types'
import toast from 'react-hot-toast'

const DEFAULT_MESSAGES: Message[] = [
  {
    id: 'm1',
    name: 'Samantha Reed',
    email: 'samantha@techventures.io',
    project_type: 'AI Agent / Chatbot',
    budget_range: '$5,000 – $15,000',
    message:
      'Hi Hassan, we are looking to build a customer intelligence agent that integrates with HubSpot and Slack. We have 5,000 active users and need this ready within 6 weeks. Are you available for a discovery call this week?',
    status: 'unread',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'm2',
    name: 'Robert Torres',
    email: 'rtorres@hypergrowth.co',
    project_type: 'Workflow Automation (n8n)',
    budget_range: '$1,500 – $5,000',
    message:
      'We need our billing platform connected with Stripe, HubSpot, and Google Sheets via n8n. Current manual export is causing reconcilation errors. Loved your case study on the multi-agent system.',
    status: 'read',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
  {
    id: 'm3',
    name: 'Elena Rostova',
    email: 'elena@novacapital.com',
    project_type: 'CRM Integration (HubSpot)',
    budget_range: '$5,000 – $15,000',
    message:
      'Looking for a senior developer to build custom webhook-driven pipelines in HubSpot and connect our data warehouse.',
    status: 'replied',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
]

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null)

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()

      if (Array.isArray(data) && data.length > 0) {
        setMessages(data)
      } else {
        setMessages(DEFAULT_MESSAGES)
      }
    } catch {
      setMessages(DEFAULT_MESSAGES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const updateStatus = async (messageId: string, status: Message['status']) => {
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error()

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status } : m))
      )
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage((prev) => (prev ? { ...prev, status } : null))
      }
      toast.success(`Message marked as ${status}`)
    } catch {
      toast.error('Failed to update message status')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/messages/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error()
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id))
      toast.success('Message deleted')
    } catch {
      toast.error('Failed to delete message')
    } finally {
      setDeleteTarget(null)
      if (selectedMessage?.id === deleteTarget.id) {
        setSelectedMessage(null)
      }
    }
  }

  const openMessageDetail = (msg: Message) => {
    setSelectedMessage(msg)
    if (msg.status === 'unread') {
      updateStatus(msg.id, 'read')
    }
  }

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.project_type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || msg.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Messages Inbox</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Client inquiries submitted through the contact form.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads, emails, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'unread', 'read', 'replied'] as const).map((st) => {
            const count =
              st === 'all'
                ? messages.length
                : messages.filter((m) => m.status === st).length
            return (
              <Button
                key={st}
                variant={statusFilter === st ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter(st)}
                className="text-xs h-8 capitalize"
              >
                {st} ({count})
              </Button>
            )
          })}
        </div>
      </div>

      {/* Messages List Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-card/40 border border-border/40 rounded-xl p-12 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-lg">No messages found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            No inquiries match your current search query or status filter.
          </p>
        </div>
      ) : (
        <div className="bg-card/40 border border-border/40 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/40 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Project Type</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => openMessageDetail(msg)}
                    className={`cursor-pointer hover:bg-muted/30 transition-colors ${
                      msg.status === 'unread' ? 'bg-primary/5 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground block truncate">
                          {msg.name}
                        </span>
                        <span className="text-xs text-muted-foreground block truncate">
                          {msg.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-foreground/80">{msg.project_type}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-mono text-muted-foreground">
                        {msg.budget_range}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          msg.status === 'unread'
                            ? 'default'
                            : msg.status === 'replied'
                            ? 'outline'
                            : 'secondary'
                        }
                        className="text-[10px] uppercase font-mono"
                      >
                        {msg.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="View message"
                          onClick={() => openMessageDetail(msg)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Delete message"
                          onClick={() => setDeleteTarget(msg)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="text-xl">Inquiry from {selectedMessage?.name}</DialogTitle>
              <Badge
                variant={
                  selectedMessage?.status === 'unread'
                    ? 'default'
                    : selectedMessage?.status === 'replied'
                    ? 'outline'
                    : 'secondary'
                }
                className="capitalize"
              >
                {selectedMessage?.status}
              </Badge>
            </div>
            <DialogDescription>
              Received on {selectedMessage && new Date(selectedMessage.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-lg border border-border/40 text-xs">
              <div>
                <span className="text-muted-foreground block">Email:</span>
                <a
                  href={`mailto:${selectedMessage?.email}`}
                  className="font-medium text-primary hover:underline break-all"
                >
                  {selectedMessage?.email}
                </a>
              </div>
              <div>
                <span className="text-muted-foreground block">Budget:</span>
                <span className="font-medium font-mono">{selectedMessage?.budget_range}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block">Project Type:</span>
                <span className="font-medium">{selectedMessage?.project_type}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Message:
              </span>
              <div className="p-4 rounded-xl bg-card border border-border/50 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedMessage?.message}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row justify-between sm:items-center pt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() =>
                  selectedMessage &&
                  updateStatus(
                    selectedMessage.id,
                    selectedMessage.status === 'replied' ? 'read' : 'replied'
                  )
                }
              >
                {selectedMessage?.status === 'replied' ? 'Mark as Read' : 'Mark as Replied'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteTarget(selectedMessage)}
              >
                Delete
              </Button>
            </div>

            <Button asChild size="sm" className="gap-2">
              <a
                href={`mailto:${selectedMessage?.email}?subject=Re: Your Inquiry for Hassan Akram`}
                target="_blank"
                rel="noreferrer"
              >
                <Send className="h-3.5 w-3.5" />
                Reply via Email
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the message from {deleteTarget?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
