import type { MetadataRoute } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import { ProjectModel } from '@/models/Project'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hassanakram.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  try {
    await connectToDatabase()
    const projects = await ProjectModel.find({}, 'slug createdAt updatedAt').lean()

    const projectRoutes: MetadataRoute.Sitemap = (projects ?? []).map((p: any) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    return [...staticRoutes, ...projectRoutes]
  } catch {
    return staticRoutes
  }
}
