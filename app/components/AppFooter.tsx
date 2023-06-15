import { Box, Link } from '@chakra-ui/react'

export const AppFooter = () => {
  return (
    <Box textAlign="center" p="2" pt="8">
      <Box>
        <Link href="https://github.com/coji/llm-meetup-tokyo" color="blue.500">
          GitHub
        </Link>
      </Box>
    </Box>
  )
}
