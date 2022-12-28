import { TestValidator } from './index'
describe('测试test', () => {
  test('正常', () => {
    const key = 3
    const ctx = {
      request: {
        query: {
          cc: '333',
        },
        body: {},
        params: {},
      },
    }
    expect(key).toBe(3)
    new TestValidator().validate(ctx)
  })
})
