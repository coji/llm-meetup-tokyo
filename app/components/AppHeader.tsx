import type { FlexProps } from '@chakra-ui/react'
import { Flex, Heading, Spacer } from '@chakra-ui/react'
import { Link } from '@remix-run/react'
import { AppLoginPane } from './AppLoginPane'

interface AppHeaderProps extends FlexProps {
  to: string
  title: string
}
export const AppHeader = ({ title, to, ...rest }: AppHeaderProps) => {
  return (
    <Flex {...rest} align="center">
      <Heading
        as={Link}
        to={to}
        size={{ base: 'md', md: 'lg' }}
        py="2"
        textAlign="center"
      >
        {title}
      </Heading>

      <Spacer />
      <AppLoginPane py="2" />
    </Flex>
  )
}
