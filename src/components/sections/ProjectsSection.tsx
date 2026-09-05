'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import { Button } from '@/components/ui/button'
import type { Project, ProjectCategory } from '@/types'
import { PROJECT_CATEGORIES } from '@/types'

interface ProjectsSectionProps {
  projects: Project[]
}

const ALL_LABEL = 'All'

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [activeFilter, setActiveFilter] = useState<string>(ALL_LABEL)

  const categories = [ALL_LABEL, ...PROJECT_CATEGORIES.filter((c) =>
    projects.some((p) => p.category === c)
  )]

  const filtered =
    activeFilter === ALL_LABEL
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <section id="projects" className="section-padding">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Header */}
          <div className="mb-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Portfolio
              </p>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Selected Work
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Real projects with real results. Each case study shows the problem, solution, and measurable impact.
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="mt-6 sm:mt-0"
              id="view-all-projects-btn"
            >
              <Link href="/projects">
                View all projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Filter tabs */}
          <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by category">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
                id={`filter-${cat.toLowerCase().replace(' ', '-')}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  activeFilter === cat
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'border border-border/50 bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No projects in this category yet.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
