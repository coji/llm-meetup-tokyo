import { createCookieSessionStorage } from '@remix-run/node'
import type { DiscordProfile } from 'remix-auth-discord'
import invariant from 'tiny-invariant'
invariant(
  process.env.SESSION_SECRET,
  'SESSION_SECRET environment variable should defined',
)

export interface DiscordUser {
  id: DiscordProfile['id']
  displayName: DiscordProfile['displayName']
  photoUrl?: NonNullable<DiscordProfile['__json']['avatar']>
  discriminator: DiscordProfile['__json']['discriminator']
  email?: NonNullable<DiscordProfile['__json']['email']>
}

export const sessionStorage = createCookieSessionStorage<DiscordUser>({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const getSession = async (request: Request) => {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}
