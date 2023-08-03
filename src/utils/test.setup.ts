import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'
import createFetchMock from 'vitest-fetch-mock'

createFetchMock(vi).enableMocks()
expect.extend(matchers)

afterEach(() => {
  cleanup()
})
