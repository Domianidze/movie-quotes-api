import { Request } from 'express'
import fs from 'fs'
import multer, { FileFilterCallback } from 'multer'

const storage = multer.diskStorage({
  destination: async (_, __, cb) => {
    const path = 'storage/img'

    if (!fs.existsSync(path)) {
      await fs.promises.mkdir(path, { recursive: true })
    }

    cb(null, path)
  },
  filename: (_, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`)
  },
})

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'images/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, true)
  }
}

export default multer({ storage, fileFilter }).single('image')
