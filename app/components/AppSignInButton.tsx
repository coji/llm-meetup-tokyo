import { Button } from '@chakra-ui/react'
import { Link, useNavigation } from '@remix-run/react'

export const AppSignInButton = () => {
  const navigation = useNavigation()

  return (
    <Button
      as={Link}
      to="/auth/discord"
      colorScheme="blue"
      w={['full', 'auto']}
      isLoading={
        navigation.state !== 'idle' &&
        navigation.location.pathname === '/auth/discord'
      }
    >
      Discord アカウントで続ける
    </Button>
  )
}
