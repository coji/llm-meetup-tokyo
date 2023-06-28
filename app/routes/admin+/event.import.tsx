import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react'
import { redirect, type ActionArgs } from '@remix-run/node'
import { Form, useNavigation } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppBreadcrumbs } from '~/components'
import { runLumaCrawlJob } from '~/jobs/luma-crawl-job.server'

export const action = async ({ request }: ActionArgs) => {
  const { url } = await zx.parseForm(request, {
    url: z.string(),
  })

  // 同期的にクロール
  await runLumaCrawlJob(url)

  return redirect('..')
}

export default function EventImportPage() {
  const navigation = useNavigation()

  return (
    <Stack>
      <AppBreadcrumbs
        items={[
          { label: 'Top', to: '/' },
          { label: 'Import', isCurrentPage: true },
        ]}
      />

      <Form method="POST">
        <Card>
          <CardBody>
            <Stack>
              <FormControl>
                <FormLabel>URL</FormLabel>
                <Input type="text" name="url" />
                <FormErrorMessage></FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                isLoading={navigation.state === 'submitting'}
                isDisabled={navigation.state !== 'idle'}
              >
                {navigation.state === 'submitting' ? 'Importing...' : 'Import'}
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </Form>
    </Stack>
  )
}