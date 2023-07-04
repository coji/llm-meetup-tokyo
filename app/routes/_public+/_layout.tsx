import { Container, Stack } from '@chakra-ui/react'
import { Outlet } from '@remix-run/react'
import { AppBreadcrumbs, AppFooter, AppHeader } from '~/components'

export default function AppLayout() {
  return (
    <>
      <Container
        maxW="container.lg"
        overflow="auto"
        display="grid"
        gridTemplateRows="auto 1fr auto"
        minH="100dvh"
      >
        <AppHeader title="LLM Meetup Tokyo" to="/" />
        <Stack>
          <AppBreadcrumbs items={[{ label: 'Top', isCurrentPage: true }]} />
          <Outlet />
        </Stack>
        <AppFooter />
      </Container>
    </>
  )
}
