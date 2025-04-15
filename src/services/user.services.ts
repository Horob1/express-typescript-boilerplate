/* eslint-disable @typescript-eslint/no-explicit-any */
import { userModels } from '@/models/user.models'
import bcryptjs from 'bcryptjs'

const register = async (reqBody: any) => {
  try {
    // Kiểm tra email đã tồn tại trong hệ thống chưa
    const existUser = await userModels.findOneByEmail(reqBody.email) // User.findOne(email)
    if (existUser) {
      throw new Error('Email already exist!')
    }
    // Tạo data để lưu vào database
    // nếu email là 'trinhminhnhatym@gmail.com' thì lấy được nameFromEmail là 'trinhminhnhatym'
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // băm password ra không lưu kiểu plaintext, 8 là độ phức tạp, độ phức tạp càng cao băm càng lâu
      username: nameFromEmail,
      displayName: nameFromEmail
    }

    // Lưu thông tin User vào Database
    const createdUser = await userModels.register(newUser)
    // Nếu lưu thành công thì trả về thông tin người dùng vừa tạo
    const getNewUser = await userModels.findOneById(createdUser.insertedId)

    return getNewUser
  } catch (error) {
    throw error
  }
}

export const userServices = {
  register
}
