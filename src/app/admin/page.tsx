'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FolderKanban,
  MessageSquareQuote,
  Mail,
  Star,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatsCard } from '@/components/admin/StatsCard'
import type { Project, Message, Testimonial } from '@/types'

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    projectsCount: 0,
    featuredCount: 0,
    testimonialsCount: 0,
    unreadMessagesCount: 0,
  })
  const [recentMessages, setRecentMessages] = useState<Message[]>([])
  const [recentProjects, setRecentProjects] = useState<Project[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, testRes, msgRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/testimonials'),
          fetch('/api/messages'),
        ])

        if (projRes.ok) {
          const projects: Project[] = await projRes.json()
          setRecentProjects(projects.slice(0, 4))
          setStats((prev) => ({
            ...prev,
            projectsCount: projects.length,
            featuredCount: projects.filter((p) => p.featured).length,
          }))
        }

        if (testRes.ok) {
          const testimonials: Testimonial[] = await testRes.json()
          setStats((prev) => ({
            ...prev,
            testimonialsCount: testimonials.length,
          }))
        }

        if (msgRes.ok) {
          const messages: Message[] = await msgRes.json()
          setRecentMessages(messages.slice(0, 5))
          setStats((prev) => ({
            ...prev,
            unreadMessagesCount: messages.filter((m) => m.status === 'unread').length,
          }))
        }
      } catch (err) {
        console.warn('Dashboard data fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">Admin Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your showcase projects, client testimonials, incoming leads, and site copy.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4" />
              Live Site
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-2 shadow-md shadow-primary/20">
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value={stats.projectsCount}
          description="In portfolio database"
          icon={FolderKanban}
        />
        <StatsCard
          title="Featured Projects"
          value={stats.featuredCount}
          description="Highlighted on homepage"
          icon={Star}
        />
        <StatsCard
          title="Testimonials"
          value={stats.testimonialsCount}
          description="Client reviews shown"
          icon={MessageSquareQuote}
        />
        <StatsCard
          title="New Inquiries"
          value={stats.unreadMessagesCount}
          description="Unread contact submissions"
          icon={Mail}
        />
      </div>

      {/* Main Content Split: Recent Inquiries & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-card/40 border border-border/40 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <h2 className="font-heading font-semibold text-lg">Recent Client Inquiries</h2>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-primary gap-1">
                <Link href="/admin/messages">
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>

            {recentMessages.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <p>No contact messages yet.</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  New submissions from the contact form will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-lg bg-muted/40 border border-border/30 hover:border-primary/30 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{msg.name}</span>
                        <Badge
                          variant={msg.status === 'unread' ? 'default' : 'secondary'}
                          className="text-[10px] uppercase h-4 px-1.5"
                        >
                          {msg.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 italic mt-1">
                        &quot;{msg.message}&quot;
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-border/40">
            <Button asChild variant="outline" size="sm" className="w-full text-xs">
              <Link href="/admin/messages">Open Message Inbox</Link>
            </Button>
          </div>
        </div>

        {/* Quick Projects Overview */}
        <div className="bg-card/40 border border-border/40 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-primary" />
                <h2 className="font-heading font-semibold text-lg">Portfolio Projects</h2>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-primary gap-1">
                <Link href="/admin/projects">
                  Manage
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <p>No projects found in database.</p>
                <Button asChild size="sm" className="mt-3">
                  <Link href="/admin/projects/new">Add Your First Project</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 rounded-lg bg-muted/40 border border-border/30 hover:border-primary/30 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{project.title}</span>
                        {project.featured && (
                          <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{project.category} • /{project.slug}</p>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="h-8 text-xs shrink-0">
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-border/40">
            <Button asChild variant="outline" size="sm" className="w-full text-xs">
              <Link href="/admin/projects/new">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add New Showcase Project
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
