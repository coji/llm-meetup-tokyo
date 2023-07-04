import { useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'
import { useEventSource } from 'remix-utils'

export const useEventUpdater = () => {
  const { revalidate } = useRevalidator()
  const updateId = useEventSource('/sse/event', {
    event: 'event-update',
  })

  useEffect(() => {
    console.log('useEventUpdater', updateId)
    revalidate()
  }, [updateId, revalidate])
}
