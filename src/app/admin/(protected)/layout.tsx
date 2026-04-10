import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth/require-admin'
import { AdminShell } from '@/components/admin/shell/AdminShell'

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

  return <AdminShell userEmail={user.email ?? user.id}>{children}</AdminShell>
}
