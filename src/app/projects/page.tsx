import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { FooterSection } from '@/components/sections/FooterSection'
import { AllProjectsClient } from '@/components/sections/AllProjectsClient'
import { connectToDatabase } from '@/lib/mongodb'
import { ensureDatabaseSeeded } from '@/lib/db-init'
import { ProjectModel } from '@/models/Project'
import { SEED_PROJECTS } from '@/lib/constants'
import type { Project } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'All Projects & Case Studies | Hassan Akram',
  description:
    'Browse the full portfolio of autonomous AI systems, n8n workflow automations, CRM integrations, and full-stack applications built by Hassan Akram.',
}

async function getProjects(): Promise<Project[]> {
  try {
    await ensureDatabaseSeeded()
    await connectToDatabase()

    const projectDocs = await ProjectModel.find().sort({ display_order: 1 }).lean()

    if (projectDocs && projectDocs.length > 0) {
      return projectDocs.map((p: any) => ({
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
      }))
    }

    return SEED_PROJECTS
  } catch (error) {
    console.error('Error fetching projects in /projects:', error)
    return SEED_PROJECTS
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      <Navbar />
      <main>
        <AllProjectsClient initialProjects={projects} />
      </main>
      <FooterSection />
    </>
  )
}
