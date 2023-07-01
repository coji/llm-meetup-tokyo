import {
  Button,
  Card,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useNavigation } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'

export const action = async ({ request }: ActionArgs) => {
  const { message } = await zx.parseForm(request, {
    message: z.string(),
  })

  if (message !== '') {
    await fetch(
      'https://discord.com/api/webhooks/1124706541484920853/IAJ7I2-oWS8EO3nL-x1kOu1aYMy0bjaq5xbWBG33qBA41j2Vpg2YRu301fgy3WwhA7G_',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          username: 'coji ',
        }),
      },
    )
  }
  return json({})
}

export default function TestPage() {
  const navigation = useNavigation()

  return (
    <Container>
      <Form method="POST" reloadDocument>
        <Card>
          <CardBody>
            <Stack>
              <FormControl>
                <FormLabel>メッセージ</FormLabel>
                <Input name="message" />
              </FormControl>

              <Button
                type="submit"
                isLoading={navigation.state === 'submitting'}
              >
                Send
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </Form>
    </Container>
  )
}
