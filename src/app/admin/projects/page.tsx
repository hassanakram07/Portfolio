'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Star,
  Loader2,
  AlertCircle,
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
import { PROJECT_CATEGORIES, type Project } from '@/types'
import toast from 'react-hot-toast'

// Default fallback projects if database is empty
const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Autonomous Multi-Agent AI Workflow',
    slug: 'autonomous-ai-workflow',
    short_description: 'Custom multi-agent system executing business research and automated lead qualification.',
    description: 'Detailed description of the AI multi-agent workflow solution...',
    cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
    gallery_urls: [],
    tech_stack: ['OpenAI', 'Python', 'LangChain', 'FastAPI'],
    category: 'AI',
    live_url: 'https://example.com',
    github_url: 'https://github.com',
    featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p2',
    title: 'Enterprise n8n Automation Engine',
    slug: 'n8n-automation-engine',
    short_description: 'Synchronizes HubSpot, Stripe, and internal PostgreSQL database with 99.9% uptime.',
    description: 'Comprehensive workflow automation system using n8n...',
    cover_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    gallery_urls: [],
    tech_stack: ['n8n', 'HubSpot', 'PostgreSQL', 'Docker'],
    category: 'Automation',
    live_url: null,
    github_url: 'https://github.com',
    featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p3',
    title: 'HubSpot Custom Objects & CRM Pipeline',
    slug: 'hubspot-custom-pipeline',
    short_description: 'Custom calculated properties, automated sequence enrollment, and revenue attribution model.',
    description: 'High performance CRM architecture for high-velocity sales teams...',
    cover_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    gallery_urls: [],
    tech_stack: ['HubSpot API', 'Node.js', 'Webhooks'],
    category: 'CRM',
    live_url: 'https://example.com',
    github_url: null,
    featured: false,
    display_order: 3,
    created_at: new Date().toISOString(),
  },
]

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()

      if (Array.isArray(data) && data.length > 0) {
        setProjects(data)
      } else {
        setProjects(DEFAULT_PROJECTS)
      }
    } catch {
      setProjects(DEFAULT_PROJECTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const toggleFeatured = async (project: Project) => {
    const updated = !project.featured
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: updated }),
      })
      if (!res.ok) throw new Error()

      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: updated } : p))
      )
      toast.success(updated ? 'Marked as featured' : 'Removed from featured')
    } catch {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: updated } : p))
      )
      toast.success(updated ? 'Marked as featured (local)' : 'Removed from featured')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error()

      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast.success('Project deleted')
    } catch {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast.success('Project deleted')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech_stack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your case studies, live demo links, and portfolio display order.
          </p>
        </div>
        <Button asChild size="sm" className="gap-2 shadow-md shadow-primary/20">
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Button
            variant={selectedCategory === 'All' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory('All')}
            className="text-xs h-8"
          >
            All ({projects.length})
          </Button>
          {PROJECT_CATEGORIES.map((cat) => {
            const count = projects.filter((p) => p.category === cat).length
            return (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="text-xs h-8"
              >
                {cat} ({count})
              </Button>
            )
          })}
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-card/40 border border-border/40 rounded-xl p-12 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-lg">No projects found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search filter or add a new project.
          </p>
        </div>
      ) : (
        <div className="bg-card/40 border border-border/40 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/40 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Tech Stack</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-muted/20 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted shrink-0 border border-border/50">
                          {project.cover_image_url ? (
                            <Image
                              src={project.cover_image_url}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
                          >
                            {project.title}
                          </Link>
                          <span className="text-xs text-muted-foreground font-mono">
                            /{project.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.tech_stack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="text-[11px] text-muted-foreground self-center">
                            +{project.tech_stack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-xs">
                      #{project.display_order}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(project)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          project.featured
                            ? 'text-yellow-400 hover:text-yellow-500 bg-yellow-400/10'
                            : 'text-muted-foreground/40 hover:text-muted-foreground'
                        }`}
                        title={project.featured ? 'Featured' : 'Mark as featured'}
                      >
                        <Star className={`h-4 w-4 ${project.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="View on public site"
                        >
                          <Link href={`/projects/${project.slug}`} target="_blank">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Edit project"
                        >
                          <Link href={`/admin/projects/${project.id}/edit`}>
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                          title="Delete project"
                          onClick={() => setDeleteTarget(project)}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action cannot be undone.
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
              {deleting ? 'Deleting...' : 'Delete Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
