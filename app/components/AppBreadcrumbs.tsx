import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import { Link as RemixLink } from '@remix-run/react'

interface AppBreadcrumbItem {
  label: string
  to?: string
  isCurrentPage?: boolean
}
interface AppBreadcrumbsProps {
  items: AppBreadcrumbItem[]
}
export const AppBreadcrumbs = ({ items }: AppBreadcrumbsProps) => {
  return (
    <Breadcrumb>
      {items.map((item, idx) => {
        return (
          <BreadcrumbItem key={idx} isCurrentPage={item.isCurrentPage}>
            <BreadcrumbLink as={RemixLink} to={item.to}>
              {item.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}
