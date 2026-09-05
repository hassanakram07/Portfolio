'use client'

import { useEffect, useState, use } from 'react'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { Loader2 } from 'lucide-react'
import type { Project } from '@/types'

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${resolvedParams.id}`)
        if (res.ok) {
          const data = await res.json()
          setProject(data)
        }
      } catch (err) {
        console.error('Failed to load project:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <ProjectForm initialData={project || undefined} isEdit />
}
