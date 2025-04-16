import { JwtPayload } from 'jsonwebtoken'

export interface IToken {
  _id: string
  email: string
}

export interface IATPayload extends JwtPayload, IToken {}

export interface IRTPayload extends JwtPayload, IToken {}
