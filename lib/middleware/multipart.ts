import busboy from 'async-busboy'
import type Application from 'koa'
import { FileLargeException } from '../exception'
import { config } from '../config'
import type { CodeMessage } from '../types'
const codeMessage = config.getItem('codeMessage') as CodeMessage
const body = async (req, options) => {
  await busboy(req, {
    onFile: options.onFile,
  })
}
export const multipart = async (app: Application) => {
  app.context.multipart = async function () {
    const filePromises: any = []
    await body(this.req, {
      onFile: (fieldname, file, filename, encoding, mimetype) => {
        const buffers: any = []
        const filePromise = new Promise((resolve) => {
          // file.on('error', (error) => {
          //   file
          //     .resume()
          //   reject(error)
          // })
          file.on('data', (data) => {
            buffers.push(data)
          }).on('end', () => {
            const buf = Buffer.concat(buffers)
            resolve({
              size: buf.length,
              encoding,
              fieldname,
              filename,
              mimetype,
              data: buf,
            })
          })
        })
        filePromises.push(filePromise)
      },
    })
    let totalSize = 0
    const files: Record<string, any> = []
    for (const filePromise of filePromises) {
      const file = await filePromise
      // 校验下文件大小
      const maxFileSize = config.getItem('multipart.maxFileSize', 1024 * 1024 * 2)
      if (file.size > maxFileSize)
        throw new FileLargeException(codeMessage.getMessage(10110).replace('{name}', file.filename).replace('{size}', file.size))
      totalSize += file.size
      files.push(file)
    }
    // 校验总的文件大小
    const maxTotalFileSize = config.getItem('multipart.maxFileSize', 1024 * 1024 * 5)
    if (maxTotalFileSize < totalSize)
      throw new FileLargeException(codeMessage.getMessage(10111).replace('{size}', `${totalSize}`))
    // TODO 校验文件格式
    return files
  }
}
