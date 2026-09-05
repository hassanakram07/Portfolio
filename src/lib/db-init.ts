import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import { AdminUserModel } from '@/models/AdminUser'
import { ProjectModel } from '@/models/Project'
import { TestimonialModel } from '@/models/Testimonial'
import { SiteSettingModel } from '@/models/SiteSetting'
import { SEED_PROJECTS, SEED_TESTIMONIALS } from '@/lib/constants'

export async function ensureDatabaseSeeded() {
  await connectToDatabase()

  // 1. Seed Admin User
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@portfolio.local').toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const existingAdmin = await AdminUserModel.findOne({ email: adminEmail })
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(adminPassword, salt)
    await AdminUserModel.create({
      email: adminEmail,
      passwordHash,
      role: 'admin',
    })
    console.log(`[DB Init] Initial admin user created: ${adminEmail}`)
  }

  // 2. Seed Projects
  const projectCount = await ProjectModel.countDocuments()
  if (projectCount === 0) {
    const projectsToInsert = SEED_PROJECTS.map((p) => ({
      title: p.title,
      slug: p.slug,
      short_description: p.short_description,
      description: p.description,
      cover_image_url: p.cover_image_url,
      gallery_urls: p.gallery_urls,
      tech_stack: p.tech_stack,
      category: p.category,
      live_url: p.live_url,
      github_url: p.github_url,
      featured: p.featured,
      display_order: p.display_order,
    }))
    await ProjectModel.insertMany(projectsToInsert)
    console.log(`[DB Init] Inserted ${projectsToInsert.length} seed projects`)
  }

  // 3. Seed Testimonials
  const testimonialCount = await TestimonialModel.countDocuments()
  if (testimonialCount === 0) {
    const testimonialsToInsert = SEED_TESTIMONIALS.map((t) => ({
      client_name: t.client_name,
      client_role: t.client_role,
      company: t.company,
      quote: t.quote,
      avatar_url: t.avatar_url,
      display_order: t.display_order,
    }))
    await TestimonialModel.insertMany(testimonialsToInsert)
    console.log(`[DB Init] Inserted ${testimonialsToInsert.length} seed testimonials`)
  }

  // 4. Seed Site Settings
  const heroSetting = await SiteSettingModel.findOne({ key: 'hero' })
  if (!heroSetting) {
    await SiteSettingModel.create({
      key: 'hero',
      value: {
        headline: 'I Build AI Systems That Work While You Sleep',
        subheadline:
          'Specializing in AI/ML solutions, workflow automation, CRM integrations, and full-stack applications that give your business an unfair advantage.',
        available: true,
      },
    })
  }

  const aboutSetting = await SiteSettingModel.findOne({ key: 'about' })
  if (!aboutSetting) {
    await SiteSettingModel.create({
      key: 'about',
      value: {
        bio: "I'm Hassan Akram, a full-stack developer with 5+ years of experience engineering high-impact software solutions. I specialize in bridging advanced machine learning models with battle-tested automation infrastructure to build resilient business engines.",
        stats: {
          projects: 40,
          years: 5,
          technologies: 15,
          satisfaction: 99,
        },
      },
    })
  }
}
