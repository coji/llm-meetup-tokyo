import type { LoaderArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'
import { returnToCookie } from '~/services/session.server'
import { buildForwardedRequest } from '~/utils/forwarded-request.server'

export const loader = async ({ request }: LoaderArgs) => {
  // get the returnTo from the cookie
  const returnTo =
    ((await returnToCookie.parse(request.headers.get('Cookie'))) as
      | string
      | null) ?? '/'

  return await authenticator.authenticate(
    'discord',
    buildForwardedRequest(request),
    {
      successRedirect: returnTo,
      failureRedirect: '/login',
    },
  )
}
