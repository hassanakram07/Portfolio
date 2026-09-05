'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUploader({ value, onChange, label = 'Image' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Upload failed')
      }

      onChange(json.url)
      toast.success('Image saved locally')
    } catch (err: any) {
      console.warn('Upload notice:', err?.message || err)
      toast.error('Could not upload image file. You can paste an image URL instead.')
      setMode('url')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return
    onChange(urlInput.trim())
    toast.success('Image URL applied')
  }

  const handleRemove = () => {
    onChange('')
    setUrlInput('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={mode === 'upload' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs px-2"
            onClick={() => setMode('upload')}
          >
            <Upload className="h-3 w-3 mr-1" />
            File
          </Button>
          <Button
            type="button"
            variant={mode === 'url' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs px-2"
            onClick={() => setMode('url')}
          >
            <LinkIcon className="h-3 w-3 mr-1" />
            URL
          </Button>
        </div>
      </div>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-border/60 bg-muted/30 aspect-video max-h-56 flex items-center justify-center">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="gap-1.5 shadow-lg"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : mode === 'upload' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center bg-card/20 hover:bg-muted/30"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Uploading image...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="https://images.unsplash.com/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="text-sm"
          />
          <Button type="button" size="sm" onClick={handleUrlSubmit} className="shrink-0">
            Apply
          </Button>
        </div>
      )}
    </div>
  )
}
