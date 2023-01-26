import validator from 'validator'
import { cloneDeep, get, unset } from 'lodash'
import { getValidatorPropertykeys, isString } from '../utils'
import { ParamtersException } from '../exception/http-exception'
export class Validator {
  private data: Record<string, any>
  private errors: any[] = []
  private parsed: Record<string, any>
  constructor() {
    this.data = {}
    this.parsed = {}
  }

  public async validate(ctx: any, alias: Record<string, any> = {}) {
    this.data = {
      query: ctx.request.query,
      body: (ctx.request as Record<string, any>).body,
      params: (ctx.request as Record<string, any>).params,
      header: (ctx.request as Record<string, any>).header,

    }
    this.parsed = {
      ...cloneDeep(this.data),
      default: {},
    }
    let obj = {}
    if (!await this.checkRules(alias)) {
      if (this.errors.length === 1) {
        obj = this.errors[0].message
      }
      else {
        for (const error of this.errors)
          obj[error.key] = error.message
      }
      throw new ParamtersException({ message: obj })
    }
    else {
      return this
    }
  }

  private async checkRules(alias) {
    let keys = getValidatorPropertykeys(this, (k) => {
      const val = this[k]
      if (Array.isArray(val)) {
        if (val.length === 0)
          return false
        for (const v of val) {
          if (!(v instanceof Rule))
            throw new Error('must be a instance Rule')
        }
        return true
      }
      else {
        return val instanceof Rule
      }
    })
    keys = this.replace(keys, alias)
    for (const key of keys) {
      let optional = false
      let message
      let stopFlag = false
      const val = this[key]
      const [dataKey, dataValue] = this.findInDataValAndKey(key)
      if (this.isOptional(dataValue)) {
        if (Array.isArray(val)) {
          for (const v of val) {
            if (v.isOptional)
              optional = true
            else
            if (!message)
              message = v.message
          }
        }
        else {
          if (val.isOptional)
            optional = true
          else
            message = val.message
        }
        if (!optional)
          this.errors.push({ key, message: message || `${key}不能为空` })
        else
          this.parsed.default[key] = val.parsedValue
      }
      else {
        if (Array.isArray(val)) {
          for (const v of val) {
            if (!stopFlag && !v.isOptional) {
              const valid: boolean = await v.validate(this.data[dataKey][key])
              if (!valid) {
                stopFlag = true
                this.errors.push({ key, message: v.message })
              }
              // eslint-disable-next-line no-void
              if ((val as Record<string, any>).parsedValue !== void 0)
                this.parsed[dataKey][key] = (val as Record<string, any>).parsedValue
            }
          }
        }
        else {
          if (!val.isOptional) {
            const valid: boolean = await val.validate(this.data[dataKey][key])
            if (!valid)
              this.errors.push({ key, message: val.message })
            else
              this.parsed[dataKey][key] = (val as Record<string, any>).parsedValue
          }
        }
      }
    }
    return this.errors.length === 0
  }

  private findInDataValAndKey(key) {
    const keys = Object.keys(this.data)
    for (const k of keys) {
      const val = get(this.data[k], key)
      // eslint-disable-next-line no-void
      if (val !== void 0)
        return [k, val]
    }
    return []
  }

  private replace(keys, alias) {
    const aliasK = Object.keys(alias)
    if (aliasK.length === 0)
      return keys
    const arr: string[] = []
    for (const k of keys) {
      if (alias[k]) {
        this[alias[k]] = this[k]
        unset(this, k)
        arr.push(alias[k])
      }
    }
    return arr
  }

  private isOptional(val) {
    // eslint-disable-next-line no-void
    if (val === void 0)
      return true
    if (val === null)
      return true
    if (isString(val))
      return val === '' || val.trim() === ''
    return false
  }

  get(path, parsed = true) {
    let defaultValue
    if (arguments.length >= 3)
      // eslint-disable-next-line prefer-rest-params
      defaultValue = arguments[2]
    if (parsed) {
      const key = get(this.parsed, path, defaultValue)
      if (!this.isOptional(key))
        return key
    }
    else {
      return get(this.data, path, defaultValue && defaultValue)
    }
  }
}

export class Rule {
  validateFunction
  message
  isOptional = false
  options: any
  parsedValue: any
  constructor(validateFunction: string | Function, message?: string, ...options) {
    if (isString(validateFunction)) {
      if (validateFunction === 'isOptional')
        this.isOptional = true
      this.validateFunction = validateFunction
    }
    this.options = options
    if (message)
      this.message = message
  }

  async validate(value: any) {
    if (typeof this.validateFunction === 'function') {
      return this.validateFunction(value, ...this.options)
    }
    else {
      switch (this.validateFunction) {
        case 'isInt':
          if (isString(value)) {
            this.parsedValue = validator.toInt(value)
            return validator.isInt(value, ...this.options)
          }
          break
        default:
          return await validator[this.validateFunction](value, ...this.options)
      }
    }
  }
}
