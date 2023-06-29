import type { StackProps } from '@chakra-ui/react'
import {
  Avatar,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Link } from '@remix-run/react'
import { useSessionUser } from '~/hooks/use-session-user'
import { AppLinkButton } from './AppLinkButton'

export const AppLoginPane = (props: StackProps) => {
  const user = useSessionUser()
  if (!user) {
    return <AppLinkButton to="/login">Sign In</AppLinkButton>
  }

  return (
    <Stack
      direction="row"
      justify="end"
      align="center"
      fontSize="sm"
      color="gray.500"
      {...props}
    >
      <Menu>
        <MenuButton>
          <Avatar size="sm" src={user.photoUrl}></Avatar>
        </MenuButton>
        <MenuList>
          <MenuItem>
            <Stack spacing="0">
              <Text>{user.displayName}</Text>
              <Text fontSize="xs">{user.email}</Text>
            </Stack>
          </MenuItem>
          <MenuDivider />
          <MenuItem as={Link} to="/admin">
            Admin
          </MenuItem>
          <MenuDivider />
          <MenuItem as={Link} to="/auth/logout">
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Stack>
  )
}
