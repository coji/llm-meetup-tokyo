import { ChakraProvider } from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { json, type V2_MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { createHead } from 'remix-island'
import { authenticator } from './services/auth.server'
import { keepAwake } from './services/shrink-to-zero.server'

export const meta: V2_MetaFunction = () => [
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { title: 'App' },
  { name: 'description', content: 'Awesome App.' },
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
  return (
    <>
      <Head />
      <ChakraProvider resetCSS>
        <Outlet />
      </ChakraProvider>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}
