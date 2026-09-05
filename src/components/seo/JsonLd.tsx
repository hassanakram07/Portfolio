import { SOCIAL_LINKS } from '@/types'

export function PersonJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hassanakram.dev'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Hassan Akram',
    jobTitle: 'AI & Automation Engineer',
    description:
      'Freelance developer specializing in AI/ML solutions, workflow automation (n8n), CRM integrations (HubSpot), and full-stack web applications.',
    url: siteUrl,
    sameAs: [
      SOCIAL_LINKS.linkedin.startsWith('http') ? SOCIAL_LINKS.linkedin : `https://${SOCIAL_LINKS.linkedin}`,
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Machine Learning',
      'Large Language Models',
      'n8n',
      'HubSpot CRM',
      'Workflow Automation',
      'Next.js',
      'React',
      'TypeScript',
      'Python',
      'Supabase',
      'PostgreSQL',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
