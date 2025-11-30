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
import { checkObjectExists, generatePresignedUrl } from '../src/s3'

afterEach(() => {
  mock.restore()
  mock.clearAllMocks()
})

describe('checkObjectExists', () => {
  beforeEach(() => {
    spyOn(s3, 'exists').mockImplementation((key) => {
      return Promise.resolve(key === 'mocked-does-exist')
    })
  })

  test('returns true for existing objects', () => {
    expect(checkObjectExists('mocked-does-exist')).resolves.toBe(true)
  })

  test('returns false for unknown objects', () => {
    expect(checkObjectExists('unknown')).resolves.toBe(false)
  })
})

describe('generatePresignedUrl', () => {
  beforeEach(() => {
    spyOn(s3, 'presign').mockImplementation((key) => {
      return `${key}?mocked-presign`
    })
  })

  test('returns a presigned url', () => {
    expect(generatePresignedUrl('foo')).resolves.toBe('foo?mocked-presign')
  })
})
