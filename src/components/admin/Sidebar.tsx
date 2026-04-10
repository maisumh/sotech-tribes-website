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

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 h-screen w-[240px] shrink-0 bg-firefly text-offwhite flex flex-col">
      {/* Brand mark */}
      <div className="px-8 pt-10 pb-14">
        <div className="text-[10px] uppercase tracking-[0.22em] text-casablanca">
          Tribes
        </div>
        <div className="mt-1 text-[22px] font-extralight leading-none">
          Admin
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-5 overflow-y-auto">
        {NAV.map((section) => (
          <div key={section.label} className="mb-9">
            <div className="px-3 mb-3 text-[9px] uppercase tracking-[0.22em] text-offwhite/35">
              {section.label}
            </div>
            <ul>
              {section.items.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative block py-[7px] pl-3 pr-3 text-[13.5px] font-light transition-colors duration-200 ${
                        active
                          ? 'text-offwhite'
                          : 'text-offwhite/55 hover:text-offwhite'
                      }`}
                    >
                      <span
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

      {/* Sign-in info + sign out */}
      <div className="px-8 py-7 border-t border-offwhite/10">
        <div className="text-[9px] uppercase tracking-[0.22em] text-offwhite/35 mb-1.5">
          Signed in as
        </div>
        <div className="text-[12.5px] font-light text-offwhite/90 truncate mb-4">
          {userEmail}
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="text-[11px] uppercase tracking-[0.18em] text-offwhite/50 hover:text-casablanca transition-colors duration-200"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
