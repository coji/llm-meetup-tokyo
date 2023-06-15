import { Box, Center, Container } from '@chakra-ui/react'
import { AppFooter, AppHeader } from '~/components'
import { useSessionUser } from '~/hooks/use-session-user'

export default function IndexPage() {
  const user = useSessionUser()

  return (
    <>
      <Container
        maxW="container.md"
        display="grid"
        gridTemplateRows="auto 1fr auto"
        minH="100dvh"
      >
        <AppHeader />
        <Center>{user && <Box>Welcome, {user.displayName}!</Box>}</Center>
        <AppFooter />
      </Container>
    </>
  )
}
