import { Link } from '@remix-run/react'
import React from 'react'

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
    <nav className="inline-flex text-sm">
      <ul className="inline-flex gap-2">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <li>
              {item.to && !item.isCurrentPage ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                item.label
              )}
            </li>
            {idx < items.length - 1 && <li>/</li>}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  )
}
