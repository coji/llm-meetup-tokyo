import { ExternalLinkIcon, SettingsIcon } from '@chakra-ui/icons'
import {
  Box,
  Card,
  CardBody,
  Grid,
  HStack,
  Heading,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  type CardProps,
} from '@chakra-ui/react'
import type { LumaEvent } from '@prisma/client'
import { Link as RemixLink, useNavigate } from '@remix-run/react'
import { RiMapPinLine, RiTeamLine } from 'react-icons/ri'
import dayjs from '~/utils/dayjs'
import { AppLinkButton } from './AppLinkButton'

interface EventCardMenuItem {
  label: string
  to: string
}

interface EventCardProps extends CardProps {
  to?: string
  event: LumaEvent
  menu?: EventCardMenuItem[]
  children?: React.ReactNode
}
export const EventCard = ({
  to,
  event,
  menu,
  children,
  ...rest
}: EventCardProps) => {
  const navigate = useNavigate()
  return (
    <Card
      color="card.text.base"
      bg="card.bg.base"
      _hover={{ cursor: to ? 'pointer' : 'default', bg: 'card.bg.hover' }}
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
            loading="lazy"
          />

          <Stack spacing="2">
            {/* Heading */}
            <HStack align="start">
              <Box flex="1">
                <Text fontSize="sm">
                  {dayjs(event.startAt)
                    .tz('Asia/Tokyo')
                    .format('M月D日 dddd HH:mm')}
                </Text>
                <Heading size="md">{event.name}</Heading>
              </Box>

              {menu && (
                <Menu>
                  <MenuButton
                    px={2}
                    py={0}
                    transition="all 0.2s"
                    borderRadius="md"
                    color="card.text.thin"
                    _hover={{ bg: 'card.text.thin', color: 'white' }}
                    _expanded={{ bg: 'card.text.thin', color: 'white' }}
                    _focus={{ boxShadow: 'outline' }}
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
            </HStack>

            {/* Guests and Geo */}
            <Stack fontSize="sm" gap={{ base: '2', md: '4' }} direction="row">
              <HStack>
                <Box
                  rounded="md"
                  border="1px"
                  borderColor="card.text.thin"
                  p="2"
                >
                  <RiTeamLine />
                </Box>
                <Text>{event.guestCount} Guests</Text>
              </HStack>

              <HStack>
                <Box
                  rounded="md"
                  border="1px"
                  borderColor="card.text.thin"
                  p="2"
                >
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

              {children}
            </HStack>
          </Stack>
        </Grid>
      </CardBody>
    </Card>
  )
}
