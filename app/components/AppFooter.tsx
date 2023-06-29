import { Link, Stack } from '@chakra-ui/react'

export const AppFooter = () => {
  return (
    <Stack p="4" direction={{ base: 'column', md: 'row' }} justify="center">
      <Link
        href="https://github.com/coji/llm-meetup-tokyo"
        isExternal
        rel="noreferrer"
      >
        GitHub
      </Link>

      <Link
        href="https://discord.com/channels/1083356163074170950"
        isExternal
        rel="noreferrer"
      >
        Discord
      </Link>
    </Stack>
  )
}
