import { redirect, type ActionArgs } from '@remix-run/node'
import { Form, useNavigation } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppBreadcrumbs } from '~/components'
import { Button, Card, CardContent, Input, Label, Stack } from '~/components/ui'
import { runLumaCrawlJob } from '~/jobs/luma-crawl-job.server'

export const action = async ({ request }: ActionArgs) => {
  const { url } = await zx.parseForm(request, {
    url: z.string(),
  })

  // 同期的にクロール
  const event = await runLumaCrawlJob(url)
  if (!event) {
    throw new Error('Failed to crawl event')
  }

  return redirect(`/event/${event.id}`)
}

export default function EventImportPage() {
  const navigation = useNavigation()

  return (
    <Stack>
      <AppBreadcrumbs
        items={[
          { label: 'Admin', to: '/admin' },
          { label: 'Import', isCurrentPage: true },
        ]}
      />

      <Form method="POST">
        <Card>
          <CardContent>
            <Stack>
              <fieldset>
                <Label>URL</Label>
                <Input type="text" name="url" defaultValue="https://lu.ma/" />
              </fieldset>

              <Button type="submit" disabled={navigation.state !== 'idle'}>
                {navigation.state === 'submitting' ? 'Importing...' : 'Import'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Form>
    </Stack>
  )
}
