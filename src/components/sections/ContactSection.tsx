'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Mail, Send, Calendar } from 'lucide-react'
import { Linkedin } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { contactFormSchema, type ContactFormValues } from '@/lib/validations'
import { SOCIAL_LINKS, BUDGET_RANGES, PROJECT_TYPES } from '@/types'
import Link from 'next/link'

export function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Something went wrong')
      }

      toast.success("Message sent! I'll get back to you within 24 hours.")
      reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
    }
  }

  const socials = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: SOCIAL_LINKS.linkedin.startsWith('http')
        ? SOCIAL_LINKS.linkedin
        : `https://${SOCIAL_LINKS.linkedin}`,
      id: 'social-linkedin',
    },
    {
      icon: Mail,
      label: 'Email',
      href: `mailto:${SOCIAL_LINKS.email}`,
      id: 'social-email',
    },
  ]

  return (
    <section id="contact" className="section-padding">
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
              Get In Touch
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Let&apos;s Build Something Together
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Tell me about your project. I read every message and respond within 24 hours.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="contact-form">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Your Name</Label>
                  <Input
                    id="contact-name"
                    placeholder="e.g. Sarah Jenkins"
                    {...register('name')}
                    className="rounded-xl"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email Address</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="e.g. sarah@company.com"
                    {...register('email')}
                    className="rounded-xl"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-project-type">Project Type</Label>
                  <Select onValueChange={(v) => setValue('project_type', v)}>
                    <SelectTrigger id="contact-project-type" className="rounded-xl" aria-invalid={!!errors.project_type}>
                      <SelectValue placeholder="Select a project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.project_type && (
                    <p className="text-xs text-destructive">{errors.project_type.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-budget">Budget Range</Label>
                  <Select onValueChange={(v) => setValue('budget_range', v)}>
                    <SelectTrigger id="contact-budget" className="rounded-xl" aria-invalid={!!errors.budget_range}>
                      <SelectValue placeholder="Select your budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_RANGES.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.budget_range && (
                    <p className="text-xs text-destructive">{errors.budget_range.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">Tell Me About Your Project</Label>
                <Textarea
                  id="contact-message"
                  placeholder="Describe your project, goals, and any specific requirements..."
                  rows={5}
                  {...register('message')}
                  className="rounded-xl resize-none"
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full rounded-xl"
                id="contact-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Social links */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Find Me Online
                </h3>
                <div className="space-y-2">
                  {socials.map((social) => (
                    <Link
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={social.id}
                      className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-3 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:bg-card hover:text-foreground"
                    >
                      <social.icon className="h-4 w-4 text-primary" />
                      {social.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Calendly */}
              {calendlyUrl && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                  <Calendar className="h-5 w-5 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">Prefer to Talk?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Book a free 30-minute discovery call directly on my calendar.
                  </p>
                  <Button asChild className="w-full rounded-lg" size="sm" id="calendly-btn">
                    <Link href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                      Book a Call
                    </Link>
                  </Button>
                </div>
              )}

              {/* Response time */}
              <div className="rounded-xl border border-border/50 bg-card/50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  <span className="text-sm font-medium text-green-400">Available for work</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Typical response time: <strong className="text-foreground">under 24 hours</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
