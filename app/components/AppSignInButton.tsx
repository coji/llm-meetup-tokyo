import { Link, useLocation } from '@remix-run/react'
import { BsDiscord } from 'react-icons/bs'
import { Button, type ButtonProps } from '~/components/ui'

type AppSignInButtonProps = ButtonProps
export const AppSignInButton = ({ ...rest }: AppSignInButtonProps) => {
  const returnTo = new URLSearchParams(useLocation().search).get('returnTo')

  return (
    <Button asChild {...rest}>
      <Link to={`/auth/discord${returnTo ? `?returnTo=${returnTo}` : ''}`}>
        <BsDiscord className="mr-2" /> Discord アカウントで続ける
      </Link>
    </Button>
  )
}
