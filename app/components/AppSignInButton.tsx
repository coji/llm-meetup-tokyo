import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Link, useLocation, useNavigation } from '@remix-run/react'
import { BsDiscord } from 'react-icons/bs'

type AppSignInButtonProps = ButtonProps
export const AppSignInButton = ({ ...rest }: AppSignInButtonProps) => {
  const navigation = useNavigation()
  const returnTo = new URLSearchParams(useLocation().search).get('returnTo')

  return (
    <Button
      as={Link}
      to={`/auth/discord${returnTo ? `?returnTo=${returnTo}` : ''}`}
      colorScheme="discord"
      w={['full', 'auto']}
      leftIcon={<BsDiscord />}
      isLoading={
        navigation.state !== 'idle' &&
        navigation.location.pathname === '/auth/discord'
      }
      {...rest}
    >
      Discord アカウントで続ける
    </Button>
  )
}
