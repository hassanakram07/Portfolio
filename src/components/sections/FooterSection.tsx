export function FooterSection() {
  return (
    <footer className="border-t border-border/30 bg-background/40 py-6">
      <div className="container mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  )
}
