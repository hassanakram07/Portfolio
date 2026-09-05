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
    client_name: 'Omar Farooq',
    client_role: 'Founder',
    company: 'Growify',
    quote:
      'Hassan set up an automation for our lead pipeline that I honestly thought would take months. He delivered it in under two weeks and it just works. No fluff, no hand-holding needed. Exactly what I was looking for.',
    avatar_url: null,
    display_order: 1,
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: '2',
    client_name: 'Nadia Siddiqui',
    client_role: 'Operations Manager',
    company: 'TrustBridge',
    quote:
      'We had a messy HubSpot setup that nobody on our team could fix. Hassan cleaned it up, built proper workflows, and now everything syncs automatically. Saved us probably 10 hours a week easily.',
    avatar_url: null,
    display_order: 2,
    created_at: '2026-02-05T10:00:00Z',
  },
  {
    id: '3',
    client_name: 'Tariq Mahmood',
    client_role: 'Co-Founder',
    company: 'PocketSuite',
    quote:
      'I came to Hassan with a vague idea for an AI chatbot for our support team. He asked the right questions, scoped it properly, and built something that actually handles real customer queries well. Very impressed.',
    avatar_url: null,
    display_order: 3,
    created_at: '2026-02-14T10:00:00Z',
  },
  {
    id: '4',
    client_name: 'Layla Hassan',
    client_role: 'Product Lead',
    company: 'Streamline',
    quote:
      'Good communication throughout, clean code, and delivered on time. The dashboard he built for us still runs perfectly months later. Will definitely work with him again on our next project.',
    avatar_url: null,
    display_order: 4,
    created_at: '2026-02-22T10:00:00Z',
  },
  {
    id: '5',
    client_name: 'Bilal Chaudhry',
    client_role: 'CEO',
    company: 'NovaCraft',
    quote:
      'Hassan helped us automate our weekly reporting which used to take our team half a day every Friday. Now it runs on its own every morning. Small thing but it made a big difference for us.',
    avatar_url: null,
    display_order: 5,
    created_at: '2026-03-01T10:00:00Z',
  },
]
