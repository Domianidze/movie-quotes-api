import fs from 'fs'

import { getImagePath } from 'helpers'

export default async (image: string) => {
  const imagePath = getImagePath(image)

  if (fs.existsSync(imagePath)) {
    await fs.promises.unlink(imagePath)
  }
}
