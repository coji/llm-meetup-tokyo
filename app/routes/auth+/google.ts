import type { LoaderArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'
import { buildForwardedRequest } from '~/utils/forwarded-request.server'

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticator.authenticate(
    'google',
    buildForwardedRequest(request),
    {
      successRedirect: '/',
      failureRedirect: '/',
    },
  )
}
