import { Box, Container } from '@chakra-ui/react'
import { AppFooter, AppHeader } from '~/components'

export default function IndexPage() {
  return (
    <>
      <Container
        maxW="container.md"
        display="grid"
        gridTemplateRows="auto 1fr auto"
        minH="100dvh"
      >
        <AppHeader />
        <Box>&nbsp;</Box>
        <AppFooter />
      </Container>
    </>
  )
}
