import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../config'
const baseDir = config.getItem('multipart.baseDir', process.cwd())
const mkdir = (dir = '') => {
  // eslint-disable-next-line max-statements-per-line
  if (fs.existsSync(dir)) { return true }
  else {
    if (mkdir(path.dirname(dir))) {
      fs.mkdirSync(dir)
      return true
    }
  }
}
export class Uploader {
  storePath(filename: string) {
    const filename1 = this.generateName(filename)
    const folderFormatData = this.formatData()
    const storeDir = this.getStoreDir(folderFormatData)
    const exists = fs.existsSync(storeDir)
    if (!exists)
      mkdir(storeDir)
    return {
      absolutePath: path.join(storeDir, filename1),
      relativePath: `${folderFormatData}/${filename1}`,
      filename,
    }
  }

  generateName(filename) {
    const ext = path.extname(filename)
    return `${uuidv4()}${ext}`
  }

  generateMd5(data) {
    const md5 = crypto.createHash('md5')
    return md5.update(data).digest('hex')
  }

  formatData() {
    return dayjs().format('YYYY/MM/DD')
  }

  getStoreDir(folderFormatData) {
    const storeDir = config.getItem('multipart.storeDir', 'upload')
    const dirPath = path.isAbsolute(storeDir) ? path.join(storeDir, folderFormatData) : path.join(baseDir, storeDir, folderFormatData)
    return dirPath
  }
}
