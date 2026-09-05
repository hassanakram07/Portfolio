'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, X, Sparkles, FolderKanban } from 'lucide-react'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Project, ProjectCategory } from '@/types'

const CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'AI',
  'Automation',
  'CRM',
  'Web App',
  'Other',
]

interface AllProjectsClientProps {
  initialProjects: Project[]
}

export function AllProjectsClient({ initialProjects }: AllProjectsClientProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | ProjectCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = initialProjects.filter((project) => {
    const matchesCategory =
      activeCategory === 'All' || project.category === activeCategory
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      q === '' ||
      project.title.toLowerCase().includes(q) ||
      project.short_description.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.tech_stack.some((t) => t.toLowerCase().includes(q))

    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            id="back-home-link"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            <FolderKanban className="h-3.5 w-3.5" />
            Archive & Showcase
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            All Projects & Case Studies
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            A comprehensive showcase of autonomous AI solutions, n8n workflow automations, CRM integrations, and full-stack web applications built by Hassan Akram.
          </p>
        </div>

        {/* Controls: Search & Category Filter */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  id={`all-filter-${cat.toLowerCase().replace(' ', '-')}`}
                  className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'border border-border/50 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 text-sm rounded-xl bg-card/50"
                id="search-projects-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active stats counter */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>
              Showing <strong className="text-foreground">{filteredProjects.length}</strong> of{' '}
              {initialProjects.length} projects
            </span>
            {(activeCategory !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setActiveCategory('All')
                  setSearchQuery('')
                }}
                className="text-primary hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center my-12 bg-card/30">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No matching projects</h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
              No projects match your current filters. Try searching for a different keyword or selecting &quot;All&quot;.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveCategory('All')
                setSearchQuery('')
              }}
              className="mt-4 text-xs rounded-xl"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
