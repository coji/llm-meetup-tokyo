import {
  Box,
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  Stack,
  type CardProps,
} from '@chakra-ui/react'
import type { LumaEvent } from '@prisma/client'
import { useNavigate } from '@remix-run/react'
import dayjs from '~/utils/dayjs'

interface EventCardProps extends CardProps {
  to?: string
  event: LumaEvent
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
            <Stack flex="1">
              <Box color="gray.500">
                {dayjs(event.startAt)
                  .tz('Asia/Tokyo')
                  .format('M月D日 dddd HH:mm')}
              </Box>
              <Heading size="md">{event.name}</Heading>

              {action}

              <Box>{JSON.stringify(event.registrationQuestions, null, 2)}</Box>
            </Stack>

            <Image
              w={{ base: '32', md: '48' }}
              rounded="md"
              objectFit="cover"
              src={event.coverUrl}
              alt={event.name}
            />
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  )
}
