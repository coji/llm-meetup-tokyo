import { Box, Center } from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { requireUser } from '~/services/auth.server'

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request)
  return json({ user })
}

export default function IndexPage() {
  const { user } = useLoaderData<typeof loader>()
  return <Center>{user && <Box>Welcome, {user.displayName}!</Box>}</Center>
}
