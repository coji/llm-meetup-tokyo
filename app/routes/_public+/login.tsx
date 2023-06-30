import {
  Alert,
  AlertIcon,
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { useLoaderData, useLocation } from '@remix-run/react'
import { AppSignInButton } from '~/components/AppSignInButton'
import { authenticator } from '~/services/auth.server'
import { sessionStorage } from '~/services/session.server'

export const loader = async ({ request }: LoaderArgs) => {
  // ログイン時のエラーメッセージがもしあればそれを表示する
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie') || '',
  )

  const error = session.get(authenticator.sessionErrorKey) as
    | { message: string }
    | undefined

  return json(
    { errorMessage: error?.message },
    {
      // flash messageを削除するためにセッションを更新
      headers: new Headers({
        'Set-Cookie': await sessionStorage.commitSession(session),
      }),
    },
  )
}

export default function LoginPage() {
  const { errorMessage } = useLoaderData<typeof loader>()
  const location = useLocation()
  const returnTo = new URLSearchParams(location.search).get('returnTo')

  return (
    <Center>
      <Card>
        <CardHeader>
          <Heading size="md">サインイン</Heading>
        </CardHeader>
        <CardBody maxW="sm">
          <Stack>
            {returnTo && (
              <Text>
                このページを閲覧するには Discord
                アカウントのサインインが必要です。
              </Text>
            )}
            <AppSignInButton />

            {errorMessage && (
              <Alert variant="solid" rounded="md" status="error">
                <AlertIcon />
                <Box textAlign="left">
                  <Text fontWeight="bold">ログインできません</Text>
                  <Text>{errorMessage}</Text>
                </Box>
              </Alert>
            )}
          </Stack>
        </CardBody>
      </Card>
    </Center>
  )
}
