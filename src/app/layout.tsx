import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { PersonJsonLd } from '@/components/seo/JsonLd'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hassanakram.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Hassan Akram — AI & Automation Engineer',
    template: '%s | Hassan Akram',
  },
  description:
    'Freelance developer specializing in AI/ML solutions, workflow automation (n8n), CRM integrations (HubSpot), and full-stack web applications. Turning complex business problems into elegant automated systems.',
  keywords: [
    'AI developer',
    'ML engineer',
    'workflow automation',
    'n8n',
    'HubSpot integration',
    'CRM developer',
    'full-stack developer',
    'AI chatbot',
    'RAG pipeline',
    'freelance developer',
    'Next.js',
    'Python',
  ],
  authors: [{ name: 'Hassan Akram' }],
  creator: 'Hassan Akram',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Hassan Akram — AI & Automation Engineer',
    title: 'Hassan Akram — AI & Automation Engineer',
    description:
      'Freelance developer specializing in AI/ML solutions, workflow automation, CRM integrations, and full-stack applications.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hassan Akram — AI & Automation Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hassan Akram — AI & Automation Engineer',
    description:
      'Freelance developer specializing in AI/ML solutions, workflow automation, CRM integrations, and full-stack applications.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <PersonJsonLd />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '12px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
