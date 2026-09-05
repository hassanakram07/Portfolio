import { Navbar } from '@/components/ui/Navbar'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { FooterSection } from '@/components/sections/FooterSection'
import { connectToDatabase } from '@/lib/mongodb'
import { ensureDatabaseSeeded } from '@/lib/db-init'
import { ProjectModel } from '@/models/Project'
import { TestimonialModel } from '@/models/Testimonial'
import { SiteSettingModel } from '@/models/SiteSetting'
import type { Project, Testimonial, SiteSettings } from '@/types'

import { SEED_PROJECTS, SEED_TESTIMONIALS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

async function getData() {
  try {
    await ensureDatabaseSeeded()
    await connectToDatabase()

    const [projectDocs, testimonialDocs, heroDoc, aboutDoc] = await Promise.all([
      ProjectModel.find().sort({ display_order: 1 }).lean(),
      TestimonialModel.find().sort({ display_order: 1 }).lean(),
      SiteSettingModel.findOne({ key: 'hero' }).lean(),
      SiteSettingModel.findOne({ key: 'about' }).lean(),
    ])

    const projects: Project[] =
      projectDocs && projectDocs.length > 0
        ? projectDocs.map((p: any) => ({
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
        : SEED_PROJECTS

    const testimonials: Testimonial[] =
      testimonialDocs && testimonialDocs.length > 0
        ? testimonialDocs.map((t: any) => ({
            id: t._id.toString(),
            client_name: t.client_name,
            client_role: t.client_role,
            company: t.company,
            quote: t.quote,
            avatar_url: t.avatar_url || null,
            display_order: t.display_order ?? 0,
            created_at: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
          }))
        : SEED_TESTIMONIALS

    return {
      projects,
      testimonials,
      settings: {
        hero: (heroDoc?.value as SiteSettings['hero']) || undefined,
        about: (aboutDoc?.value as SiteSettings['about']) || undefined,
      } satisfies SiteSettings,
    }
  } catch (error) {
    console.error('Error fetching homepage data from MongoDB:', error)
    return {
      projects: SEED_PROJECTS,
      testimonials: SEED_TESTIMONIALS,
      settings: {} as SiteSettings,
    }
  }
}

export default async function HomePage() {
  const { projects, testimonials, settings } = await getData()

  return (
    <>
      <Navbar />
      <main>
        <HeroSection settings={settings.hero} />
        <AboutSection settings={settings.about} />
        <ServicesSection />
        <ProjectsSection projects={projects} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection />
      </main>
      <FooterSection />
    </>
  )
}
