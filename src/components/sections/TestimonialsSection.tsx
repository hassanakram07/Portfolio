'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Testimonial } from '@/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [current, setCurrent] = useState(0)

  // Auto-advance
  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  if (testimonials.length === 0) return null

  return (
    <section id="testimonials" className="section-padding bg-muted/20">
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
              Testimonials
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              What Clients Say
            </h2>
          </div>

          {/* Carousel */}
          <div className="relative mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card p-8 sm:p-12">
              <Quote className="h-10 w-10 text-primary/30 mb-6" />

              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <blockquote className="text-lg leading-relaxed text-foreground sm:text-xl mb-8">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {testimonials[current].avatar_url && (
                      <AvatarImage
                        src={testimonials[current].avatar_url!}
                        alt={testimonials[current].client_name}
                      />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonials[current].client_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonials[current].client_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[current].client_role}
                      {testimonials[current].company && (
                        <> · {testimonials[current].company}</>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={prev}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                  aria-label="Previous testimonial"
                  id="testimonial-prev-btn"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === current ? 'w-6 bg-primary' : 'w-2 bg-border'
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                  aria-label="Next testimonial"
                  id="testimonial-next-btn"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
