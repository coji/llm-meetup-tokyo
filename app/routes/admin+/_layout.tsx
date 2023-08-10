import { json, type LoaderArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { AppBreadcrumbs, AppFooter, AppHeader } from '~/components'
import { Stack } from '~/components/ui'
import { useAppBreadcrumbs } from '~/hooks/use-app-breadcrumbs'
import { authenticator } from '~/services/auth.server'

export const handle = {
  breadcrumb: () => ({
    label: 'Admin',
    to: `/admin`,
  }),
}
export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: '/' })
  return json({})
}

export default function AdminIndexPage() {
  const breadcrumbs = useAppBreadcrumbs()
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <AppHeader title="LLM Meetup Tokyo Admin" to="/admin" />
      <Stack className="container gap-0 bg-slate-200">
        <AppBreadcrumbs items={breadcrumbs} />
        <Outlet />
      </Stack>
      <AppFooter />
    </div>
  )
}
