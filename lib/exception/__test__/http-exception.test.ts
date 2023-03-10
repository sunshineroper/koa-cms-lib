import { NotFound } from '../http-exception'
import { config } from '../../config'
import { codeMessage } from './code'
config.setItem('codeMessage', codeMessage)

describe('测试HttpException函数', () => {
  test('不传参数', async () => {
    const notFound = new NotFound()
    expect(notFound.stauts).toBe(404)
    expect(notFound.code).toBe(10070)
    expect(notFound.message).toBe('禁止操作')
  })
  test('只传message', () => {
    const notFound = new NotFound({ message: '找不到资源' })
    expect(notFound.stauts).toBe(404)
    expect(notFound.code).toBe(10070)
    expect(notFound.message).toBe('找不到资源')
  })
})
