import type { LoaderArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'
import { returnToCookie } from '~/services/session.server'
import { buildForwardedRequest } from '~/utils/forwarded-request.server'

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const returnTo = url.searchParams.get('returnTo')
  console.log({ returnTo })

  try {
    return await authenticator.authenticate(
      'discord',
      buildForwardedRequest(request),
      {
        successRedirect: '/',
        failureRedirect: '/login',
      },
    )
  } catch (error) {
    if (!returnTo) throw error
    if (error instanceof Response && isRedirect(error)) {
      error.headers.append(
        'Set-Cookie',
        await returnToCookie.serialize(returnTo),
      )
      return error
    }
    throw error
  }
}

function isRedirect(response: Response) {
  if (response.status < 300 || response.status >= 400) return false
  return response.headers.has('Location')
}
