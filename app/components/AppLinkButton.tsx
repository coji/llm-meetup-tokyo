import { ExternalLinkIcon } from '@chakra-ui/icons'
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
}: AppLinkButtonProps) => {
  if (isExternal) {
    return (
      <Button
        rightIcon={<ExternalLinkIcon />}
        as="a"
        href={to}
        target="_blank"
        w="auto"
        size="sm"
        _hover={{ bg: 'gray.600', color: 'white' }}
        onClick={(e) => {
          e.stopPropagation()
        }}
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
      >
        {children}
      </Button>
    )
  }
}
