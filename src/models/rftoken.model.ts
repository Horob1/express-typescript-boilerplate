import { Schema, model } from 'mongoose'
import { IRFToken } from '@/types/rftoken.interface'

const rfTokenSchema = new Schema<IRFToken>(
  {
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    ip: { type: String, required: true },
    os: { type: String, required: true },
    browser: { type: String, required: true },
    device: { type: String, required: true },
    userAgent: { type: String, required: true },
    iat: { type: Date, required: true },
    exp: { type: Date, required: true }
  },
  {
    timestamps: true
  }
)

rfTokenSchema.index({ token: 1, userId: 1 })

export default model<IRFToken>('RFTokens', rfTokenSchema)
