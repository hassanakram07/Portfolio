'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false)
      return
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
          router.replace('/admin/login')
          return
        }
        const data = await res.json()
        if (data.authenticated) {
          setAuthorized(true)
        } else {
          router.replace('/admin/login')
        }
      } catch {
        router.replace('/admin/login')
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [pathname, isLoginPage, router])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <h2 className="font-heading text-base font-semibold">Verifying Admin Access</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Confirming authenticated local session...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
