import { json, type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import React from 'react'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  Badge,
  Button,
  Card,
  CardContent,
  Heading,
  Stack,
} from '~/components/ui'
import { runLumaCrawlJob } from '~/jobs/luma-crawl-job.server'
import { getEventById, listLumaCrawlJobs } from '~/models'
import { emitter } from '~/services/emitter.server'
import dayjs from '~/utils/dayjs'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const event = await getEventById(eventId)
  const jobs = await listLumaCrawlJobs(eventId)

  return json({ event, jobs })
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
  emitter.emit('event', eventId) // イベント更新をリアルタイム通知

  return json({})
}

export default function EventSyncPage() {
  const { event, jobs } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  return (
    <Stack>
      <Card>
        <CardContent>
          <Form method="POST">
            <input type="hidden" name="url" value={event.url}></input>
            <Button
              className="w-full"
              type="submit"
              disabled={navigation.state !== 'idle'}
            >
              {navigation.state === 'submitting' ? 'Syncing...' : 'Start Sync'}
            </Button>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Heading className="mb-4" size="sm">
            Sync Logs
          </Heading>

          <div className="grid grid-cols-[auto_auto_auto_1fr] gap-4">
            <div className="text-center text-sm font-bold uppercase text-slate-500">
              CreatedAt
            </div>
            <div className="text-center text-sm font-bold uppercase text-slate-500">
              Duration
            </div>
            <div className="text-center text-sm font-bold uppercase text-slate-500">
              Status
            </div>
            <div className="text-center text-sm font-bold uppercase text-slate-500">
              Log
            </div>

            {jobs.map((job) => {
              return (
                <React.Fragment key={job.id}>
                  <div>{dayjs(job.createdAt).format('YYYY-MM-DD HH:mm')}</div>
                  <div>
                    {dayjs
                      .duration(dayjs(job.updatedAt).diff(dayjs(job.createdAt)))
                      .asSeconds()}{' '}
                    seconds
                  </div>
                  <div>
                    <Badge>{job.status}</Badge>
                  </div>
                  <div className="overflow-auto rounded bg-black p-4 text-xs text-slate-200">
                    <pre>{JSON.stringify(job.logs, null, 2)}</pre>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </Stack>
  )
}
