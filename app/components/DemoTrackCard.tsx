import {
  Avatar,
  Badge,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Stack,
  Text,
  type CardProps,
} from '@chakra-ui/react'
import { useNavigate } from '@remix-run/react'
import Linkify from 'linkify-react'
import { SiZoom } from 'react-icons/si'

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

interface DemoTrackState {
  label: string
  color: string
}

interface DemoTrackCardProps extends CardProps {
  eventId: string
  trackId: number
  title: string
  state?: DemoTrackState
  presenter: DemoTrackPresenter
  host: DemoTrackHost
  zoomUrl: string
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
  to,
  children,
  ...rest
}: DemoTrackCardProps) => {
  const navigate = useNavigate()
  return (
    <Card
      minW="300px"
      _hover={{ cursor: to ? 'pointer' : 'default', bg: 'gray.50' }}
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
          {state && (
            <Box>
              <Badge colorScheme={state.color} w="full" textAlign="center">
                {state.label}
              </Badge>
            </Box>
          )}
        </HStack>
      </CardHeader>
      <CardBody pt="2">
        <Stack>
          <HStack>
            <Avatar size="lg" src={presenter.avatarUrl} />
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
      </CardBody>

      <CardFooter borderTop="1px" borderColor="gray.200" justify="end" py="2">
        <HStack>
          <IconButton
            as="a"
            href={zoomUrl}
            target="_blank"
            size="sm"
            colorScheme="blue"
            aria-label="zoom"
            px="2"
            onClick={(e) => e.stopPropagation()}
          >
            {<Icon as={SiZoom} boxSize="8" />}
          </IconButton>
        </HStack>

        <Spacer />

        <HStack color="gray.600" fontSize="xs">
          {children}
          <Text>Hosted by</Text>
          <Avatar size="xs" src={host.avatarUrl}></Avatar>
          <Text>{host.name}</Text>
        </HStack>
      </CardFooter>
    </Card>
  )
}
