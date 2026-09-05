'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { SiteSettings } from '@/types'

const DEFAULT_BIO =
  "I'm Hassan Akram, a full-stack developer with 5+ years of experience turning complex business problems into elegant, automated solutions. I specialize in AI/ML integrations, n8n workflow automation, HubSpot CRM development, and modern web applications. Whether you need a custom AI agent, a hands-free automation pipeline, or a full-featured SaaS — I ship production-ready code, not just prototypes."

const DEFAULT_STATS = {
  projects: 47,
  years: 5,
  technologies: 30,
  satisfaction: 98,
}

const TECH_ITEMS = [
  'OpenAI', 'n8n', 'HubSpot', 'Supabase', 'Python', 'Next.js',
  'LangChain', 'Streamlit', 'PostgreSQL', 'Docker', 'TypeScript', 'Vercel',
  'FastAPI', 'Redis', 'Pinecone', 'Langfuse', 'React', 'Node.js',
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1600
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

interface AboutSectionProps {
  settings?: SiteSettings['about']
}

export function AboutSection({ settings }: AboutSectionProps) {
  const bio = settings?.bio ?? DEFAULT_BIO
  const stats = settings?.stats ?? DEFAULT_STATS
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const STATS = [
    { label: 'Projects Delivered', value: stats.projects, suffix: '+' },
    { label: 'Years Experience', value: stats.years, suffix: '+' },
    { label: 'Technologies', value: stats.technologies, suffix: '+' },
    { label: 'Client Satisfaction', value: stats.satisfaction, suffix: '%' },
  ]

  return (
    <section id="about" className="section-padding overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Section header */}
          <div className="mb-10 sm:mb-16 text-center">
            <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary">
              About
            </p>
            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              The Engineer Behind the Work
            </h2>
          </div>

          <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 lg:items-center">
            {/* Bio & Stats */}
            <div className="space-y-6 sm:space-y-8">
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground text-left">
                {bio}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl sm:rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-3.5 sm:p-5 text-center transition-all hover:border-primary/30"
                  >
                    <div className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium line-clamp-1 sm:line-clamp-none">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech marquee */}
            <div className="w-full min-w-0">
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Tools & Technologies
              </p>
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm py-4 sm:py-6">
                {/* Fade edges */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-8 sm:w-16 bg-gradient-to-r from-card/90 to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 sm:w-16 bg-gradient-to-l from-card/90 to-transparent z-10" />

                {/* Row 1 */}
                <div className="flex animate-marquee gap-2.5 sm:gap-4 whitespace-nowrap mb-2.5 sm:mb-3">
                  {[...TECH_ITEMS, ...TECH_ITEMS].map((tech, i) => (
                    <span
                      key={`${tech}-${i}`}
                      className="inline-flex items-center rounded-lg border border-border/50 bg-background/50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Row 2 (reversed) */}
                <div
                  className="flex gap-2.5 sm:gap-4 whitespace-nowrap"
                  style={{ animation: 'marquee 30s linear infinite reverse' }}
                >
                  {[...TECH_ITEMS.slice(9), ...TECH_ITEMS.slice(0, 9), ...TECH_ITEMS.slice(9), ...TECH_ITEMS.slice(0, 9)].map((tech, i) => (
                    <span
                      key={`${tech}-r-${i}`}
                      className="inline-flex items-center rounded-lg border border-border/50 bg-background/50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
