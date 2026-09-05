import { z } from 'zod'

// ============================================================
// CONTACT FORM
// ============================================================
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  project_type: z
    .string()
    .min(1, 'Please select a project type'),
  budget_range: z
    .string()
    .min(1, 'Please select a budget range'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(5000, 'Message is too long'),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

// ============================================================
// PROJECT FORM (admin)
// ============================================================
export const projectFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title is too long'),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only'
    ),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters'),
  short_description: z
    .string()
    .min(20, 'Short description must be at least 20 characters')
    .max(200, 'Short description is too long'),
  cover_image_url: z.string(),
  gallery_urls: z.array(z.string()),
  tech_stack: z
    .array(z.string())
    .min(1, 'Add at least one technology'),
  category: z.enum(['AI', 'Automation', 'CRM', 'Web App', 'Other']),
  live_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  github_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  featured: z.boolean(),
  display_order: z.number().int(),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>

// ============================================================
// TESTIMONIAL FORM (admin)
// ============================================================
export const testimonialFormSchema = z.object({
  client_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  client_role: z.string().max(100, 'Role is too long'),
  company: z.string().max(100, 'Company name is too long'),
  quote: z
    .string()
    .min(20, 'Quote must be at least 20 characters')
    .max(1000, 'Quote is too long'),
  avatar_url: z.string().optional().or(z.literal('')),
  display_order: z.number().int(),
})

export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>

// ============================================================
// SITE SETTINGS FORM (admin)
// ============================================================
export const siteSettingsSchema = z.object({
  hero_headline: z.string().min(5, 'Headline is too short').max(120, 'Headline is too long'),
  hero_subheadline: z.string().min(10, 'Subheadline is too short').max(300, 'Subheadline is too long'),
  hero_available: z.boolean(),
  bio: z.string().min(50, 'Bio is too short').max(1000, 'Bio is too long'),
  stats_projects: z.number().int().min(0),
  stats_years: z.number().int().min(0),
  stats_technologies: z.number().int().min(0),
  stats_satisfaction: z.number().int().min(0).max(100),
})

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>

// ============================================================
// ADMIN LOGIN & REGISTER FORM
// ============================================================
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
