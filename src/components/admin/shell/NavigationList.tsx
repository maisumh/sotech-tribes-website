'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/admin/login/actions'

type NavItem = { href: string; label: string }
type NavSection = { label: string; items: NavItem[] }

const NAV: NavSection[] = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard' }],
  },
  {
    label: 'Community',
    items: [
      { href: '/admin/users', label: 'Users' },
      { href: '/admin/want-have', label: 'Wants & Haves' },
      { href: '/admin/matches', label: 'Matches' },
      { href: '/admin/offers', label: 'Offers' },
    ],
  },
  {
    label: 'Moderation',
    items: [
      { href: '/admin/chat', label: 'Chats' },
      { href: '/admin/ratings', label: 'Ratings' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/notifications', label: 'Notifications' },
      { href: '/admin/activity', label: 'Activity log' },
    ],
  },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(href + '/')
}

/**
 * Dumb navigation list used inside both the desktop persistent sidebar
 * and the mobile slide-in drawer. Knows nothing about layout.
 */
export function NavigationList({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Brand mark */}
      <div className="px-7 pt-8 pb-10 lg:pt-10 lg:pb-14">
        <div className="text-[10px] uppercase tracking-[0.22em] text-casablanca">
          Tribes
        </div>
        <div className="mt-1 text-[22px] font-extralight leading-none">
          Admin
        </div>
      </div>

      {/* Nav sections */}
      <nav
        aria-label="Admin navigation"
        className="flex-1 px-4 pb-4 overflow-y-auto overscroll-contain"
      >
        {NAV.map((section) => (
          <div key={section.label} className="mb-7">
            <div className="px-3 mb-2.5 text-[9px] uppercase tracking-[0.22em] text-offwhite/35">
              {section.label}
            </div>
            <ul>
              {section.items.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center min-h-[44px] pl-3 pr-3 text-[14px] font-light transition-colors duration-200 rounded-sm ${
                        active
                          ? 'text-offwhite'
                          : 'text-offwhite/55 hover:text-offwhite active:bg-offwhite/5'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-[14px] w-[2px] bg-casablanca transition-all duration-200 ${
                          active
                            ? 'opacity-100 scale-y-100'
                            : 'opacity-0 scale-y-50 group-hover:opacity-50'
                        }`}
                      />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sign-in footer */}
      <div className="px-7 py-6 border-t border-offwhite/10 shrink-0">
        <div className="text-[9px] uppercase tracking-[0.22em] text-offwhite/35 mb-1.5">
          Signed in as
        </div>
        <div className="text-[12.5px] font-light text-offwhite/90 truncate mb-4">
          {userEmail}
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="min-h-[44px] inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-offwhite/50 hover:text-casablanca active:text-casablanca transition-colors duration-200"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
