import { GearIcon } from '@radix-ui/react-icons'
import { Link, useNavigate } from '@remix-run/react'
import Linkify from 'linkify-react'
import { match } from 'ts-pattern'
import {
  Avatar,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Center,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HStack,
  Spacer,
  Stack,
} from '~/components/ui'

interface DemoTrackMenuItem {
  label: string
  to: string
}

interface DemoTrackPresenter {
  name: string
  avatarUrl: string
  sns?: string
  demo?: string
}

interface DemoTrackHost {
  name: string
  avatarUrl: string
}

interface DemoTrackCardProps {
  eventId: string
  trackId: number
  title: string
  state: string
  presenter?: DemoTrackPresenter
  host: DemoTrackHost
  zoomUrl?: string
  menu?: DemoTrackMenuItem[]
  to?: string
  children?: React.ReactNode
}
export const DemoTrackCard = ({
  eventId,
  trackId,
  title,
  state,
  presenter,
  host,
  zoomUrl,
  menu,
  to,
  children,
  ...rest
}: DemoTrackCardProps) => {
  const navigate = useNavigate()
  const stateColorClassNames = match(state)
    .with('In Preparation', () => 'bg-blue-500 text-white')
    .with('On Live', () => 'bg-red-500 text-white')
    .with('Finished', () => 'bg-slate-500 text-white')
    .otherwise(() => 'text-slate-500')

  return (
    <Card
      className="min-w-[300px] flex-1 cursor-pointer hover:shadow-lg"
      onClick={() => {
        if (to) {
          navigate(to)
        }
      }}
      {...rest}
    >
      <CardHeader className="pb-0">
        <HStack>
          <p className="font-bold">{title}</p>
          <Spacer />

          {menu && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <GearIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {menu.map((menuItem, idx) => (
                  <DropdownMenuItem
                    asChild
                    key={idx}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link to={menuItem.to}>{menuItem.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div>
            <Badge className={stateColorClassNames}>{state}</Badge>
          </div>
        </HStack>
      </CardHeader>

      <CardContent className="pt-2">
        {presenter ? (
          <Stack>
            <HStack>
              <Avatar>
                <AvatarImage src={presenter.avatarUrl} loading="lazy" />
              </Avatar>
              <div>
                <p className="break-words">{presenter.name}</p>
                <p className="text-xs " onClick={(e) => e.stopPropagation()}>
                  <Linkify
                    options={{
                      defaultProtocol: 'https',
                      target: '_blank',
                    }}
                  >
                    {presenter.sns}
                  </Linkify>
                </p>
              </div>
              <Spacer />
              {children}
            </HStack>
            <p className="text-md break-words rounded p-4">{presenter.demo}</p>
          </Stack>
        ) : (
          <Center>{children}</Center>
        )}
      </CardContent>

      <CardFooter className="justify-end py-2">
        <HStack>
          <Button
            asChild
            aria-label="zoom"
            className="px-2"
            onClick={(e) => {
              e.stopPropagation()
              if (!zoomUrl) {
                e.preventDefault()
              }
            }}
            variant="default"
            disabled={!zoomUrl}
          >
            <a
              href={zoomUrl}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              rel="noreferrer"
            >
              Join Zoom
            </a>
          </Button>
        </HStack>

        <Spacer />

        <div className="text-xs">
          <p className="text-right">Hosted by</p>
          <HStack>
            <Avatar className="h-6 w-6">
              <AvatarImage src={host.avatarUrl} loading="lazy" />
            </Avatar>
            <p>{host.name}</p>
          </HStack>
        </div>
      </CardFooter>
    </Card>
  )
}
