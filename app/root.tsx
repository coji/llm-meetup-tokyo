import { ChakraProvider, Progress } from '@chakra-ui/react'
import { json, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from '@remix-run/react'
import { createHead } from 'remix-island'
import { authenticator } from './services/auth.server'
import { keepAwake } from './services/shrink-to-zero.server'
import { theme } from './theme'

export const meta: V2_MetaFunction = () => [
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { title: 'LLM Meetup Tokyo' },
  { name: 'description', content: 'Meetup Assistant' },
]

export const loader = async ({ request }: LoaderArgs) => {
  keepAwake()
  const sessionUser = await authenticator.isAuthenticated(request)
  return json({
    user: sessionUser,
  })
}

export const Head = createHead(() => (
  <>
    <Meta />
    <Links />
  </>
))

export default function App() {
  const navigation = useNavigation()

  return (
    <>
      <Head />
      <ChakraProvider resetCSS theme={theme}>
        <>
          {navigation.state !== 'idle' && (
            <Progress
              size="xs"
              colorScheme="discord"
              isIndeterminate
              position="fixed"
              top="0"
              left="0"
              right="0"
            />
          )}
          <Outlet />
        </>
      </ChakraProvider>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}
