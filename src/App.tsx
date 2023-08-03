import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from '@tanstack/react-query'
import './App.css'
import { useDogPhotos } from './hooks/useDogPhotos'

type Refetch = <TPageData>(
  options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
) => Promise<QueryObserverResult<string, unknown>>

const render = (
  photoURLs: string[],
  isFetching: boolean,
  refetch: Refetch,
  isFallback = false,
): Record<'loading' | 'error' | 'success', JSX.Element> => ({
  loading: <h1 data-testid="loader">Loading dog photos app...</h1>,
  error: (
    <>
      {!isFallback && render(photoURLs, isFetching, refetch, true)['success']}
      <h2 data-testid="error">Unexpected error occurred.</h2>
      <button data-testid="refetch" onClick={() => refetch()}>
        Load dog photo again
      </button>
    </>
  ),
  success: (
    <section data-testid="success">
      <h1>Atarise - Recruitment task</h1>
      <div
        aria-live="polite"
        aria-hidden={!isFetching}
        aria-label="Getting next dog image"
        data-loading={isFetching}
        role="alert"
      />
      <div>
        {photoURLs.map((photoUrl, i) => (
          <img
            key={photoUrl}
            src={photoUrl}
            alt={`Cute dog image no. ${i + 1}`}
          />
        ))}
      </div>
    </section>
  ),
})

export const App = () => {
  const {
    data: photoURLs,
    status,
    isFetching,
    refetch,
  } = useDogPhotos({
    queryTimeout: 1500,
    // 🤷‍♂️ You can override threshold and/or replaceStartingIndex 🤷‍♂️
    // queryThreshold: 15,
    // replaceIndexThreshold: 3,
  })

  return render(photoURLs, isFetching, refetch)[status]
}
