import { Container } from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: '/' })
  return json({})
}

export default function AdminIndexPage() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <Container
      maxW="container.md"
      display="grid"
      minH="100dvh"
      gridTemplateRows="auto 1fr"
    ></Container>
  )
}
