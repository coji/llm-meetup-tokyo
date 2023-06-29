import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Link, useNavigation } from '@remix-run/react'
import { BsDiscord } from 'react-icons/bs'

type AppSignInButtonProps = ButtonProps
export const AppSignInButton = ({ ...rest }: AppSignInButtonProps) => {
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
      {...rest}
    >
      Discord アカウントで続ける
    </Button>
  )
}
