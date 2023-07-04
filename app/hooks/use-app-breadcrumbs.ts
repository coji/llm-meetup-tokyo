/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useMatches } from '@remix-run/react'

export const useAppBreadcrumbs = () => {
  const matches = useMatches()
  const breadcrumbMatches = matches.filter((match) => match.handle?.breadcrumb)
  const breadcrumbs = breadcrumbMatches.map((match, idx) => {
    return {
      ...match.handle?.breadcrumb(match.data),
      isCurrentPage: idx === breadcrumbMatches.length - 1,
    }
  }) as { label: string; to: string }[]
  return breadcrumbs
}
