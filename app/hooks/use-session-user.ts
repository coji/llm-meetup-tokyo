import { useRouteLoaderData } from '@remix-run/react'
import type { SessionUser } from '~/services/session.server'

export const useSessionUser = () => {
  const rootRouteData = useRouteLoaderData('root')
  const { sessionUser } = rootRouteData as { sessionUser?: SessionUser }
  return sessionUser
}
