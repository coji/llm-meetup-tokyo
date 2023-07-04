import { useMatches } from '@remix-run/react'

export const useAppBreadcrumbs = () => {
  const matches = useMatches()
  const breadcrumbMatches = matches.filter((match) => match.handle?.breadcrumb)
  const breadcrumbs = breadcrumbMatches.map((match) => {
    console.log(match)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return match.handle?.breadcrumb(match.data)
  }) as { label: string; to: string }[]
  return breadcrumbs
}
