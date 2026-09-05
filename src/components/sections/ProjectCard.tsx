'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Github } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [open, setOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const images = [
    project.cover_image_url,
    ...project.gallery_urls,
  ].filter(Boolean)

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.08, duration: 0.5 }}
        className="group cursor-pointer"
        onClick={() => setOpen(true)}
        id={`project-card-${project.slug}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
        aria-label={`View details for ${project.title}`}
      >
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
          {/* Cover image */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 via-blue-900/20 to-cyan-900/20">
            {project.cover_image_url ? (
              <Image
                src={project.cover_image_url}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-heading font-bold text-primary">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Category overlay */}
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur-sm text-xs"
              >
                {project.category}
              </Badge>
            </div>

            {/* Featured indicator */}
            {project.featured && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary/90 text-primary-foreground text-xs backdrop-blur-sm">
                  Featured
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-heading text-base font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
              {project.short_description || project.description.slice(0, 120) + '…'}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md border border-border/50 bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
              {project.tech_stack.length > 4 && (
                <span className="inline-flex items-center rounded-md border border-border/50 bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                  +{project.tech_stack.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.article>

      {/* Project detail modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl">
          {/* Image gallery */}
          {images.length > 0 && (
            <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-muted">
              <Image
                src={images[currentImage]}
                alt={`${project.title} screenshot ${currentImage + 1}`}
                fill
                className="object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrentImage((prev) => (prev - 1 + images.length) % images.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur-sm hover:bg-background"
                    id="gallery-prev-btn"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrentImage((prev) => (prev + 1) % images.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur-sm hover:bg-background"
                    id="gallery-next-btn"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setCurrentImage(i) }}
                        className={`h-1.5 rounded-full transition-all ${i === currentImage ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{project.category}</Badge>
              {project.featured && <Badge>Featured</Badge>}
            </div>

            <h2 className="font-heading text-2xl font-bold mb-3">{project.title}</h2>

            {/* Description with markdown-like rendering */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mb-6">
              {project.description.split('\n\n').map((para, i) => {
                if (para.startsWith('**')) {
                  const parts = para.split('**')
                  return (
                    <p key={i} className="mb-3">
                      {parts.map((part, j) =>
                        j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part
                      )}
                    </p>
                  )
                }
                return <p key={i} className="mb-3">{para}</p>
              })}
            </div>

            {/* Tech stack */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              {project.live_url && (
                <Button asChild size="sm" className="rounded-lg" id={`modal-live-link-${project.slug}`}>
                  <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3.5 w-3.5" />
                    Live Demo
                  </Link>
                </Button>
              )}
              {project.github_url && (
                <Button asChild size="sm" variant="outline" className="rounded-lg" id={`modal-github-link-${project.slug}`}>
                  <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-3.5 w-3.5" />
                    GitHub
                  </Link>
                </Button>
              )}
              <Button asChild size="sm" variant="ghost" className="rounded-lg ml-auto" id={`modal-detail-link-${project.slug}`}>
                <Link href={`/projects/${project.slug}`}>
                  Full Case Study →
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
