import path from 'path'
import fs from 'fs'
import { Transport } from 'egg-logger'
import dayjs from 'dayjs'
export class FileTransport extends Transport {
  /**
   * @class
   * @param {Object} options
   * - {String} file - file path
   * - {String} [level = INFO] - log level
   */
  _stream: any
  options: any
  constructor(options) {
    super(options)
    this._stream = null
    this.reload()
  }

  // get defaults() {
  //   return utils.assign(super.defaults, {
  //     file: null,
  //     level: 'INFO',
  //   })
  // }

  /**
   * reload file stream
   */
  reload() {
    this._closeStream()
    this._stream = this._createStream()
  }

  /**
   * output log, see {@link Transport#log}
   * @param  {String} level - log level
   * @param  {Array} args - all arguments
   * @param  {Object} meta - meta information
   */
  log(level, args, meta) {
    const baseDir = this.getParentDir()
    const filename = this.getFileName()
    if (fs.existsSync(baseDir)) {
      const isOutManySize = this.checkFileSize(filename)
      if (isOutManySize) {
        this.renameFile(filename)
        this.reload()
      }
      else if (!fs.existsSync(filename)) {
        this.reload()
      }
    }
    else {
      this.reload()
    }
    const buf = super.log(level, args, meta)
    if ((buf as unknown as Record<string, any>).length)
      this._write(buf)
  }

  /**
   * close stream
   */
  close() {
    this._closeStream()
  }

  /**
   * @deprecated
   */
  end() {
    // depd('transport.end() is deprecated, use transport.close()')
    this.close()
  }

  /**
   * write stream directly
   * @param {Buffer|String} buf - log content
   * @private
   */
  _write(buf) {
    this._stream.write(buf)
  }

  /**
   * transport is writable
   * @return {Boolean} writable
   */
  get writable() {
    return this._stream && !this._stream.closed && this._stream.writable && !this._stream.destroyed
  }

  /**
   * create stream
   * @return {Stream} return writeStream
   * @private
   */
  _createStream() {
    const filename = this.getFileName()
    if (!fs.existsSync(filename))
      this.mkdir(path.dirname(filename))

    // mkdirSync(path.dirname(this.options.file), { recursive: true })

    const onError = (err) => {
      console.error(
        '%s ERROR %s [logger] [%s] %s',
        dayjs('YYYY-MM-DD hh:mm:ss'),
        process.pid,
        filename,
        err.stack,
      )
    }
    const stream: any = fs.createWriteStream(filename, { flags: 'a+' })
    // stream._onError = ''
    // only listen error once because stream will reload after error
    stream.once('error', onError)
    // stream ._onError = onError
    stream._onError = onError
    return stream
  }

  getFileName() {
    const baseDir = path.join(process.cwd(), this.options.dir)
    const dirName = path.join(baseDir, dayjs().format('YYYY-MM-DD'))
    const filename = path.join(dirName, `${dayjs().format('YYYY-MM-DD')}.log`)
    return filename
  }

  checkFileSize(filename) {
    const file = fs.existsSync(filename) && fs.statSync(filename)
    return file && (file.size > this.options.size)
  }

  renameFile(filename) {
    const oldDirname = path.dirname(filename)
    const oldFilename = path.join(oldDirname, `${dayjs().format('YYYY-MM-DD HH:mm:ss')}.log`)
    fs.renameSync(filename, oldFilename)
  }

  getParentDir() {
    const baseDir = path.join(process.cwd(), this.options.dir)
    return baseDir
  }

  mkdir(dirName) {
    if (fs.existsSync(dirName)) {
      return true
    }
    else {
      if (this.mkdir(path.dirname(dirName))) {
        fs.mkdirSync(dirName)
        return true
      }
    }
  }

  /**
   * close stream
   * @private
   */
  _closeStream() {
    if (this._stream) {
      this._stream.end()
      this._stream.removeListener('error', this._stream._onError)
      this._stream = null
    }
  }
}
