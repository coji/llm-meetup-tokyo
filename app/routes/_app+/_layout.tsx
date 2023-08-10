import { json, type LoaderArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { AppBreadcrumbs, AppFooter, AppHeader } from '~/components'
import { Stack } from '~/components/ui'
import { useAppBreadcrumbs } from '~/hooks/use-app-breadcrumbs'
import { requireUser } from '~/services/auth.server'

export const handle = {
  breadcrumb: () => ({
    label: 'Top',
    to: `/`,
  }),
}
export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request)
  return json({})
}

export default function AppLayout() {
  const breadcrumbs = useAppBreadcrumbs()

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <AppHeader title="LLM Meetup Tokyo" to="/" />
      <Stack className="container gap-0 bg-slate-200">
        <AppBreadcrumbs items={breadcrumbs} />
        <Outlet />
      </Stack>
      <AppFooter />
    </div>
  )
}
