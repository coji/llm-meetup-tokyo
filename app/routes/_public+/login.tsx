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
import { returnToCookie, sessionStorage } from '~/services/session.server'

export const loader = async ({ request }: LoaderArgs) => {
  const headers = new Headers()

  // redirectTo
  const url = new URL(request.url)
  const returnTo = url.searchParams.get('returnTo')
  headers.append('Set-Cookie', await returnToCookie.serialize(returnTo))

  // ログイン時のエラーメッセージがもしあればそれを表示する
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie') || '',
  )
  const error = session.get(authenticator.sessionErrorKey) as
    | { message: string }
    | undefined
  // flash messageを削除するためにセッションを更新
  headers.append('Set-Cookie', await sessionStorage.commitSession(session))

  return json({ errorMessage: error?.message }, { headers })
}

export default function LoginPage() {
  const { errorMessage } = useLoaderData<typeof loader>()
  const location = useLocation()
  const returnTo = new URLSearchParams(location.search).get('returnTo')

  return (
    <Center h="full">
      <Card>
        <CardHeader pb="0">
          <Heading size="md">サインイン</Heading>
        </CardHeader>
        <CardBody maxW="sm">
          <Stack>
            {returnTo && (
              <Text>
                このページを閲覧するには LLM Meetup Tokyo サーバに参加している
                Discord アカウントのサインインが必要です。
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
