import { Outlet } from '@remix-run/react'
import { AppBreadcrumbs, AppFooter, AppHeader } from '~/components'
import { Stack } from '~/components/ui'
import { useAppBreadcrumbs } from '~/hooks/use-app-breadcrumbs'

export const handle = {
  breadcrumb: () => ({
    label: 'Top',
    to: `/`,
  }),
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
