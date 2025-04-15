/**
 * Mongoose plugin for adding audit trail fields to a schema
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, Document, Types } from 'mongoose'

export interface AuditTrailDocument extends Document {
  // Soft Delete
  deleted: boolean
  deletedAt: Date | null
  deletedBy?: Types.ObjectId | null
  // eslint-disable-next-line no-unused-vars
  softDelete: (options?: { context?: { userId?: Types.ObjectId } }) => Promise<void>
  restore: () => Promise<void>

  // BlameBy
  createdBy: Types.ObjectId
  updatedBy?: Types.ObjectId
}

export default function withAuditTrailPlugin<T extends Document>(schema: Schema<T>) {
  // --- Add fields ---
  schema.add({
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Types.ObjectId, ref: 'User', default: null },

    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', default: null }
  } as any)

  // --- Default exclude deleted docs ---
  schema.pre(/^find/, function (this: any, next) {
    if (!this.options?.includeDeleted) {
      this.where({ deleted: false })
    }
    next()
  })

  // --- Soft delete method ---
  schema.methods.softDelete = async function (options?: { context?: { userId?: Types.ObjectId } }) {
    this.deleted = true
    this.deletedAt = new Date()
    if (options?.context?.userId) {
      this.deletedBy = options.context.userId
    }
    await this.save()
  }

  // --- Restore method ---
  schema.methods.restore = async function () {
    this.deleted = false
    this.deletedAt = null
    this.deletedBy = null
    await this.save()
  }

  // --- CreatedBy / UpdatedBy logic on save ---
  schema.pre('save', function (this: any, next) {
    const userId = this.$__.saveOptions?.context?.userId

    if (this.isNew && userId) {
      this.createdBy = userId
    } else if (userId) {
      this.updatedBy = userId
    }

    next()
  })

  // --- UpdatedBy logic on update ---
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const handleUpdate = function (this: any, next: Function) {
    const userId = this.options?.context?.userId
    if (userId) {
      this.set({ updatedBy: userId })
    }
    next()
  }
  schema.pre('updateOne', handleUpdate)
  schema.pre('findOneAndUpdate', handleUpdate)
  schema.pre('updateMany', handleUpdate)

  // --- Indexes ---
  schema.index({ deleted: 1 })
  schema.index({ deletedBy: 1 })
  schema.index({ createdBy: 1 })
  schema.index({ updatedBy: 1 })
}
