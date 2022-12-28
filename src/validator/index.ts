import validator from 'validator'
import { get } from 'lodash'
import { getValidatorPropertykeys } from '../utils'
export class Validator {
  private data: Record<string, any>
  private errors: any[] = []
  constructor() {
  }

  public async validate(ctx?: any) {
    this.data = {
      query: ctx.request.query,
      body: (ctx.request as Record<string, any>).body,
      params: (ctx.request as Record<string, any>).params,
    }
    await this.checkRules()
  }

  private async checkRules() {
    const keys = getValidatorPropertykeys(this, (k) => {
      const val = this[k]
      if (Array.isArray(val)) {
        if (val.length === 0)
          return false
        for (const v of val) {
          if (v instanceof Rule)
            throw new Error('must be a instance Rule')
        }
      }
      else {
        return val instanceof Rule
      }
    })
    for (const key of keys) {
      const val = this[key]
      const [dataKey, dataValue] = this.findInDataValAndKey(key)
      const valid: boolean = await val.validate(this.data[dataKey][key])
      if (!valid)
        this.errors.push({ key, message: val.message })
    }
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
}

export class Rule {
  validateFunction: string | Function
  message: string
  constructor(validateFunction: string | Function, message?: string) {
    this.validateFunction = validateFunction
    this.message = message
  }

  async validate(value: any) {
    if (typeof this.validateFunction !== 'function')
      return await validator[this.validateFunction](value)
  }
}

export class TestValidator extends Validator {
  cc: Rule
  dd: string
  constructor() {
    super()
    this.cc = new Rule('isEmail', '邮箱格式错误,请重新输入')
    this.dd = '2'
  }
}
