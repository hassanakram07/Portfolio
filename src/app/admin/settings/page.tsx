'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, Loader2, Sparkles, Sliders } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { siteSettingsSchema, type SiteSettingsFormValues } from '@/lib/validations'
import toast from 'react-hot-toast'

const DEFAULT_SETTINGS: SiteSettingsFormValues = {
  hero_headline: 'I Build AI Systems That Work While You Sleep',
  hero_subheadline:
    'Specializing in AI/ML solutions, workflow automation, CRM integrations, and full-stack applications that give your business an unfair advantage.',
  hero_available: true,
  bio: "I'm Hassan Akram, a full-stack developer with 5+ years of experience engineering high-impact software solutions. I specialize in bridging advanced machine learning models with battle-tested automation infrastructure to build resilient business engines.",
  stats_projects: 40,
  stats_years: 5,
  stats_technologies: 15,
  stats_satisfaction: 99,
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: DEFAULT_SETTINGS,
  })

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = form

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const { hero, about } = await res.json()
          reset({
            hero_headline: hero?.headline || DEFAULT_SETTINGS.hero_headline,
            hero_subheadline: hero?.subheadline || DEFAULT_SETTINGS.hero_subheadline,
            hero_available: hero?.available ?? DEFAULT_SETTINGS.hero_available,
            bio: about?.bio || DEFAULT_SETTINGS.bio,
            stats_projects: about?.stats?.projects ?? DEFAULT_SETTINGS.stats_projects,
            stats_years: about?.stats?.years ?? DEFAULT_SETTINGS.stats_years,
            stats_technologies: about?.stats?.technologies ?? DEFAULT_SETTINGS.stats_technologies,
            stats_satisfaction: about?.stats?.satisfaction ?? DEFAULT_SETTINGS.stats_satisfaction,
          })
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [reset])

  const onSubmit = async (values: SiteSettingsFormValues) => {
    setSaving(true)
    try {
      const hero = {
        headline: values.hero_headline,
        subheadline: values.hero_subheadline,
        available: values.hero_available,
      }

      const about = {
        bio: values.bio,
        stats: {
          projects: values.stats_projects,
          years: values.stats_years,
          technologies: values.stats_technologies,
          satisfaction: values.stats_satisfaction,
        },
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero, about }),
      })

      if (!res.ok) throw new Error()

      toast.success('Site settings updated successfully!')
    } catch {
      toast.error('Failed to update site settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Update the copy, availability status, and social counters on your live site without redeploying.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hero Section Copy */}
        <div className="bg-card/40 border border-border/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-heading font-semibold text-base">Hero Section</h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_headline">Main Headline</Label>
            <Input id="hero_headline" {...register('hero_headline')} />
            {errors.hero_headline && (
              <p className="text-xs text-destructive">{errors.hero_headline.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subheadline">Subheadline</Label>
            <Textarea id="hero_subheadline" rows={3} {...register('hero_subheadline')} />
            {errors.hero_subheadline && (
              <p className="text-xs text-destructive">{errors.hero_subheadline.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="hero_available"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              checked={watch('hero_available')}
              onChange={(e) => setValue('hero_available', e.target.checked)}
            />
            <Label htmlFor="hero_available" className="cursor-pointer text-sm font-medium">
              &quot;Available for new projects&quot; badge indicator
            </Label>
          </div>
        </div>

        {/* About & Bio */}
        <div className="bg-card/40 border border-border/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            <h2 className="font-heading font-semibold text-base">About Section & Stats</h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biography / Summary</Label>
            <Textarea id="bio" rows={4} {...register('bio')} />
            {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="stats_projects">Projects Built</Label>
              <Input
                id="stats_projects"
                type="number"
                {...register('stats_projects', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stats_years">Years Exp.</Label>
              <Input
                id="stats_years"
                type="number"
                {...register('stats_years', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stats_technologies">Tech Stack Count</Label>
              <Input
                id="stats_technologies"
                type="number"
                {...register('stats_technologies', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stats_satisfaction">Satisfaction %</Label>
              <Input
                id="stats_satisfaction"
                type="number"
                {...register('stats_satisfaction', { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2 shadow-lg shadow-primary/20" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving Settings...' : 'Save Site Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
