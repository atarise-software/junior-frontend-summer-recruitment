import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'

const COUNT_TO_INDEX_OFFSET = 1
export const PHOTO_ERROR_FALLBACK_URL =
  'https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131_1280.png'

const queryPhoto = async (photoPath: string) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${photoPath}`)
  const data: { message: string; status: string } = await res.json()
  return data.message
}

export const useDogPhotos = ({
  queryThreshold = 9,
  queryTimeout = 3_000,
  replaceIndexThreshold = 6,
  photoPath = 'breeds/image/random',
} = {}) => {
  const internalQueryState = useRef({
    queryCount: 0,
    photoURLs: [] as string[],
    previouslyErrored: false,
  })

  const { data: photoURL, ...query } = useQuery({
    queryKey: ['dogPhotoUrls', photoPath],
    queryFn: () => queryPhoto(photoPath),
    refetchInterval: (_, { state }) => {
      internalQueryState.current.queryCount = state.dataUpdateCount
      return state.errorUpdateCount === 0 &&
        state.dataUpdateCount < queryThreshold
        ? queryTimeout
        : false
    },
  })

  const { queryCount, photoURLs } = internalQueryState.current
  const data = !photoURL
    ? internalQueryState.current.photoURLs
    : (() => {
        const replaceIndex =
          query.status === 'error' ? queryCount + 1 : queryCount
        photoURLs[
          (replaceIndex - COUNT_TO_INDEX_OFFSET) % replaceIndexThreshold
        ] = query.status !== 'error' ? photoURL : PHOTO_ERROR_FALLBACK_URL
        return photoURLs
      })()

  return {
    data,
    ...query,
  }
}
