import { Link } from '@remix-run/react'
import { Button, type ButtonProps } from '~/components/ui'

interface AppLinkButtonProps extends ButtonProps {
  to: string
  isExternal?: boolean
  children?: React.ReactNode
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
        asChild
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
        }}
        {...rest}
      >
        <a href={to} target="_blank" rel="noreferrer">
          {children}
        </a>
      </Button>
    )
  } else {
    return (
      <Button
        asChild
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
        }}
        {...rest}
      >
        <Link to={to}>{children}</Link>
      </Button>
    )
  }
}
