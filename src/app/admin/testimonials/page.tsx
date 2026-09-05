'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  MessageSquareQuote,
  Loader2,
  AlertCircle,
  Building,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Testimonial } from '@/types'
import toast from 'react-hot-toast'

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    client_name: 'Omar Farooq',
    client_role: 'Founder',
    company: 'Growify',
    quote:
      'Hassan set up an automation for our lead pipeline that I honestly thought would take months. He delivered it in under two weeks and it just works. No fluff, no hand-holding needed. Exactly what I was looking for.',
    avatar_url: null,
    display_order: 1,
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 't2',
    client_name: 'Nadia Siddiqui',
    client_role: 'Operations Manager',
    company: 'TrustBridge',
    quote:
      'We had a messy HubSpot setup that nobody on our team could fix. Hassan cleaned it up, built proper workflows, and now everything syncs automatically. Saved us probably 10 hours a week easily.',
    avatar_url: null,
    display_order: 2,
    created_at: '2026-02-05T10:00:00Z',
  },
  {
    id: 't3',
    client_name: 'Tariq Mahmood',
    client_role: 'Co-Founder',
    company: 'PocketSuite',
    quote:
      'I came to Hassan with a vague idea for an AI chatbot for our support team. He asked the right questions, scoped it properly, and built something that actually handles real customer queries well. Very impressed.',
    avatar_url: null,
    display_order: 3,
    created_at: '2026-02-14T10:00:00Z',
  },
  {
    id: 't4',
    client_name: 'Layla Hassan',
    client_role: 'Product Lead',
    company: 'Streamline',
    quote:
      'Good communication throughout, clean code, and delivered on time. The dashboard he built for us still runs perfectly months later. Will definitely work with him again on our next project.',
    avatar_url: null,
    display_order: 4,
    created_at: '2026-02-22T10:00:00Z',
  },
  {
    id: 't5',
    client_name: 'Bilal Chaudhry',
    client_role: 'CEO',
    company: 'NovaCraft',
    quote:
      'Hassan helped us automate our weekly reporting which used to take our team half a day every Friday. Now it runs on its own every morning. Small thing but it made a big difference for us.',
    avatar_url: null,
    display_order: 5,
    created_at: '2026-03-01T10:00:00Z',
  },
]

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Form fields
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [quote, setQuote] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState(1)

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials')
      const data = await res.json()

      if (Array.isArray(data) && data.length > 0) {
        setTestimonials(data)
      } else {
        setTestimonials(DEFAULT_TESTIMONIALS)
      }
    } catch {
      setTestimonials(DEFAULT_TESTIMONIALS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const openCreateDialog = () => {
    setEditingItem(null)
    setName('')
    setRole('')
    setCompany('')
    setQuote('')
    setAvatarUrl('')
    setDisplayOrder(testimonials.length + 1)
    setDialogOpen(true)
  }

  const openEditDialog = (item: Testimonial) => {
    setEditingItem(item)
    setName(item.client_name)
    setRole(item.client_role)
    setCompany(item.company)
    setQuote(item.quote)
    setAvatarUrl(item.avatar_url || '')
    setDisplayOrder(item.display_order)
    setDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !quote) {
      toast.error('Name and quote are required')
      return
    }

    setSaving(true)
    const payload = {
      client_name: name,
      client_role: role,
      company: company,
      quote: quote,
      avatar_url: avatarUrl || null,
      display_order: Number(displayOrder),
    }

    try {
      if (editingItem) {
        const res = await fetch(`/api/testimonials/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error()
        const updated = await res.json()

        setTestimonials((prev) =>
          prev.map((t) => (t.id === editingItem.id ? { ...t, ...updated } : t))
        )
        toast.success('Testimonial updated')
      } else {
        const res = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error()
        const created = await res.json()

        setTestimonials((prev) => [...prev, created])
        toast.success('Testimonial added')
      }
      setDialogOpen(false)
    } catch {
      toast.error('Failed to save testimonial')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/testimonials/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error()
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id))
      toast.success('Testimonial deleted')
    } catch {
      toast.error('Failed to delete testimonial')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Testimonials</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Client reviews, endorsements, and social proof displayed on the homepage.
          </p>
        </div>
        <Button onClick={openCreateDialog} size="sm" className="gap-2 shadow-md shadow-primary/20">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-card/40 border border-border/40 rounded-xl p-12 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-lg">No testimonials yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add quotes from past clients to build trust and increase inquiry conversion rates.
          </p>
          <Button onClick={openCreateDialog} size="sm" className="mt-4">
            Add Testimonial
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-card/40 border border-border/40 rounded-xl p-6 flex flex-col justify-between hover:border-primary/40 transition-all shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-border/50">
                      <AvatarImage src={item.avatar_url || ''} alt={item.client_name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {item.client_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm leading-tight">{item.client_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.client_role} {item.company && `• ${item.company}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    #{item.display_order}
                  </span>
                </div>

                <div className="relative pl-3 border-l-2 border-primary/30">
                  <p className="text-xs leading-relaxed text-muted-foreground italic">
                    &quot;{item.quote}&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-4 mt-4 border-t border-border/40">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => openEditDialog(item)}
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteTarget(item)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
            </DialogTitle>
            <DialogDescription>
              Add details about the client and their feedback.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="t-name">Client Name *</Label>
                <Input
                  id="t-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-role">Role / Title</Label>
                <Input
                  id="t-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. VP of Growth"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="t-company">Company</Label>
                <Input
                  id="t-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. NexusScale"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-order">Display Order</Label>
                <Input
                  id="t-order"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="t-avatar">Avatar Image URL</Label>
              <Input
                id="t-avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="t-quote">Quote / Feedback *</Label>
              <Textarea
                id="t-quote"
                rows={4}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="What did the client say about working with you?"
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the testimonial from &quot;{deleteTarget?.client_name}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Testimonial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
