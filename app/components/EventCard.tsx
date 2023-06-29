import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  Stack,
  type CardProps,
} from '@chakra-ui/react'
import { useNavigate } from '@remix-run/react'
import type { listLumaEvents } from '~/models/luma-event.server'
import dayjs from '~/utils/dayjs'

interface EventCardProps extends CardProps {
  to?: string
  event: Awaited<ReturnType<typeof listLumaEvents>>[0]
  action?: React.ReactNode
}
export const EventCard = ({ to, event, action, ...rest }: EventCardProps) => {
  const navigate = useNavigate()
  return (
    <Card
      _hover={{ cursor: to ? 'pointer' : 'default' }}
      onClick={() => {
        if (to) {
          navigate(to)
        }
      }}
      {...rest}
    >
      <CardBody>
        <Stack>
          <HStack alignItems="start">
            <Stack flex="1" position="relative">
              <Button
                position="absolute"
                top="0"
                right="0"
                size="xs"
                variant="ghost"
                color="gray.500"
              >
                ...
              </Button>
              <Box color="gray.500">
                {dayjs(event.startAt)
                  .tz('Asia/Tokyo')
                  .format('M月D日 dddd HH:mm')}
              </Box>
              <Heading size="md">{event.name}</Heading>

              {event.guestCount && <Box>{event.guestCount} Guests</Box>}
            </Stack>

            <Image
              w={{ base: '24', md: '48' }}
              rounded="md"
              objectFit="cover"
              src={event.coverUrl}
              alt={event.name}
            />
          </HStack>

          {action}

          <Stack>
            {event.lumaEventGuest.map((guest, idx) => {
              return (
                <HStack key={guest.id}>
                  <Box>{idx + 1}</Box>
                  <Box>{dayjs(guest.createdAt).format('YYYY-MM-DD HH:mm')}</Box>
                  <Box>
                    {JSON.stringify(guest.lumaUser.name ?? 'Anonymous')}
                  </Box>
                  <Box>{guest.approvalStatus}</Box>
                </HStack>
              )
            })}
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  )
}
