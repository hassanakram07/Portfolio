import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { cache } from 'react'
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react'
import { Github } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/ui/Navbar'
import { FooterSection } from '@/components/sections/FooterSection'
import type { Project } from '@/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ensureDatabaseSeeded } from '@/lib/db-init'
import { ProjectModel } from '@/models/Project'
import { SEED_PROJECTS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

const getProject = cache(async (slug: string): Promise<Project | null> => {
  try {
    await ensureDatabaseSeeded()
    await connectToDatabase()
    const p: any = await ProjectModel.findOne({ slug }).lean()
    if (p) {
      return {
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        description: p.description,
        short_description: p.short_description,
        cover_image_url: p.cover_image_url,
        gallery_urls: p.gallery_urls || [],
        tech_stack: p.tech_stack || [],
        category: p.category,
        live_url: p.live_url || null,
        github_url: p.github_url || null,
        featured: Boolean(p.featured),
        display_order: p.display_order ?? 0,
        created_at: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
      }
    }
    return SEED_PROJECTS.find((p) => p.slug === slug) || null
  } catch {
    return SEED_PROJECTS.find((p) => p.slug === slug) || null
  }
})

export async function generateStaticParams() {
  try {
    await connectToDatabase()
    const projects = await ProjectModel.find({}, 'slug').lean()
    const slugs = (projects ?? []).map((p: any) => ({ slug: p.slug }))
    if (slugs.length > 0) return slugs
    return SEED_PROJECTS.map((p) => ({ slug: p.slug }))
  } catch {
    return SEED_PROJECTS.map((p) => ({ slug: p.slug }))
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: project.title,
    description: project.short_description || project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.short_description || project.description.slice(0, 160),
      images: project.cover_image_url ? [{ url: project.cover_image_url }] : [],
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
  }

  const allImages = [project.cover_image_url, ...project.gallery_urls].filter(Boolean)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Back link */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            id="back-to-projects"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{project.category}</Badge>
              {project.featured && <Badge>Featured</Badge>}
              <span className="ml-auto text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {project.short_description}
            </p>
          </div>

          {/* Cover image */}
          {project.cover_image_url && (
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted mb-10">
              <Image
                src={project.cover_image_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Tech stack */}
          <div className="mb-10 p-6 rounded-2xl border border-border/50 bg-card/50">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
            {project.description.split('\n\n').map((para, i) => {
              if (para.startsWith('**')) {
                const parts = para.split('**')
                return (
                  <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
                    {parts.map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} className="text-foreground font-semibold">
                          {part}
                        </strong>
                      ) : part
                    )}
                  </p>
                )
              }
              return (
                <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
                  {para}
                </p>
              )
            })}
          </div>

          {/* Gallery */}
          {project.gallery_urls.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Gallery
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.gallery_urls.map((url, i) => (
                  <div key={i} className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={url}
                      alt={`${project.title} screenshot ${i + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.live_url && (
              <Button asChild className="rounded-xl" id="project-live-link">
                <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live
                </Link>
              </Button>
            )}
            {project.github_url && (
              <Button asChild variant="outline" className="rounded-xl" id="project-github-link">
                <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>
            )}
            <Button asChild variant="ghost" className="ml-auto rounded-xl" id="hire-me-btn">
              <Link href="/#contact">
                Hire Me for Something Similar →
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  )
}
