import { Alert, AlertIcon, Box, Center, Stack, Text } from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
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
  return (
    <Center>
      <Stack>
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
    </Center>
  )
}
