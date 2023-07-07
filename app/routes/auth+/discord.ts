import type { LoaderArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'
import { buildForwardedRequest } from '~/utils/forwarded-request.server'

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const returnTo = url.searchParams.get('returnTo')

  return authenticator.authenticate('discord', buildForwardedRequest(request), {
    successRedirect: returnTo ?? '/',
    failureRedirect: `/login${returnTo ? `?returnTo=${returnTo}` : ''}}`,
  })
}
