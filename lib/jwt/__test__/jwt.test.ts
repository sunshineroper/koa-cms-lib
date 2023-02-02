import { Token, jwt } from '../index'

describe('jwt方法测试', () => {
  it('生成accessToken和refreshToken', () => {
    const accessToken = jwt.createAccessToken('abcdefghijksmop213@')
    expect(accessToken).not.toBeNull()
    const refreshToken = jwt.refreshToken('abcdefghijksmop213@')
    expect(refreshToken).not.toBeNull()
  })
  it('token校验 token时间过期', () => {
    const t = new Token('abcdefghijksmop213@', 0.1, 0.1)
    const accessToken = t.createAccessToken('abcdefghijksmop213@')
    setTimeout(() => {
      const decode = jwt.verifyToken(accessToken)
    }, 2000)
    // console.log(decode)
  })
})
