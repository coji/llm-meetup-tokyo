import { Center, Container } from '@chakra-ui/react'
import { Outlet } from '@remix-run/react'
import { AppFooter, AppHeader } from '~/components'

export default function AppLayout() {
  return (
    <>
      <Container
        maxW="container.md"
        display="grid"
        gridTemplateRows="auto 1fr auto"
        minH="100dvh"
      >
        <AppHeader title="LLM Meetup Tokyo" to="/" />
        <Center>
          <Outlet />
        </Center>
        <AppFooter />
      </Container>
    </>
  )
}
