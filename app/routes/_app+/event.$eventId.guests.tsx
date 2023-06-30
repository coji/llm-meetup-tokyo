import { DownloadIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Card,
  CardBody,
  Flex,
  HStack,
  Heading,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { type LoaderArgs } from '@remix-run/node'
import { Outlet, useNavigate } from '@remix-run/react'
import Linkify from 'linkify-react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppLinkButton } from '~/components'
import { listEventGuests } from '~/models'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const guests = await listEventGuests(eventId)

  return typedjson({ eventId, guests })
}

export default function EventDetailPage() {
  const { eventId, guests } = useTypedLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <Card>
      <CardBody px="4">
        <HStack align="start">
          <Heading size="md" mb="4">
            Guests
          </Heading>
          <Spacer />
          <AppLinkButton
            to={`/event/${eventId}/download`}
            isExternal
            rightIcon={<DownloadIcon />}
          >
            Download
          </AppLinkButton>
        </HStack>

        <Box rounded="md" border="1px solid" borderColor="gray.200">
          {guests.map((guest, idx) => {
            return (
              <Flex
                key={guest.id}
                direction={{ base: 'column', md: 'row' }}
                gap={{ base: '0', md: '2' }}
                _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                py="2"
                px="4"
                roundedTop={idx === 0 ? 'md' : undefined}
                roundedBottom={idx === guests.length - 1 ? 'md' : undefined}
                borderTop={idx === 0 ? '0' : '0.5px solid'}
                borderBottom={idx === guests.length - 1 ? '0' : '0.5px solid'}
                borderColor="gray.200"
                onClick={() => {
                  navigate(`${guest.id}`, {
                    preventScrollReset: true,
                  })
                }}
              >
                <HStack w={{ base: 'auto', md: '16rem' }} gap="4">
                  <Avatar size="sm" src={guest.lumaUser.avatarUrl}></Avatar>
                  <Box>
                    <Text>{guest.lumaUser.name ?? 'Anonymous'}</Text>

                    <Text fontSize="xs" color="gray.500" wordBreak="break-all">
                      <Linkify
                        options={{
                          defaultProtocol: 'https',
                          target: '_blank',
                        }}
                      >
                        {guest.answers.sns}
                      </Linkify>
                    </Text>
                  </Box>
                </HStack>

                <Box
                  flex="1"
                  fontSize="sm"
                  color="gray.500"
                  p="1"
                  wordBreak="break-all"
                >
                  <Linkify
                    options={{ defaultProtocol: 'https', target: '_blank' }}
                  >
                    {guest.answers.demo}
                  </Linkify>
                </Box>
              </Flex>
            )
          })}
        </Box>

        <Outlet />
      </CardBody>
    </Card>
  )
}
