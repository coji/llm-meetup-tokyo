import { Link } from '@remix-run/react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui'
import { useSessionUser } from '~/hooks/use-session-user'
import { AppLinkButton } from './AppLinkButton'

export const AppLoginPane = () => {
  const user = useSessionUser()
  if (!user) {
    return <AppLinkButton to="/login">Sign In</AppLinkButton>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.photoUrl}></AvatarImage>
          <AvatarFallback>{user.displayName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <p>{user.displayName}</p>
          <p className="text-xs font-normal">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/admin">Admin</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/logout">Sign Out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
