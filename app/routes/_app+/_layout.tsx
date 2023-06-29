import { Container } from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { AppFooter, AppHeader } from '~/components'
import { requireUser } from '~/services/auth.server'

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request)
  return json({ user })
}

export default function AppLayout() {
  return (
    <>
      <Container
        maxW="container.lg"
        display="grid"
        gridTemplateRows="auto 1fr auto"
        minH="100dvh"
      >
        <AppHeader title="LLM Meetup Tokyo" to="/" />
        <Outlet />
        <AppFooter />
      </Container>
    </>
  )
}
