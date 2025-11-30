import {
  afterEach,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from 'bun:test'
import { s3 } from 'bun'
import { handleRequest } from '../src/handler'

afterEach(() => {
  mock.restore()
  mock.clearAllMocks()
})

describe('handleRequest', () => {
  beforeEach(() => {
    spyOn(s3, 'presign').mockImplementation((key) => {
      return `https://s3-endpoint/${key}?mocked-presign`
    })
  })

  const foundReq = new Request(new URL('https://example.com/mocked-does-exist'))
  const notFoundReq = new Request(new URL('https://example.com/unknown'))

  test('redirects to the presigned key url', async () => {
    const res = await handleRequest(foundReq)
    expect(res.status).toBe(302)
    expect(res.headers.get('Location')).toBe(
      'https://s3-endpoint/mocked-does-exist?mocked-presign'
    )
  })

  describe('with nice not found handling', () => {
    beforeEach(() => {
      mock.module('../src/config', () => ({
        presignExpiresIn: () => 3600,
        useNiceNotFound: () => true,
      }))
      spyOn(s3, 'exists').mockImplementation((key) => {
        return Promise.resolve(key === 'mocked-does-exist')
      })
    })

    test('returns a 404 for unknown objects', async () => {
      const res = await handleRequest(notFoundReq)
      expect(res.status).toBe(404)
    })

    test('redirects for found objects', async () => {
      const res = await handleRequest(foundReq)
      expect(res.status).toBe(302)
    })
  })
})
