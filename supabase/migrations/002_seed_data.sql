-- ============================================================
-- Portfolio Website — Seed Data
-- ============================================================

-- ============================================================
-- DEFAULT SITE SETTINGS
-- ============================================================
insert into public.site_settings (key, value) values
(
  'hero',
  '{
    "headline": "I Build AI Systems That Work While You Sleep",
    "subheadline": "Specializing in AI/ML solutions, workflow automation, CRM integrations, and full-stack applications that give your business an unfair advantage.",
    "available": true
  }'::jsonb
),
(
  'about',
  '{
    "bio": "I''m Alex Carter, a full-stack developer with 5+ years of experience turning complex business problems into elegant, automated solutions. I specialize in AI/ML integrations, n8n workflow automation, HubSpot CRM development, and modern web applications. Whether you need a custom AI agent, a hands-free automation pipeline, or a full-featured SaaS — I ship production-ready code, not just prototypes.",
    "stats": {
      "projects": 47,
      "years": 5,
      "technologies": 30,
      "satisfaction": 98
    }
  }'::jsonb
)
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ============================================================
-- SEED PROJECTS
-- ============================================================
insert into public.projects (
  title, slug, description, short_description, cover_image_url,
  gallery_urls, tech_stack, category, live_url, github_url,
  featured, display_order
) values
(
  'AI Support Agent for SaaS Platform',
  'ai-support-agent-saas',
  'Built a production-grade AI support agent for a B2B SaaS company handling 500+ tickets per day. The system uses GPT-4 with a custom retrieval-augmented generation (RAG) pipeline trained on the client''s knowledge base, reducing first-response time from 4 hours to under 2 minutes and handling 78% of inquiries autonomously without human intervention.

**The Problem:** The client''s 6-person support team was drowning in repetitive tickets. 80% of questions were answered in the docs, but customers couldn''t find answers themselves.

**The Solution:** I built a RAG-powered chatbot integrated directly into their Intercom workspace. The system ingests their docs via a nightly n8n pipeline, stores embeddings in Supabase pgvector, and uses a confidence threshold to gracefully escalate to human agents when uncertain.

**Results:** 78% autonomous resolution rate, $15K/month saved in support costs, CSAT score improved from 3.8 to 4.7/5.',
  'RAG-powered AI support agent achieving 78% autonomous resolution — saving $15K/month in support costs.',
  '',
  '["", ""]'::jsonb,
  '["GPT-4", "LangChain", "Supabase pgvector", "n8n", "Python", "FastAPI", "Intercom API", "Next.js"]'::jsonb,
  'AI',
  null,
  null,
  true,
  1
),
(
  'HubSpot + n8n Revenue Operations Pipeline',
  'hubspot-n8n-revops-pipeline',
  'Designed and implemented a complete revenue operations automation stack for a 50-person sales team using HubSpot CRM and n8n. The system automates lead scoring, deal routing, follow-up sequences, and reporting — eliminating 20+ hours of manual work per week across the sales org.

**The Problem:** The client''s sales team was manually updating HubSpot, copy-pasting data between tools, and missing follow-ups due to no automation. Deals were slipping through the cracks.

**The Solution:** I built 14 interconnected n8n workflows that sync data bidirectionally between HubSpot, Slack, Google Sheets, and their internal CRM. A custom lead scoring model automatically prioritizes inbound leads and routes them to the right rep within 90 seconds.

**Results:** 20+ hours/week saved, lead response time down from 2 hours to 90 seconds, 34% improvement in deal close rate over 90 days.',
  'End-to-end revenue operations automation connecting HubSpot, n8n, Slack, and Google Sheets.',
  '',
  '["", ""]'::jsonb,
  '["n8n", "HubSpot API", "Python", "Google Sheets API", "Slack API", "PostgreSQL", "Redis", "Docker"]'::jsonb,
  'Automation',
  null,
  null,
  true,
  2
),
(
  'Streamlit AI Data Analytics Dashboard',
  'streamlit-ai-analytics-dashboard',
  'Built a white-labeled AI analytics dashboard for a market research firm that allows their non-technical clients to query, visualize, and generate reports from complex datasets using natural language. The tool replaces a $50K/year enterprise BI subscription.

**The Problem:** The client''s customers needed to extract insights from large CSV/Excel datasets but had no SQL knowledge. The firm was spending 15+ hours per client per month manually generating reports.

**The Solution:** I built a Streamlit application with an OpenAI function-calling backend that converts natural language questions into pandas operations, generates interactive Plotly charts, and exports polished PDF reports. The entire stack runs on a single Render deployment.

**Results:** Report generation time cut from 15 hours to 8 minutes, 100% of clients onboarded within 1 day, enabling the firm to 3x their client capacity without adding headcount.',
  'Natural language analytics dashboard — query complex datasets and generate reports with plain English.',
  '',
  '["", ""]'::jsonb,
  '["Python", "Streamlit", "OpenAI", "Pandas", "Plotly", "PostgreSQL", "Render", "WeasyPrint"]'::jsonb,
  'AI',
  null,
  null,
  false,
  3
)
on conflict (slug) do nothing;

-- ============================================================
-- SEED TESTIMONIALS
-- ============================================================
insert into public.testimonials (
  client_name, client_role, company, quote, avatar_url, display_order
) values
(
  'Sarah Mitchell',
  'Head of Customer Success',
  'Growlytics SaaS',
  'Alex built our AI support agent in 3 weeks and it completely transformed how we handle customer inquiries. We went from a team constantly firefighting tickets to an automated system that handles 78% of questions instantly. ROI was clear within the first month. Absolutely worth every penny — and I''ve worked with a lot of developers.',
  null,
  1
),
(
  'James Okonkwo',
  'VP of Sales',
  'Meridian Capital Partners',
  'The n8n + HubSpot automation Alex built is genuinely one of the best investments we''ve made as a company. Our reps used to spend hours on manual data entry. Now they focus on selling. Close rates are up, morale is up, and we have data we''ve never had before. Alex also documented everything clearly so our team can maintain it.',
  null,
  2
),
(
  'Priya Nair',
  'Co-Founder',
  'DataSpark Analytics',
  'We needed a custom analytics tool that could replace a $50K enterprise subscription. Alex delivered something better. The Streamlit dashboard is beautiful, our clients love the natural language querying, and we can now serve 3x the clients with the same team. Alex communicated throughout, hit every deadline, and the code is clean and maintainable.',
  null,
  3
)
on conflict do nothing;
