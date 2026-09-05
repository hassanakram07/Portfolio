import type { Project, Testimonial } from '@/types'

export const SEED_PROJECTS: Project[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Autonomous Multi-Agent AI Workflow',
    slug: 'autonomous-ai-workflow',
    short_description:
      'Custom multi-agent system executing business research, automated competitor analysis, and lead qualification with LangChain and Claude.',
    description:
      'An end-to-end multi-agent system built for a B2B SaaS company. Three autonomous agents operate in sequence: Agent 1 scrapes and summarizes prospective target accounts, Agent 2 checks CRM historical data and enriches company profiles, and Agent 3 crafts hyper-personalized outreach strategies with verified ROI calculations.\n\nThe system reduced customer qualification turnaround time from 4 days to 18 minutes, helping the client scale outbound reach by 600% without adding headcount.',
    cover_image_url:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    ],
    tech_stack: ['OpenAI', 'LangChain', 'FastAPI', 'Python', 'Supabase', 'Next.js'],
    category: 'AI',
    live_url: 'https://demo-ai-workflow.dev',
    github_url: 'https://github.com/hassanakram/multi-agent-workflow',
    featured: true,
    display_order: 1,
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Enterprise n8n Workflow Automation Engine',
    slug: 'n8n-automation-engine',
    short_description:
      'Robust synchronization engine connecting Stripe, HubSpot, Slack, and internal PostgreSQL with zero data loss and automated reconciliation.',
    description:
      'Designed and deployed self-hosted n8n infrastructure handling 150,000+ monthly task executions. The system processes webhook events from Stripe payments, updates HubSpot lifecycle stages and custom deal objects in real time, alerts account executives in Slack with interactive action buttons, and triggers automatic customer onboarding email sequences.\n\nIncludes built-in retry mechanisms, error alerting channels, and cryptographic signature verification on all incoming webhooks.',
    cover_image_url:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    ],
    tech_stack: ['n8n', 'HubSpot API', 'Stripe API', 'PostgreSQL', 'Docker', 'Slack API'],
    category: 'Automation',
    live_url: null,
    github_url: 'https://github.com/hassanakram/n8n-pipeline-templates',
    featured: true,
    display_order: 2,
    created_at: '2026-02-01T10:00:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'HubSpot Custom Objects & Revenue Attribution Sync',
    slug: 'hubspot-custom-pipeline',
    short_description:
      'Deep HubSpot architecture featuring custom objects, automated calculated commissions, and bidirectional warehouse synchronization.',
    description:
      'Engineered custom CRM schemas including custom objects for Subscriptions, Partner Referrals, and Product Licenses. Created automated deal workflows calculating tiered commission rates and rep quotas based on contract ARR.\n\nImplemented serverless sync workers that reconcile billing anomalies between the financial warehouse and HubSpot deals nightly, reducing manual accounting disputes to 0%.',
    cover_image_url:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    ],
    tech_stack: ['HubSpot API', 'Node.js', 'TypeScript', 'AWS Lambda', 'Webhooks'],
    category: 'CRM',
    live_url: 'https://hubspot.com',
    github_url: null,
    featured: false,
    display_order: 3,
    created_at: '2026-02-15T10:00:00Z',
  },
]

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    client_name: 'David Vance',
    client_role: 'Founder & CEO',
    company: 'NexusScale',
    quote:
      'Hassan built our autonomous outbound AI system in 2 weeks. It qualified 300+ leads in the first month alone, saving our SDR team 25 hours a week. Invaluable partner.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    display_order: 1,
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: '2',
    client_name: 'Sarah Chen',
    client_role: 'VP of Growth',
    company: 'FinPulse',
    quote:
      'The n8n and HubSpot integration Hassan implemented resolved all our data synchronization issues. Our conversion reporting is finally 100% accurate across all channels.',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
    display_order: 2,
    created_at: '2026-02-05T10:00:00Z',
  },
  {
    id: '3',
    client_name: 'Marcus Brody',
    client_role: 'Head of Operations',
    company: 'Synapse Automations',
    quote:
      'One of the best freelance developers I have worked with. Clean architecture, proactive communication, and delivered before the agreed deadline.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    display_order: 3,
    created_at: '2026-02-22T10:00:00Z',
  },
]
