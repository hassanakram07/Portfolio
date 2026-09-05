'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquareQuote,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Signed out successfully')
      router.push('/admin/login')
      router.refresh()
    } catch {
      toast.error('Failed to sign out')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const NavLinks = () => (
    <div className="flex flex-col space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href, item.exact)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              active
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-4 py-3 sticky top-0 z-40">
        <Link href="/admin">
          <BrandLogo size="sm" subtitle="Admin Panel" />
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer / Desktop Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r border-border/40 bg-card/60 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <Link href="/admin" className="focus:outline-none">
            <BrandLogo size="md" subtitle="CMS & Control Panel" />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-1.5"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase px-3 mb-3">
            Menu
          </div>
          <NavLinks />

          <div className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase px-3 mt-8 mb-3">
            Shortcuts
          </div>
          <div className="flex flex-col space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            >
              <span className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 shrink-0" />
                <span>View Public Site</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border/40">
          <Button
            variant="outline"
            className="w-full justify-start gap-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 text-sm"
            onClick={handleSignOut}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
