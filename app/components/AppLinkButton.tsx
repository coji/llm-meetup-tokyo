import { Button, type ButtonProps } from '@chakra-ui/react'
import { Link as RemixLink } from '@remix-run/react'

interface AppLinkButtonProps extends ButtonProps {
  to: string
  isExternal?: boolean
  chlidren?: React.ReactNode
}
export const AppLinkButton = ({
  to,
  isExternal,
  children,
  ...rest
}: AppLinkButtonProps) => {
  if (isExternal) {
    return (
      <Button
        as="a"
        href={to}
        target="_blank"
        w="auto"
        size="sm"
        _hover={{ bg: 'gray.600', color: 'white' }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        {...rest}
      >
        {children}
      </Button>
    )
  } else {
    return (
      <Button
        as={RemixLink}
        to={to}
        w="auto"
        size="sm"
        _hover={{ bg: 'gray.600', color: 'white' }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        {...rest}
      >
        {children}
      </Button>
    )
  }
}
