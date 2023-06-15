import type { FlexProps } from '@chakra-ui/react'
import { Flex, Heading, Spacer } from '@chakra-ui/react'
import { AppLoginPane } from './AppLoginPane'

type AppHeaderProps = FlexProps
export const AppHeader = ({ ...rest }: AppHeaderProps) => {
  return (
    <Flex {...rest}>
      <Heading py="2" textAlign="center">
        LLM Meetup Tokyo
      </Heading>

      <Spacer />
      <AppLoginPane py="2" />
    </Flex>
  )
}
