import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAdminUser extends Document {
  email: string
  passwordHash: string
  role: string
  createdAt: Date
  updatedAt: Date
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  {
    timestamps: true,
  }
)

export const AdminUserModel: Model<IAdminUser> =
  mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>('AdminUser', AdminUserSchema)
