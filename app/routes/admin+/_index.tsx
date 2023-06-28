import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Card,
  CardBody,
  Grid,
  HStack,
  Heading,
  Image,
  Spacer,
  Stack,
} from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { Link as RemixLink } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { listLumaEvents } from '~/models/luma-event.server'
import dayjs from '~/utils/dayjs'

export const loader = async ({ request }: LoaderArgs) => {
  const events = await listLumaEvents()
  return typedjson({ events })
}

export default function AdminIndex() {
  const { events } = useTypedLoaderData<typeof loader>()

  return (
    <Grid gridTemplateRows="auto 1fr" gap="4">
      <HStack>
        <Heading size="md">Events</Heading>
        <Spacer />
        <Button as={RemixLink} to="events/new" variant="link" size="sm">
          Add
        </Button>
      </HStack>
      <Box>
        {events.length === 0 ? (
          <div>no events</div>
        ) : (
          <Stack spacing="4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardBody>
                  <Stack>
                    <HStack alignItems="start">
                      <Stack flex="1">
                        <Box color="gray.500">
                          {dayjs(event.startAt)
                            .tz('Asia/Tokyo')
                            .format('M月D日 dddd HH:mm')}
                        </Box>
                        <Heading size="md">{event.name}</Heading>

                        <Box>
                          <Button
                            rightIcon={<ExternalLinkIcon />}
                            as="a"
                            href={`https://lu.ma/${event.url}`}
                            target="_blank"
                            w="auto"
                            size="sm"
                            _hover={{ bg: 'gray.600', color: 'white' }}
                          >
                            Event Page
                          </Button>
                        </Box>
                      </Stack>

                      <Image
                        w="48"
                        rounded="md"
                        objectFit="cover"
                        src={event.coverUrl}
                        alt={event.name}
                      />
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Grid>
  )
}
