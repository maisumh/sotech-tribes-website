'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { NavigationList } from './NavigationList'
import { MobileTopBar } from './MobileTopBar'

/**
 * Responsive admin shell.
 *
 * - Desktop (≥lg): persistent left sidebar, no top bar.
 * - Mobile (<lg):  top bar with hamburger button, slide-in drawer via Radix Dialog.
 *
 * The drawer auto-closes on route change (via usePathname effect) so tapping
 * a nav link navigates and dismisses in one gesture.
 */
export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string
  children: React.ReactNode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-offwhite text-ink lg:flex">
      {/* Desktop persistent sidebar */}
      <aside
        aria-label="Admin sidebar"
        className="hidden lg:block sticky top-0 h-screen w-[240px] shrink-0 bg-firefly text-offwhite"
      >
        <NavigationList userEmail={userEmail} />
      </aside>

      {/* Mobile drawer (Radix Dialog) + top bar */}
      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        {/* Top bar visible only below lg */}
        <MobileTopBar onMenuClick={() => setDrawerOpen(true)} />

        <Dialog.Portal>
          {/* Overlay — dims background content */}
          <Dialog.Overlay
            className="lg:hidden fixed inset-0 bg-ink/60 backdrop-blur-sm z-40 transition-opacity duration-300 data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
          />

          {/* Drawer itself — slides in from the left */}
          <Dialog.Content
            aria-describedby={undefined}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-firefly text-offwhite shadow-[0_0_60px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-out data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full focus:outline-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          >
            <Dialog.Title className="sr-only">Admin navigation</Dialog.Title>

            {/* Close button — top-right corner of the drawer */}
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="absolute top-4 right-4 w-10 h-10 inline-flex items-center justify-center text-offwhite/70 hover:text-offwhite active:bg-offwhite/5 rounded-sm transition-colors"
              >
                <CloseIcon />
              </button>
            </Dialog.Close>

            <NavigationList userEmail={userEmail} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Main content area */}
      <main className="flex-1 min-w-0 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-[1280px] px-5 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-14">
          {children}
        </div>
      </main>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      aria-hidden
    >
      <line x1="3" y1="3" x2="15" y2="15" />
      <line x1="15" y1="3" x2="3" y2="15" />
    </svg>
  )
}
