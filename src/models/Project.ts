import mongoose, { Schema, Document, Model } from 'mongoose'
import type { ProjectCategory } from '@/types'

export interface IProject extends Document {
  title: string
  slug: string
  short_description: string
  description: string
  cover_image_url: string
  gallery_urls: string[]
  tech_stack: string[]
  category: ProjectCategory
  live_url: string | null
  github_url: string | null
  featured: boolean
  display_order: number
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    short_description: { type: String, required: true },
    description: { type: String, required: true },
    cover_image_url: { type: String, default: '' },
    gallery_urls: { type: [String], default: [] },
    tech_stack: { type: [String], default: [] },
    category: {
      type: String,
      enum: ['AI', 'Automation', 'CRM', 'Web App', 'Other'],
      default: 'Other',
    },
    live_url: { type: String, default: null },
    github_url: { type: String, default: null },
    featured: { type: Boolean, default: false },
    display_order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

export const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
