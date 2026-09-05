'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Brain, Zap, Users, MessageSquare, Code2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { SERVICES } from '@/types'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Zap,
  Users,
  MessageSquare,
  Code2,
}

export function ServicesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" className="section-padding bg-muted/20">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              What I Do
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Services That Drive Results
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Every engagement is built around measurable business outcomes — not just deliverables.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => {
              const Icon = ICONS[service.icon]
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  id={`service-card-${service.id}`}
                >
                  <Card className="group h-full rounded-2xl border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/40">
                        {Icon && <Icon className="h-6 w-6 text-primary" />}
                      </div>
                      <h3 className="mb-2 font-heading text-lg font-semibold">
                        {service.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
