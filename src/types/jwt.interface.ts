import { JwtPayload } from 'jsonwebtoken'

interface IToken {
  _id: string
  email: string
}

interface IATPayload extends JwtPayload, IToken {}

interface IRTPayload extends JwtPayload, IToken {}

export { IATPayload, IRTPayload, IToken }
