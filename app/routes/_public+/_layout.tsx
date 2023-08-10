import { Outlet } from '@remix-run/react'
import { AppBreadcrumbs, AppFooter, AppHeader } from '~/components'
import { Stack } from '~/components/ui'

export default function AppLayout() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <AppHeader title="LLM Meetup Tokyo" to="/" />
      <Stack className="container gap-0 bg-slate-200">
        <AppBreadcrumbs items={[{ label: 'Top', isCurrentPage: true }]} />
        <Outlet />
      </Stack>
      <AppFooter />
    </div>
  )
}
