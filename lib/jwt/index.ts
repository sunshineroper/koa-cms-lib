import jwtGenerator, { TokenExpiredError } from 'jsonwebtoken'
import type { RouterContext } from 'koa-router'
import { get } from 'lodash'
import { TokenType } from '../enums/common'
import { AuthFailed, TokenExpiredException } from '../exception/http-exception'
import { config } from '../config'
export class Token {
  secret: string | undefined
  accessExpire = 60 * 60 * 2
  refreshExpire = 60 * 60 * 24 * 30 * 3
  constructor(secret?, accessExpire?, refreshExpire?) {
    secret && (this.secret = secret)
    accessExpire && (this.accessExpire = accessExpire)
    refreshExpire && (this.refreshExpire = refreshExpire)
  }

  createAccessToken(identity: string | number) {
    if (!this.secret)
      throw new Error('secret can not be empty')
    const exp = +new Date() / 1000 + this.accessExpire
    return jwtGenerator.sign({
      identity,
      scope: 'koa-cms-lib',
      exp,
      type: TokenType.ACCESS,
    }, this.secret)
  }

  refreshToken(identity: string | number) {
    if (!this.secret)
      throw new Error('secret can not be empty')
    const exp = +new Date() / 1000 + this.accessExpire
    return jwtGenerator.sign({
      identity,
      scope: 'koa-cms-lib',
      exp,
      type: TokenType.REFRESH,
    }, this.secret)
  }

  verifyToken(token: string, type = TokenType.ACCESS) {
    if (!this.secret)
      throw new Error('secret can not be empty')
    let decode
    try {
      decode = jwtGenerator.verify(token, this.secret)
    }
    catch (error) {
      if (error instanceof TokenExpiredError) {
        if (type === TokenType.ACCESS)
          throw new TokenExpiredException(10041)
        else if (type === TokenType.REFRESH)
          throw new TokenExpiredException(10042)
      }
      else {
        if (type === TokenType.ACCESS)
          throw new AuthFailed(10051)
        else if (type === TokenType.REFRESH)
          throw new AuthFailed(10052)
      }
    }
    return decode
  }

  parseHeader(ctx: RouterContext, type = TokenType.ACCESS) {
    if (!ctx.header || !ctx.header.authorization)
      throw new AuthFailed({ code: 10000 })
    const parts = ctx.header.authorization.split(' ')
    if (parts.length === 2) {
      const scheme = parts[0]
      const token = parts[1]
      if (/^Bearer$/i.test(scheme)) {
        const decode = this.verifyToken(token)
        if (!get(decode, 'type') || !(get(decode, 'type') !== type))
          throw new AuthFailed({ code: 10250 })
        if (!get(decode, 'scope') || !(get(decode, 'scope') !== 'koa-cms-lib'))
          throw new AuthFailed({ code: 10251 })
        return decode
      }
    }
    else {
      throw new AuthFailed()
    }
  }
}

export const jwt = new Token(config.getItem('secret'), config.getItem('accessExpire'), config.getItem('refreshExpire'))
