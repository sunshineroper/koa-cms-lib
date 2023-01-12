import { readFile } from '../util'
describe('util测试', () => {
  it('获取目录下的所有文件', () => {
    const files = readFile(`${process.cwd()}/` + 'api')
    expect(files).toEqual([
      '/Users/sunshine/i/koa-cms-lib/src/utils/__test__/api/app.js',
      '/Users/sunshine/i/koa-cms-lib/src/utils/__test__/api/user/user.js',
    ])
  })
})
