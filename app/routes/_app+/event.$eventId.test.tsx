import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { useState } from 'react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { searchEventGuests } from '~/models'

export const loader = async ({ params, request }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })
  const query = zx.parseQuerySafe(request, {
    search: z.string().optional(),
  })
  if (!query.success) {
    return typedjson({ search: undefined, guests: [] })
  }
  const search = query.data.search ?? ''
  const guests = await searchEventGuests(eventId, search)
  return typedjson({ search, guests })
}

export const action = async ({ request, params }: ActionArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })
  const { currentPresenterId } = await zx.parseForm(request, {
    currentPresenterId: z.string().min(1),
  })
  return typedjson({ eventId, currentPresenterId })
}

export default function EventTestPage() {
  const { search, guests } = useTypedLoaderData<typeof loader>()
  const [selectedGuest, setSelectedGuest] = useState<
    (typeof guests)[0] | undefined
  >()

  return (
    <Card>
      <CardBody>
        <Stack>
          {selectedGuest && (
            <Form method="POST">
              <HStack>
                <input
                  type="text"
                  name="currentPresenterId"
                  defaultValue={selectedGuest.id}
                />
                <Box>Selected</Box>
                <Avatar
                  size="sm"
                  src={selectedGuest.lumaUser.avatarUrl}
                ></Avatar>
                <Text>{selectedGuest.lumaUser.name ?? 'Anonymous'}</Text>
              </HStack>

              <Button type="submit">Submit</Button>
            </Form>
          )}

          <Form>
            <HStack>
              <Input name="search" defaultValue={search}></Input>
              <Button type="submit">Search</Button>
            </HStack>
          </Form>

          {search && (
            <Box>
              "{search}"の検索結果: {guests.length}件
            </Box>
          )}

          <Stack>
            {guests.map((guest) => {
              return (
                <HStack
                  key={guest.id}
                  p="2"
                  rounded="md"
                  bg={selectedGuest?.id === guest.id ? 'blue.200' : undefined}
                  _hover={{ bg: 'gray.200' }}
                  onClick={() => {
                    setSelectedGuest(guest)
                  }}
                >
                  <Avatar size="sm" src={guest.lumaUser.avatarUrl}></Avatar>
                  <Text>{guest.lumaUser.name ?? 'Anonymous'}</Text>
                </HStack>
              )
            })}
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  )
}
