// TypeScript types for the Portfolio application

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  cover_image_url: string
  gallery_urls: string[]
  tech_stack: string[]
  category: ProjectCategory
  live_url: string | null
  github_url: string | null
  featured: boolean
  display_order: number
  created_at: string
}

export type ProjectCategory = 'AI' | 'Automation' | 'CRM' | 'Web App' | 'Other'

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'AI',
  'Automation',
  'CRM',
  'Web App',
  'Other',
]

export interface Testimonial {
  id: string
  client_name: string
  client_role: string
  company: string
  quote: string
  avatar_url: string | null
  display_order: number
  created_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  project_type: string
  budget_range: string
  message: string
  status: 'unread' | 'read' | 'replied'
  created_at: string
}

export interface SiteSettings {
  hero?: {
    headline: string
    subheadline: string
    available: boolean
  }
  about?: {
    bio: string
    stats: {
      projects: number
      years: number
      technologies: number
      satisfaction: number
    }
  }
}

export interface ServiceCard {
  id: string
  icon: string
  title: string
  description: string
}

export const SERVICES: ServiceCard[] = [
  {
    id: 'ai-agent',
    icon: 'Brain',
    title: 'AI Agent Development',
    description:
      'Custom GPT-4 and Claude-powered agents with RAG pipelines, function calling, and autonomous task execution — trained on your specific business context.',
  },
  {
    id: 'workflow-automation',
    icon: 'Zap',
    title: 'Workflow Automation',
    description:
      'End-to-end automation pipelines with n8n connecting your entire tech stack — CRM, email, Slack, databases, and 400+ integrations — eliminating manual work.',
  },
  {
    id: 'crm-integration',
    icon: 'Users',
    title: 'CRM Integration',
    description:
      'Deep HubSpot customizations: custom objects, calculated properties, automated sequences, lead scoring models, and bidirectional third-party data syncs.',
  },
  {
    id: 'chatbot',
    icon: 'MessageSquare',
    title: 'Chatbot Development',
    description:
      'Production-ready AI chatbots for customer support, lead qualification, and internal tooling — integrated with Intercom, Zendesk, Slack, or any platform.',
  },
  {
    id: 'fullstack',
    icon: 'Code2',
    title: 'Full-Stack Web Apps',
    description:
      'Modern, performant web applications with Next.js, Supabase, and Tailwind. From MVP to production-grade SaaS — clean architecture, TypeScript throughout.',
  },
]

export const TECH_STACK_LOGOS = [
  { name: 'OpenAI', logo: '/logos/openai.svg' },
  { name: 'n8n', logo: '/logos/n8n.svg' },
  { name: 'HubSpot', logo: '/logos/hubspot.svg' },
  { name: 'Supabase', logo: '/logos/supabase.svg' },
  { name: 'Python', logo: '/logos/python.svg' },
  { name: 'Next.js', logo: '/logos/nextjs.svg' },
  { name: 'LangChain', logo: '/logos/langchain.svg' },
  { name: 'Streamlit', logo: '/logos/streamlit.svg' },
  { name: 'PostgreSQL', logo: '/logos/postgresql.svg' },
  { name: 'Docker', logo: '/logos/docker.svg' },
  { name: 'TypeScript', logo: '/logos/typescript.svg' },
  { name: 'Vercel', logo: '/logos/vercel.svg' },
]

export const SOCIAL_LINKS = {
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  fiverr: 'https://fiverr.com',
  email: 'hassan@example.com',
}

export const BUDGET_RANGES = [
  'Under $500',
  '$500 – $1,500',
  '$1,500 – $5,000',
  '$5,000 – $15,000',
  '$15,000+',
  'Not sure yet',
]

export const PROJECT_TYPES = [
  'AI Agent / Chatbot',
  'Workflow Automation (n8n)',
  'CRM Integration (HubSpot)',
  'Full-Stack Web App',
  'Data Analytics Dashboard',
  'API Integration',
  'Consulting / Strategy',
  'Other',
]
