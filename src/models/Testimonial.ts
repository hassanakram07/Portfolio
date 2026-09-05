import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITestimonial extends Document {
  client_name: string
  client_role: string
  company: string
  quote: string
  avatar_url: string | null
  display_order: number
  createdAt: Date
  updatedAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    client_name: { type: String, required: true, trim: true },
    client_role: { type: String, default: '', trim: true },
    company: { type: String, default: '', trim: true },
    quote: { type: String, required: true },
    avatar_url: { type: String, default: null },
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

export const TestimonialModel: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)
