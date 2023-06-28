import { Container, HStack, Heading, Link, Spacer } from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { Outlet, Link as RemixLink } from '@remix-run/react'
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
      <HStack>
        <Heading as={RemixLink} to="/admin">
          Admin
        </Heading>
        <Spacer />
        <Link as={RemixLink} to="/">
          Top
        </Link>
      </HStack>

      <Outlet />
    </Container>
  )
}
