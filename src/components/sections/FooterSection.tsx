import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Linkedin } from '@/components/ui/icons'
import { SOCIAL_LINKS } from '@/types'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#projects', label: 'Work' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
]

export function FooterSection() {
  return (
    <footer className="border-t border-border/40 bg-background/60 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl px-4 py-10 sm:py-12">
        {/* Main Row: Nav links and Social pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2.5 text-xs sm:text-sm font-medium text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social pills */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href={
                SOCIAL_LINKS.linkedin.startsWith('http')
                  ? SOCIAL_LINKS.linkedin
                  : `https://${SOCIAL_LINKS.linkedin}`
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-card hover:text-foreground shadow-sm"
              id="footer-linkedin"
            >
              <Linkedin className="h-3.5 w-3.5 text-primary" />
              <span>LinkedIn</span>
            </Link>

            <Link
              href={`mailto:${SOCIAL_LINKS.email}`}
              aria-label="Email"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-card hover:text-foreground shadow-sm"
              id="footer-email"
            >
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span>Email</span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 sm:my-8 h-px w-full bg-border/40" />

        {/* Bottom Bar: Copyright & Live Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <p>© {new Date().getFullYear()} All rights reserved.</p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for new projects
          </div>
        </div>
      </div>
    </footer>
  )
}
