'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Plus, X, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { projectFormSchema, type ProjectFormValues } from '@/lib/validations'
import { PROJECT_CATEGORIES, type Project } from '@/types'
import toast from 'react-hot-toast'

interface ProjectFormProps {
  initialData?: Project
  isEdit?: boolean
}

export function ProjectForm({ initialData, isEdit }: ProjectFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [techInput, setTechInput] = useState('')
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack || ['Next.js', 'TypeScript'])

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      short_description: initialData?.short_description || '',
      description: initialData?.description || '',
      cover_image_url: initialData?.cover_image_url || '',
      gallery_urls: initialData?.gallery_urls || [],
      tech_stack: initialData?.tech_stack || ['Next.js', 'TypeScript'],
      category: initialData?.category || 'AI',
      live_url: initialData?.live_url || '',
      github_url: initialData?.github_url || '',
      featured: initialData?.featured ?? false,
      display_order: initialData?.display_order ?? 0,
    },
  })

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form

  const generateSlug = () => {
    const title = watch('title')
    if (!title) return
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setValue('slug', slug, { shouldValidate: true })
  }

  const addTech = () => {
    const trimmed = techInput.trim()
    if (!trimmed || techStack.includes(trimmed)) return
    const updated = [...techStack, trimmed]
    setTechStack(updated)
    setValue('tech_stack', updated, { shouldValidate: true })
    setTechInput('')
  }

  const removeTech = (item: string) => {
    const updated = techStack.filter((t) => t !== item)
    setTechStack(updated)
    setValue('tech_stack', updated, { shouldValidate: true })
  }

  const onSubmit = async (values: ProjectFormValues) => {
    setSubmitting(true)
    try {
      const projectPayload = {
        title: values.title,
        slug: values.slug,
        short_description: values.short_description,
        description: values.description,
        cover_image_url: values.cover_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
        gallery_urls: values.gallery_urls,
        tech_stack: values.tech_stack,
        category: values.category,
        live_url: values.live_url || null,
        github_url: values.github_url || null,
        featured: values.featured,
        display_order: Number(values.display_order),
      }

      if (isEdit && initialData?.id) {
        const res = await fetch(`/api/projects/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectPayload),
        })
        if (!res.ok) throw new Error('Failed to update project')
        toast.success('Project updated successfully!')
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectPayload),
        })
        if (!res.ok) throw new Error('Failed to create project')
        toast.success('Project created successfully!')
      }

      router.push('/admin/projects')
      router.refresh()
    } catch (err: any) {
      console.error('Save error:', err)
      toast.error(err?.message || 'Failed to save project.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm" className="h-9 gap-2">
          <Link href="/admin/projects">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-heading">
            {isEdit ? 'Edit Project' : 'Create New Project'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEdit ? 'Update details for this showcase item' : 'Add a new project to your public portfolio'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card/40 border border-border/40 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Basic Details</h2>

              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Enterprise AI Support Agent"
                  {...register('title')}
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">Slug (URL path) *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-primary"
                    onClick={generateSlug}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Auto-generate
                  </Button>
                </div>
                <Input
                  id="slug"
                  placeholder="e.g. enterprise-ai-support-agent"
                  {...register('slug')}
                />
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  defaultValue={watch('category')}
                  onValueChange={(val) => setValue('category', val as any, { shouldValidate: true })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description (Summary card) *</Label>
                <Textarea
                  id="short_description"
                  rows={2}
                  placeholder="Brief 1-2 sentence pitch of what was built and the result achieved..."
                  {...register('short_description')}
                />
                {errors.short_description && (
                  <p className="text-xs text-destructive">{errors.short_description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description (Case Study / Overview) *</Label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="In-depth explanation of the challenge, architecture, solution, and business impact..."
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Links & Order */}
            <div className="bg-card/40 border border-border/40 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Links & Ordering</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="live_url">Live Demo URL (Optional)</Label>
                  <Input
                    id="live_url"
                    placeholder="https://app.clientproject.com"
                    {...register('live_url')}
                  />
                  {errors.live_url && <p className="text-xs text-destructive">{errors.live_url.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub Repository URL (Optional)</Label>
                  <Input
                    id="github_url"
                    placeholder="https://github.com/username/repo"
                    {...register('github_url')}
                  />
                  {errors.github_url && <p className="text-xs text-destructive">{errors.github_url.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    {...register('display_order', { valueAsNumber: true })}
                  />
                  <p className="text-[11px] text-muted-foreground">Lower numbers appear first on the site</p>
                </div>

                <div className="flex items-center space-x-3 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    checked={watch('featured')}
                    onChange={(e) => setValue('featured', e.target.checked)}
                  />
                  <Label htmlFor="featured" className="cursor-pointer text-sm font-medium">
                    Feature on Homepage highlight
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info (Media & Tech Stack) */}
          <div className="space-y-6">
            <div className="bg-card/40 border border-border/40 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Cover Media</h2>
              <ImageUploader
                label="Cover Image"
                value={watch('cover_image_url')}
                onChange={(url) => setValue('cover_image_url', url, { shouldValidate: true })}
              />
            </div>

            <div className="bg-card/40 border border-border/40 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Tech Stack</h2>
              
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. n8n, Supabase..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTech()
                    }
                  }}
                  className="text-sm"
                />
                <Button type="button" size="sm" onClick={addTech} className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs text-primary font-medium"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="hover:text-destructive transition-colors ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              {errors.tech_stack && (
                <p className="text-xs text-destructive">{errors.tech_stack.message}</p>
              )}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full shadow-lg shadow-primary/20"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEdit ? (
                  'Save Changes'
                ) : (
                  'Publish Project'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
