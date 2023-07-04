import { Container, Stack } from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { AppBreadcrumbs, AppFooter, AppHeader } from '~/components'
import { useAppBreadcrumbs } from '~/hooks/use-app-breadcrumbs'
import { requireUser } from '~/services/auth.server'

export const handle = {
  breadcrumb: () => ({
    label: 'Top',
    to: `/`,
  }),
}
export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request)
  return json({})
}

export default function AppLayout() {
  const breadcrumbs = useAppBreadcrumbs()
  return (
    <>
      <Container
        maxW="container.lg"
        display="grid"
        gridTemplateRows="auto 1fr auto"
        minH="100dvh"
      >
        <AppHeader title="LLM Meetup Tokyo" to="/" />
        <Stack>
          <AppBreadcrumbs items={breadcrumbs} />
          <Outlet />
        </Stack>
        <AppFooter />
      </Container>
    </>
  )
}
