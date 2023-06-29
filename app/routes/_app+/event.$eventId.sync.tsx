import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Grid,
  Heading,
  Stack,
} from '@chakra-ui/react'
import { type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { Form, useNavigation } from '@remix-run/react'
import React from 'react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppBreadcrumbs } from '~/components'
import { runLumaCrawlJob } from '~/jobs/luma-crawl-job.server'
import { getEventById, listLumaCrawlJobs } from '~/models'
import dayjs from '~/utils/dayjs'

export const loader = async ({ params }: LoaderArgs) => {
  const { eventId } = zx.parseParams(params, {
    eventId: z.string(),
  })

  const event = await getEventById(eventId)
  const jobs = await listLumaCrawlJobs(eventId)

  return typedjson({ event, jobs })
}

export const action = async ({ request }: ActionArgs) => {
  const { url } = await zx.parseForm(request, {
    url: z.string(),
  })

  // 同期的にクロール
  await runLumaCrawlJob(url)

  return typedjson({})
}

export default function EventSyncPage() {
  const { event, jobs } = useTypedLoaderData<typeof loader>()
  const navigation = useNavigation()

  return (
    <Stack>
      <AppBreadcrumbs
        items={[
          { label: 'Top', to: '/' },
          { label: event.name, to: `/event/${event.id}` },
          { label: 'Sync', isCurrentPage: true },
        ]}
      />

      <Stack>
        <Card>
          <CardBody>
            <Form method="POST">
              <input type="hidden" name="url" value={event.url}></input>
              <Button
                w="full"
                colorScheme="discord"
                type="submit"
                isLoading={navigation.state === 'submitting'}
                isDisabled={navigation.state !== 'idle'}
              >
                {navigation.state === 'submitting'
                  ? 'Syncing...'
                  : 'Start Sync'}
              </Button>
            </Form>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="sm" mb="4">
              Sync Logs
            </Heading>

            <Grid gridTemplateColumns="auto auto auto 1fr" gap="4">
              <Box
                fontSize="sm"
                color="gray.500"
                fontWeight="bold"
                textAlign="center"
                textTransform="uppercase"
              >
                CreatedAt
              </Box>
              <Box
                fontSize="sm"
                color="gray.500"
                fontWeight="bold"
                textAlign="center"
                textTransform="uppercase"
              >
                Duration
              </Box>
              <Box
                fontSize="sm"
                color="gray.500"
                fontWeight="bold"
                textAlign="center"
                textTransform="uppercase"
              >
                Status
              </Box>
              <Box
                fontSize="sm"
                color="gray.500"
                fontWeight="bold"
                textAlign="center"
                textTransform="uppercase"
              >
                Log
              </Box>

              {jobs.map((job) => {
                return (
                  <React.Fragment key={job.id}>
                    <Box>{dayjs(job.createdAt).format('YYYY-MM-DD HH:mm')}</Box>
                    <Box>
                      {dayjs
                        .duration(
                          dayjs(job.updatedAt).diff(dayjs(job.createdAt)),
                        )
                        .asSeconds()}{' '}
                      seconds
                    </Box>
                    <Box>
                      <Badge
                        colorScheme={job.status === 'DONE' ? 'blue' : 'gray'}
                      >
                        {job.status}
                      </Badge>
                    </Box>
                    <Box
                      overflow="auto"
                      fontSize="xs"
                      bg="black"
                      color="gray.200"
                      rounded="md"
                      p="4"
                    >
                      <pre>{JSON.stringify(job.logs, null, 2)}</pre>
                    </Box>
                  </React.Fragment>
                )
              })}
            </Grid>
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  )
}
