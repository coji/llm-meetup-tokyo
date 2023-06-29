import { Button } from '@chakra-ui/react'
import { Link, useNavigation } from '@remix-run/react'
import { BsDiscord } from 'react-icons/bs'
export const AppSignInButton = () => {
  const navigation = useNavigation()

  return (
    <Button
      as={Link}
      to="/auth/discord"
      colorScheme="discord"
      w={['full', 'auto']}
      leftIcon={<BsDiscord />}
      isLoading={
        navigation.state !== 'idle' &&
        navigation.location.pathname === '/auth/discord'
      }
    >
      Discord アカウントで続ける
    </Button>
  )
}
