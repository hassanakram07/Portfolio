import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISiteSetting extends Document {
  key: string
  value: any
  createdAt: Date
  updatedAt: Date
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
)

export const SiteSettingModel: Model<ISiteSetting> =
  mongoose.models.SiteSetting ||
  mongoose.model<ISiteSetting>('SiteSetting', SiteSettingSchema)
