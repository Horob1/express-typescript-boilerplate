import { Document, Types } from 'mongoose'
/**
 * @swagger
 * components:
 *   schemas:
 *     RFTokens:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         userId:
 *           type: string
 *         ip:
 *           type: string
 *         os:
 *           type: string
 *         browser:
 *           type: string
 *         device:
 *           type: string
 *         userAgent:
 *           type: string
 *         iat:
 *           type: string
 *         exp:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */
export interface IRFToken extends Document {
  token: string
  userId: Types.ObjectId
  ip: string
  os: string
  browser: string
  device: string
  userAgent: string
  iat: Date
  exp: Date
  createdAt: Date
  updatedAt: Date
}
