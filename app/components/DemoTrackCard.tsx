import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  type CardProps,
} from '@chakra-ui/react'
import { GearIcon } from '@radix-ui/react-icons'
import { Link as RemixLink, useNavigate } from '@remix-run/react'
import Linkify from 'linkify-react'
import { match } from 'ts-pattern'
import {
  Avatar,
  AvatarImage,
  Badge,
  Button,
  Center,
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

interface DemoTrackCardProps extends CardProps {
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
      minW="300px"
      variant="outline"
      color="card.text.base"
      bg="card.bg.base"
      _hover={{
        cursor: to ? 'pointer' : 'default',
        bg: to ? 'card.bg.highlight' : 'default',
      }}
      onClick={() => {
        if (to) {
          navigate(to)
        }
      }}
      {...rest}
    >
      <CardHeader pb="0">
        <HStack>
          <Text color="gray.400" fontWeight="bold">
            {title}
          </Text>
          <Spacer />

          {menu && (
            <Menu>
              <MenuButton
                px={2}
                py={0}
                transition="all 0.2s"
                borderRadius="md"
                color="card.text.thin"
                _hover={{ bg: 'card.text.thin', color: 'card.bg.hover' }}
                _expanded={{ bg: 'card.text.thin', color: 'card.bg.hover' }}
                onClick={(e) => e.stopPropagation()}
              >
                <GearIcon />
              </MenuButton>
              <MenuList>
                {menu.map((menuItem, idx) => (
                  <MenuItem
                    as={RemixLink}
                    to={menuItem.to}
                    key={idx}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {menuItem.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
          <Box>
            <Badge className={stateColorClassNames}>{state}</Badge>
          </Box>
        </HStack>
      </CardHeader>

      <CardBody pt="2">
        {presenter ? (
          <Stack>
            <HStack>
              <Avatar>
                <AvatarImage src={presenter.avatarUrl} loading="lazy" />
              </Avatar>
              <Box>
                <Text wordBreak="break-word">{presenter.name}</Text>
                <Text
                  fontSize="xs"
                  noOfLines={1}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkify
                    options={{
                      defaultProtocol: 'https',
                      target: '_blank',
                    }}
                  >
                    {presenter.sns}
                  </Linkify>
                </Text>
              </Box>
              <Spacer />
              {children}
            </HStack>
            <Text
              rounded="md"
              fontSize="md"
              bg="gray.100"
              p="4"
              color="gray.600"
              wordBreak="break-word"
            >
              {presenter.demo}
            </Text>
          </Stack>
        ) : (
          <Center>{children}</Center>
        )}
      </CardBody>

      <CardFooter borderTop="1px" borderColor="gray.200" justify="end" py="2">
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

        <HStack className="text-xs">
          <Box>
            <Text color="gray.400" textAlign="right">
              Hosted by
            </Text>
            <HStack>
              <Avatar className="h-6 w-6">
                <AvatarImage src={host.avatarUrl} loading="lazy" />
              </Avatar>
              <Text noOfLines={1}>{host.name}</Text>
            </HStack>
          </Box>
        </HStack>
      </CardFooter>
    </Card>
  )
}
