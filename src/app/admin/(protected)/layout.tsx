import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth/require-admin'
import { Sidebar } from '@/components/admin/Sidebar'

export const metadata: Metadata = {
  title: 'Tribes Admin',
  description: 'Internal admin panel for the Tribes community.',
  robots: { index: false, follow: false },
}

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAdmin()

  return (
    <div className="min-h-screen flex bg-offwhite text-ink">
      <Sidebar userEmail={user.email ?? user.id} />
      <main className="flex-1 min-w-0">
        <div className="max-w-[1280px] px-14 py-14">{children}</div>
      </main>
    </div>
  )
}
