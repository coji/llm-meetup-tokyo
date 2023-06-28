import { Container } from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { AppHeader } from '~/components'
import { authenticator } from '~/services/auth.server'

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: '/' })
  return json({})
}

export default function AdminIndexPage() {
  return (
    <Container
      maxW="container.md"
      display="grid"
      minH="100dvh"
      gridTemplateRows="auto 1fr"
    >
      <AppHeader title="LLM Meetup Tokyo Admin" to="/admin" />

      <Outlet />
    </Container>
  )
}
