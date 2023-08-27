import { ExternalLinkIcon, GearIcon } from '@radix-ui/react-icons'
import { Link, useNavigate } from '@remix-run/react'
import { RiMapPinLine, RiTeamLine } from 'react-icons/ri'
import {
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HStack,
  Heading,
  Stack,
} from '~/components/ui'
import type { LumaEvent } from '~/services/database.server'
import dayjs from '~/utils/dayjs'
import { AppLinkButton } from './AppLinkButton'

interface EventCardMenuItem {
  label: string
  to: string
}

interface EventCardProps {
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
      className="cursor-pointer hover:shadow-lg"
      onClick={() => {
        if (to) {
          navigate(to)
        }
      }}
    >
      <CardContent className="p-4">
        <div className="grid grid-cols-[1fr] grid-rows-[auto_1fr] gap-4 md:grid-cols-[auto_1fr] md:grid-rows-[1fr]">
          <img
            className="h-64 w-full rounded-md object-cover md:h-full md:w-64"
            src={event.coverUrl}
            alt={event.name}
            loading="lazy"
          />

          <Stack className="gap-2">
            {/* Heading */}
            <HStack>
              <div className="flex-1">
                <p className="text-sm">
                  {dayjs(event.startAt)
                    .tz('Asia/Tokyo')
                    .format('M月D日 dddd HH:mm')}
                </p>
                <Heading size="md">{event.name}</Heading>
              </div>

              {menu && (
                <DropdownMenu>
                  <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
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
            </HStack>

            {/* Guests and Geo */}
            <HStack className="gap-2 text-sm md:gap-4">
              <HStack>
                <div className="rounded border p-2">
                  <RiTeamLine />
                </div>
                <p>{event.guestCount} Guests</p>
              </HStack>

              <HStack>
                <div className="rounded border p-2">
                  <RiMapPinLine />
                </div>
                <div>
                  <a
                    className="hover:underline"
                    href={`https://www.google.com/maps/search/?api=1&query=${event.geoAddress}&query_place_id=${event.geoPlaceId}`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    rel="noreferrer"
                  >
                    <p>
                      {event.geoAddress}{' '}
                      <ExternalLinkIcon className="inline h-3 w-3" />
                    </p>
                    <p className="text-xs">{event.geoCityState}</p>
                  </a>
                </div>
              </HStack>
            </HStack>

            <HStack className="flex-wrap">
              <AppLinkButton to={event.url} variant="outline" isExternal>
                Luma Event Page <ExternalLinkIcon className="ml-2" />
              </AppLinkButton>

              {children}
            </HStack>
          </Stack>
        </div>
      </CardContent>
    </Card>
  )
}
