import { Authenticator } from 'remix-auth'
import { DiscordStrategy, type PartialDiscordGuild } from 'remix-auth-discord'
import invariant from 'tiny-invariant'
import { prisma } from './database.server'
import { sessionStorage, type DiscordUser } from './session.server'

invariant(process.env.DISCORD_CLIENT_ID, 'DISCORD_CLIENT_ID should be defined.')
invariant(
  process.env.DISCORD_CLIENT_SECRET,
  'DISCORD_CLIENT_SECRET should be defined.',
)
invariant(process.env.DISCORD_GUILD_ID, 'DISCORD_GUILD_ID should be defined.')

const discordStrategy = new DiscordStrategy(
  {
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: '/auth/discord/callback',
    scope: ['identify', 'email', 'guilds'],
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const userGuilds = (await (
      await fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    )?.json()) as Array<PartialDiscordGuild>

    const isGuildMember = userGuilds.some(
      (guild) => guild.id === process.env.DISCORD_GUILD_ID,
    )
    if (!isGuildMember) {
      throw new Error('You must be a member of the Discord Server to sign in.')
    }

    const userRecord = {
      displayName: profile.__json.username,
      photoUrl: profile.__json.avatar
        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.__json.avatar}.png`
        : null,
      discriminator: profile.__json.discriminator,
      email: profile.__json.email,
    }

    const user = await prisma.user.upsert({
      where: {
        id: profile.id,
      },
      create: {
        id: profile.id,
        ...userRecord,
      },
      update: {
        ...userRecord,
      },
      select: {
        id: true,
        displayName: true,
        photoUrl: true,
        discriminator: true,
        email: true,
      },
    })

    return {
      ...user,
      email: user.email ?? undefined,
      photoUrl: user.photoUrl ?? undefined,
    }
  },
)

const authenticator = new Authenticator<DiscordUser>(sessionStorage)
authenticator.use(discordStrategy)
export { authenticator }

export const requireUser = (request: Request) =>
  authenticator.isAuthenticated(request, { failureRedirect: '/login' })
