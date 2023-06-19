import { Container, HStack, Heading, Spacer } from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { Link, Outlet } from '@remix-run/react'
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
        <Heading as={Link} to="/admin">
          Admin
        </Heading>
        <Spacer />
        <Link to="/">Top</Link>
      </HStack>

      <Outlet />
    </Container>
  )
}
