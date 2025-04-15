/**
 * Multer config
 * This file is used to configure multer storage and filter if u want to use server side upload file in your server
 */

import CONSTANT from '@/utils/constants'
import path from 'path'
import checkUploadsFolderExist from '@/utils/checkFolderExist'
import multer from 'multer'
import HttpError from '@/utils/httpError'
import { StatusCodes } from 'http-status-codes'
import MESSAGE from '@/utils/messages'

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = CONSTANT.FOLDER.UPLOAD_IMAGES_DIR
    checkUploadsFolderExist([folder])
    cb(null, folder)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `img-${Date.now()}${ext}`)
  }
})

const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) cb(null, true)
  else cb(new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, MESSAGE.MULTER.INVALID_FILE_TYPE))
}

export default {
  image: multer({
    storage: imageStorage,
    fileFilter: imageFilter,
    limits: {
      fileSize: CONSTANT.MULTER.IMAGE_SIZE_LIMIT
    }
  })
}
