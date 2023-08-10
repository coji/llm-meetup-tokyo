import { json, type LoaderArgs } from '@remix-run/node'
import { useLoaderData, useLocation } from '@remix-run/react'
import { AppSignInButton } from '~/components/AppSignInButton'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  Center,
  Heading,
  Stack,
} from '~/components/ui'
import { authenticator } from '~/services/auth.server'
import { returnToCookie, sessionStorage } from '~/services/session.server'

export const handle = {
  breadcrumb: () => ({
    label: 'サインイン',
  }),
}

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
    <Center className="h-full">
      <Card className="max-w-md">
        <CardHeader>
          <Heading size="md">サインイン</Heading>
        </CardHeader>
        <CardContent>
          <Stack>
            {returnTo && (
              <p className="text-sm">
                このページを閲覧するには LLM Meetup Tokyo サーバに参加している
                Discord アカウントでのサインインが必要です。
              </p>
            )}
            <AppSignInButton />

            {errorMessage && (
              <Alert>
                <AlertTitle>サインインできません</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Center>
  )
}
