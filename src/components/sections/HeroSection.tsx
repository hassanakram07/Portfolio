'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Bot,
  Workflow,
  TrendingUp,
  Star,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { SiteSettings } from '@/types'

const DEFAULT_SETTINGS = {
  headline: 'I Build AI Systems That Work While You Sleep',
  subheadline:
    'Specializing in AI/ML solutions, workflow automation, CRM integrations, and full-stack applications that give your business an unfair advantage.',
  available: true,
}

const VALUE_PILLARS = [
  {
    icon: Bot,
    tag: 'Autonomous AI',
    title: 'Custom AI Agents & RAG',
    description:
      'Autonomous multi-agent workflows with tool calling, private vector memory, and enterprise LLM integrations.',
  },
  {
    icon: Workflow,
    tag: 'n8n & Webhooks',
    title: 'Self-Healing Automations',
    description:
      'Zero-loss background pipelines executing 150k+ tasks/month with automated alerting and failover recovery.',
  },
  {
    icon: TrendingUp,
    tag: 'HubSpot & CRM',
    title: 'Revenue Attribution Sync',
    description:
      'Custom CRM objects, automated lead routing, and bidirectional data reconciliation that accelerate conversions.',
  },
]

interface HeroSectionProps {
  settings?: SiteSettings['hero']
}

export function HeroSection({ settings }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.7], [0, -40])

  const hero = settings ?? DEFAULT_SETTINGS

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-border/20"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />

      {/* Subtle Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 container mx-auto max-w-5xl px-4 text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Availability Status Badge */}
          {hero.available && (
            <motion.div variants={itemVariants} className="mb-6 inline-block">
              <Badge
                variant="outline"
                className="gap-2 px-3.5 py-1.5 text-xs font-medium border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded-full shadow-sm"
                id="available-badge"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available for Q1/Q2 Projects & Contracts
              </Badge>
            </motion.div>
          )}

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            I Build{' '}
            <span className="gradient-text">AI Systems</span>
            <br className="hidden sm:block" />
            {' '}That Work While{' '}
            <span className="gradient-text">You Sleep</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
          >
            {hero.subheadline}
          </motion.p>

          {/* Specialties Pills */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            {['AI/ML Solutions', 'Workflow Automation (n8n)', 'HubSpot CRM Dev', 'Full-Stack Apps'].map(
              (spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 backdrop-blur-sm px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                  {spec}
                </span>
              )
            )}
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-xl px-8 h-12 text-sm font-semibold glow-blue shadow-lg shadow-primary/20"
              id="hero-view-work-btn"
            >
              <Link href="#projects">
                View Featured Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-xl px-8 h-12 text-sm font-semibold border-border/70 hover:bg-muted/50"
              id="hero-get-in-touch-btn"
            >
              <Link href="#contact">Get In Touch</Link>
            </Button>
          </motion.div>

          {/* Client Trust & Social Proof Bar */}
          <motion.div
            variants={itemVariants}
            className="mt-8 pt-6 border-t border-border/30 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-foreground">5.0 Star Rating</span>
              <span className="text-muted-foreground/70">• 40+ Projects Shipped</span>
            </div>

            <div className="h-3.5 w-px bg-border/60 hidden sm:block" />

            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-foreground font-medium">100% On-Time Delivery</span>
            </div>

            <div className="h-3.5 w-px bg-border/60 hidden sm:block" />

            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-foreground font-medium">Production-Ready Architecture</span>
            </div>
          </motion.div>

          {/* Value Pillars Showcase Cards - Fills the gap with high-converting value */}
          <motion.div
            variants={itemVariants}
            className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left"
          >
            {VALUE_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-5 transition-all duration-300 hover:border-primary/40 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-105 transition-transform">
                    <pillar.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 px-2.5 py-0.5 rounded-full bg-muted/60 border border-border/40">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
