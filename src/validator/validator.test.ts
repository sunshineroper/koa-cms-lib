import { Rule, Validator } from './index'
describe('测试Validator', () => {
  test('测试isOptional函数', async () => {
    class TestValidator extends Validator {
      email: Rule
      id: Rule
      dd: string
      age: Rule[]
      constructor() {
        super()
        this.email = new Rule('isEmail', '邮箱格式错误,请重新输入')
        this.id = new Rule('isInt')
        this.dd = '2'
        this.age = [new Rule('isOption'), new Rule('isInt', '年纪必须是数字类型')]
      }
    }
    const ctx = {
      request: {
        query: {
          cc: '333',
          email: 'sunshineroper@gmail.com',
        },
        body: {},
        params: {},
      },
    }
    const message = await new TestValidator().validate(ctx)
    expect(message).toEqual([
      { key: 'id', message: 'id不能为空' },
      { key: 'age', message: '年纪必须是数字类型' },
    ])
  })
  test('多条规则校验', async () => {
    class TestValidator extends Validator {
      email: Rule
      id: Rule
      password: Rule[]
      // age: Rule[]
      name: Rule[]
      constructor() {
        super()
        this.name = [new Rule('isLength', '昵称长度最小1最长10', { min: 1, max: 8 })]
        this.email = new Rule('isEmail', '邮箱格式错误,请重新输入')
        this.id = new Rule('isInt')
        this.password = [
          // new Rule('isLength', '密码长度需在6-22位之间', { min: 6, max: 22 }),
          new Rule(
            'matches',
            '密码长度必须在6~22位之间，包含字符、数字和 _ ',
            /^[A-Za-z0-9_*&$#@]{6,22}$/,
          )]
        // this.age = [new Rule('isOption'), new Rule('isInt', '年纪必须是数字类型')]
      }
    }
    const ctx = {
      request: {
        query: {
          age: 13,
          name: 'ssssssss',
          email: 'sunshineroper@gmail.com',
          password: 'ssssccc222___',
        },
        body: {},
        params: {},
      },
    }
    const message = await new TestValidator().validate(ctx)
    expect(message).toEqual([{ key: 'id', message: 'id不能为空' }])
  })
})
