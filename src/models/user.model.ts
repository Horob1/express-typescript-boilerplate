import { Schema, model } from 'mongoose'
import withAuditTrailPlugin from '@/utils/withAuditTrailPlugin'
import { EGender } from '@/utils/enums'
import { IUser } from '@/types/user.interface'

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: Object.values(EGender), required: true },

    emailVerificationOtp: { type: String, default: null },
    emailVerificationOtpExpires: { type: Date, default: null },
    emailVerified: { type: Boolean, default: false },

    password: { type: String, required: true },

    passwordResetOtp: { type: String, default: null },
    passwordResetOtpExpires: { type: Date, default: null },

    // role: { type: String, required: true, default: 'user' },

    avatar: { type: String, default: '' }
  },
  {
    timestamps: true
  }
)

userSchema.plugin(withAuditTrailPlugin)

userSchema.index({ username: 1, email: 1 })

export default model<IUser>('Users', userSchema)
