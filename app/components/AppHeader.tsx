import { Link } from '@remix-run/react'
import { Heading, Spacer } from '~/components/ui'
import { AppLoginPane } from './AppLoginPane'

interface AppHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  to: string
  title: string
}
export const AppHeader = ({ title, to, ...rest }: AppHeaderProps) => {
  return (
    <header className="bg-background text-foreground " {...rest}>
      <div className="container flex items-center ">
        <Heading className="py-2 text-center">
          <Link to={to}>{title}</Link>
        </Heading>
        <Spacer />
        <AppLoginPane />
      </div>
    </header>
  )
}
