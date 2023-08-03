import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createWrapper } from './utils/test.utils'
import { App } from './App'
import * as hookModule from './hooks/useDogPhotos'

vi.mock('./utils/useDogPhotos')

const MOCK_PHOTOS = [
  'https://dog.ceo/api/mock/photos/7',
  'https://dog.ceo/api/mock/photos/8',
  'https://dog.ceo/api/mock/photos/9',
  'https://dog.ceo/api/mock/photos/4',
  'https://dog.ceo/api/mock/photos/5',
  'https://dog.ceo/api/mock/photos/6',
]

const createQuerySpy = ({
  queryStatus,
  queryData = [],
}: {
  queryStatus: 'loading' | 'success' | 'error'
  queryData?: string[]
}) => {
  vi.spyOn(hookModule, 'useDogPhotos').mockImplementation(
    () =>
      ({
        status: queryStatus,
        data: queryData,
        refetch: () => Promise.resolve(),
      } as any),
  )
}

describe('App - component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should display the loading view', async () => {
    // Arrange
    createQuerySpy({ queryStatus: 'loading' })

    // Act
    render(<App />, { wrapper: createWrapper() })

    // Assert
    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText(/Loading dog photos app.../i)).toBeVisible()
  })

  it('should display the error message', () => {
    // Arrange
    createQuerySpy({ queryStatus: 'error' })

    // Act
    render(<App />, { wrapper: createWrapper() })

    // Assert
    expect(screen.getByTestId('error')).toBeInTheDocument()
    expect(screen.getByText(/Unexpected error occurred./i)).toBeVisible()
  })

  it('should allow to ', () => {
    // Arrange
    createQuerySpy({ queryStatus: 'error' })

    // Act
    const { rerender } = render(<App />, { wrapper: createWrapper() })

    // Assert
    expect(screen.getByTestId('error')).toBeInTheDocument()
    expect(screen.getByText(/Unexpected error occurred./i)).toBeVisible()

    screen.getByTestId('refetch').click()
    createQuerySpy({ queryStatus: 'success' })

    rerender(<App />)

    expect(screen.getByTestId('success')).toBeInTheDocument()
  })

  it('should display dog photos', () => {
    // Arrange
    createQuerySpy({ queryStatus: 'success', queryData: MOCK_PHOTOS })

    // Act
    render(<App />, { wrapper: createWrapper() })
    const dogImages = screen.getAllByRole('img')

    // Assert
    expect(screen.getByTestId('success')).toBeInTheDocument()
    expect(dogImages.length).toBe(MOCK_PHOTOS.length)
    dogImages.forEach((imgElement, i) => {
      expect(imgElement).toHaveAttribute('src', MOCK_PHOTOS[i])
    })
  })
})
