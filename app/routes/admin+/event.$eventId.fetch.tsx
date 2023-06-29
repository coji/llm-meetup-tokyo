import { Button, Card, CardBody, Stack } from '@chakra-ui/react'
import { redirect, type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { Form, useNavigation } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppBreadcrumbs } from '~/components'
import { runLumaCrawlJob } from '~/jobs/luma-crawl-job.server'
import { getEventById } from '~/models/luma-event.server'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const event = await getEventById(eventId)

  return typedjson({ event })
}

export const action = async ({ params, request }: ActionArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })
  const { url } = await zx.parseForm(request, {
    url: z.string(),
  })

  // 同期的にクロール
  await runLumaCrawlJob(url)

  return redirect(`/admin/event/${eventId}`)
}

export default function EventFetchPage() {
  const { event } = useTypedLoaderData<typeof loader>()
  const navigation = useNavigation()

  return (
    <Stack>
      <AppBreadcrumbs
        items={[
          { label: 'Admin', to: '/admin' },
          { label: event.name, to: `/admin/event/${event.id}` },
          { label: 'Fetch', isCurrentPage: true },
        ]}
      />

      <Form method="POST">
        <Card>
          <CardBody>
            <input type="hidden" name="url" value={event.url}></input>
            <Button
              type="submit"
              isLoading={navigation.state === 'submitting'}
              isDisabled={navigation.state !== 'idle'}
            >
              {navigation.state === 'submitting' ? 'Fetching...' : 'Fetch'}
            </Button>
          </CardBody>
        </Card>
      </Form>
    </Stack>
  )
}
