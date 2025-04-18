import fs from 'fs'
/**
 * Check folder exist
 * @param folderPath implements string[]
 * @returns void
 */
const checkFolderExist = (folderPath: string[]) => {
  folderPath.map(DIR => {
    if (!fs.existsSync(DIR))
      fs.mkdirSync(DIR, {
        recursive: true,
      })
  })
}

export default checkFolderExist
