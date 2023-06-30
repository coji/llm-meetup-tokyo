import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Card,
  CardBody,
  Grid,
  HStack,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  type CardProps,
} from '@chakra-ui/react'
import type { LumaEvent } from '@prisma/client'
import { useNavigate } from '@remix-run/react'
import { RiMapPinLine, RiTeamLine } from 'react-icons/ri'
import dayjs from '~/utils/dayjs'
import { AppLinkButton } from './AppLinkButton'

interface EventCardProps extends CardProps {
  to?: string
  event: LumaEvent
  children?: React.ReactNode
}
export const EventCard = ({ to, event, children, ...rest }: EventCardProps) => {
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
        <Grid
          gridTemplateRows={{ base: 'auto 1fr', md: '1fr' }}
          gridTemplateColumns={{ base: '1fr', md: 'auto 1fr' }}
          gap="4"
        >
          <Image
            w={{ base: 'full', md: '64' }}
            rounded="md"
            objectFit="cover"
            src={event.coverUrl}
            alt={event.name}
          />

          <Stack spacing="2">
            {/* Heading */}
            <Box>
              <Text color="gray.600" fontSize="sm">
                {dayjs(event.startAt)
                  .tz('Asia/Tokyo')
                  .format('M月D日 dddd HH:mm')}
              </Text>
              <Heading size="md">{event.name}</Heading>
            </Box>

            {/* Guests and Geo */}
            <Stack
              color="gray.600"
              fontSize="sm"
              gap={{ base: '2', md: '4' }}
              direction={{ base: 'column', md: 'row' }}
            >
              <HStack>
                <Box rounded="md" border="1px" borderColor="gray.200" p="2">
                  <RiTeamLine />
                </Box>
                <Text>{event.guestCount} Guests</Text>
              </HStack>

              <HStack>
                <Box rounded="md" border="1px" borderColor="gray.200" p="2">
                  <RiMapPinLine />
                </Box>
                <Box>
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${event.geoAddress}&query_place_id=${event.geoPlaceId}`}
                    isExternal
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Text>
                      {event.geoAddress} <ExternalLinkIcon />
                    </Text>
                    <Text fontSize="xs">{event.geoCityState}</Text>
                  </Link>
                </Box>
              </HStack>
            </Stack>

            <HStack flexWrap="wrap">
              <AppLinkButton
                to={event.url}
                isExternal
                rightIcon={<ExternalLinkIcon />}
              >
                Luma Event Page
              </AppLinkButton>
              <AppLinkButton to={`/event/${event.id}/sync`}>Sync</AppLinkButton>
            </HStack>
          </Stack>
        </Grid>
      </CardBody>
    </Card>
  )
}
