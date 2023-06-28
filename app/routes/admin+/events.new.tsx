import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Stack,
} from '@chakra-ui/react'
import { redirect, type ActionArgs } from '@remix-run/node'
import { Form, Link as RemixLink } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { upsertLumaEvent } from '~/models/luma-event.server'
import { createLumaClient } from '~/services/luma.server'

export const action = async ({ request }: ActionArgs) => {
  const { url } = await zx.parseForm(request, {
    url: z.string(),
  })

  const luma = createLumaClient()
  const event = await luma.getEventInfo(url)
  await upsertLumaEvent({
    id: event.api_id,
    name: event.name,
    startAt: event.start_at,
    url: event.url,
    coverUrl: event.cover_url,
    endAt: event.end_at,
    socialImageUrl: event.social_image_url,
  })

  return redirect('..')
}

export default function EventNewPage() {
  return (
    <Box>
      <Link as={RemixLink} to="..">
        ×
      </Link>
      <Form method="POST">
        <Stack>
          <FormControl>
            <FormLabel>URL</FormLabel>
            <Input type="text" name="url" />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>

          <Button type="submit">Add</Button>
        </Stack>
      </Form>
    </Box>
  )
}
