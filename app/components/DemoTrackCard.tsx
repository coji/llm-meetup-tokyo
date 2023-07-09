import { SettingsIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
  type CardProps,
} from '@chakra-ui/react'
import { Link as RemixLink, useNavigate } from '@remix-run/react'
import Linkify from 'linkify-react'
import { match } from 'ts-pattern'

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
  const stateColor = match(state)
    .with('In Preparation', () => 'blue')
    .with('On Live', () => 'red')
    .with('Finished', () => 'gray')
    .otherwise(() => 'gray')

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
                <SettingsIcon h="3" w="3" />
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
            <Badge colorScheme={stateColor} w="full" textAlign="center">
              {state}
            </Badge>
          </Box>
        </HStack>
      </CardHeader>

      <CardBody pt="2">
        {presenter ? (
          <Stack>
            <HStack>
              <Avatar size="lg" src={presenter.avatarUrl} loading="lazy" />
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
            as="a"
            href={zoomUrl}
            target="_blank"
            colorScheme="blue"
            aria-label="zoom"
            px="2"
            onClick={(e) => {
              e.stopPropagation()
              if (!zoomUrl) {
                e.preventDefault()
              }
            }}
            variant={zoomUrl ? 'solid' : 'outline'}
            isDisabled={!zoomUrl}
          >
            Join Zoom
          </Button>
        </HStack>

        <Spacer />

        <HStack color="gray.600" fontSize="xs">
          <Box>
            <Text color="gray.400" textAlign="right">
              Hosted by
            </Text>
            <HStack>
              <Avatar size="xs" src={host.avatarUrl} loading="lazy"></Avatar>
              <Text noOfLines={1}>{host.name}</Text>
            </HStack>
          </Box>
        </HStack>
      </CardFooter>
    </Card>
  )
}
