import { renderHook, waitFor } from '@testing-library/react'
import { PHOTO_ERROR_FALLBACK_URL, useDogPhotos } from './useDogPhotos'
import { vi } from 'vitest'
import { createWrapper } from '../utils/test.utils'

const MOCK_IMAGES_COUNT = 9
const MOCK_TIMEOUT = 100
const MOCK_API_PATH = 'mock/photos'

describe('useDogPhotos - hook', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should aggregate the result of all queries into a list', async () => {
    // Arrange
    const MOCK_RESPONSE = Array.from(
      { length: 9 },
      (_, i): [string, { status: number }] => [
        JSON.stringify({
          message: `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/${
            i + 1
          }`,
          status: 'success',
        }),
        { status: 200 },
      ],
    )
    fetchMock.mockResponses(...MOCK_RESPONSE)

    // Act
    const { result } = renderHook(
      () =>
        useDogPhotos({ photoPath: MOCK_API_PATH, queryTimeout: MOCK_TIMEOUT }),
      {
        wrapper: createWrapper(),
      },
    )

    // Assert
    await waitFor(async () => {
      await vi.advanceTimersByTimeAsync(MOCK_IMAGES_COUNT * MOCK_TIMEOUT)
      expect(fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}`,
      )
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toEqual([
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/7`,
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/8`,
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/9`,
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/4`,
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/5`,
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/6`,
      ])
    })
  })

  it('should add fallback images into the result of all queries', async () => {
    // Arrange
    const MOCK_SUCCESS_RESPONSE = Array.from(
      { length: 8 },
      (_, i): [string, { status: number }] => [
        JSON.stringify({
          message: `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/${
            i + 1
          }`,
          status: 'success',
        }),
        { status: 200 },
      ],
    )

    fetchMock.mockResponses(...MOCK_SUCCESS_RESPONSE)
    fetchMock.mockReject(() => Promise.reject('bad url'))

    // Act
    const { result } = renderHook(
      () =>
        useDogPhotos({ photoPath: MOCK_API_PATH, queryTimeout: MOCK_TIMEOUT }),
      {
        wrapper: createWrapper(),
      },
    )

    // Assert
    await waitFor(async () => {
      await vi.advanceTimersByTimeAsync(MOCK_IMAGES_COUNT * MOCK_TIMEOUT)
      expect(fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}`,
      )
      expect(result.current.isSuccess).toBe(false)
      expect(result.current.data).toEqual([
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/7`,
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/8`,
        PHOTO_ERROR_FALLBACK_URL,
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/4`,
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/5`,
        `${import.meta.env.VITE_API_BASE_URL}/${MOCK_API_PATH}/6`,
      ])
    })
  })
})
