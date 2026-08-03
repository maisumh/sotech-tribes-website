'use client'

import { usePathname } from 'next/navigation'
import { TribesLogo } from '@/components/admin/brand/TribesLogo'

// Map route prefixes to the section title shown in the mobile top bar.
// Order matters: longer/more-specific paths first.
const SECTION_TITLES: Array<[string, string]> = [
  ['/admin/users', 'Users'],
  ['/admin/want-have', 'Wants & Haves'],
  ['/admin/matches', 'Matches'],
  ['/admin/offers', 'Offers'],
  ['/admin/trades', 'Trades'],
  ['/admin/reports', 'Reports'],
  ['/admin/v2-chats', 'v2 Chats'],
  ['/admin/chat', 'Chats'],
  ['/admin/ratings', 'Ratings'],
  ['/admin/feedback', 'Feedback'],
  ['/admin/showcase', 'Showcase'],
  ['/admin/rollout/waitlist', 'Waitlist leads'],
  ['/admin/rollout', 'Rollout'],
  ['/admin/v2-notifications', 'v2 Notifications'],
  ['/admin/notifications', 'Notifications'],
  ['/admin/activity', 'Activity log'],
  ['/admin', 'Dashboard'],
]

function sectionTitle(pathname: string): string {
  for (const [prefix, title] of SECTION_TITLES) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return title
    }
  }
  return 'Admin'
}

/**
 * Mobile-only top bar with hamburger button, section title, and a small
 * brand mark on the right. Visible below lg breakpoint.
 */
export function MobileTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const title = sectionTitle(pathname)

  return (
    <div className="lg:hidden sticky top-0 z-30 bg-offwhite/95 backdrop-blur-md border-b border-granny/15 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between h-14 px-5">
        {/* Hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="-ml-2 inline-flex items-center justify-center w-11 h-11 text-ink active:bg-granny/10 rounded-sm transition-colors"
        >
          <MenuIcon />
        </button>

        {/* Section title */}
        <div className="text-[13px] font-light tracking-[0.02em] text-ink truncate flex-1 text-center px-3">
          {title}
        </div>

        {/* Brand mark (right) — purely decorative, keeps layout balanced */}
        <div className="w-11 flex justify-end">
          <TribesLogo className="w-7 h-7 text-firefly" />
        </div>
      </div>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      aria-hidden
    >
      <line x1="3" y1="6" x2="17" y2="6" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="14" x2="17" y2="14" />
    </svg>
  )
}
