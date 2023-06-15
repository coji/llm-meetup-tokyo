import { useRouteLoaderData } from '@remix-run/react'
import type { DiscordUser } from '~/services/session.server'

export const useSessionUser = () => {
  const rootRouteData = useRouteLoaderData('root')
  const { user } = rootRouteData as { user?: DiscordUser }
  return user
}
