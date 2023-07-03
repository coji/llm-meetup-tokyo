import {
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { zx } from 'zodix'
import { requireUser } from '~/services/auth.server'

interface Message {
  postedAt: string
  message: string
}
const messageLog: Message[] = []

export const loader = ({ request }: ActionArgs) => {
  return json({ messageLog })
}

export const action = async ({ request }: ActionArgs) => {
  const { message } = await zx.parseForm(request, {
    message: z.string(),
  })
  const user = await requireUser(request)

  if (message !== '') {
    messageLog.push({
      postedAt: new Date().toISOString(),
      message,
    })
    await fetch(
      'https://discord.com/api/webhooks/1124706541484920853/IAJ7I2-oWS8EO3nL-x1kOu1aYMy0bjaq5xbWBG33qBA41j2Vpg2YRu301fgy3WwhA7G_',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message, username: user.displayName }),
      },
    )
  }

  return json({ messageLog })
}

export default function TestPage() {
  const navigation = useNavigation()
  const formRef = useRef<HTMLFormElement>(null)
  const messageRef = useRef<HTMLInputElement>(null)
  const { messageLog } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (navigation.state === 'idle' && !!messageRef.current?.value) {
      messageRef.current?.focus()
      formRef.current?.reset()
    }
  }, [navigation.state])

  return (
    <Stack>
      <Card>
        <CardBody>
          <Flex direction="column">
            {messageLog.map((message, i) => {
              return (
                <HStack key={i}>
                  <Text flex="1">{message.message}</Text>
                </HStack>
              )
            })}
          </Flex>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Form method="POST" replace ref={formRef}>
            <Stack>
              <FormControl isDisabled={navigation.state === 'submitting'}>
                <FormLabel>メッセージ</FormLabel>
                <Input ref={messageRef} autoFocus name="message" type="text" />
              </FormControl>

              <Button
                type="submit"
                isLoading={navigation.state === 'submitting'}
              >
                Send
              </Button>
            </Stack>
          </Form>
        </CardBody>
      </Card>
    </Stack>
  )
}
