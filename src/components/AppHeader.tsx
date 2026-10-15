import { Link } from '@tanstack/react-router'
import { Compass, Home, Map, Stamp } from 'lucide-react'
import { Wordmark } from './Logo'

const NAV = [
  { to: '/feed', label: 'Routes', icon: Map, live: true },
  { to: '/feed', label: 'Community', icon: Home, live: false },
  { to: '/feed', label: 'Passport', icon: Stamp, live: false },
] as const

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-navigation)] text-paper shadow-[0_1px_0_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5">
        <Link to="/" aria-label="Gogram home">
          <Wordmark light />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map(({ to, label, icon: Icon, live }) =>
            live ? (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-paper/80 transition hover:bg-white/10 hover:text-paper"
                activeProps={{ className: 'bg-white/10 !text-paper' }}
              >
                <Icon className="size-4" /> {label}
              </Link>
            ) : (
              <span
                key={label}
                className="flex cursor-default items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#A9A3B8]"
                title="Coming soon"
              >
                <Icon className="size-4" /> {label}
                <span className="rounded-full bg-lavender/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-paper/80">
                  soon
                </span>
              </span>
            ),
          )}
        </nav>
        <Link
          to="/feed"
          className="flex items-center gap-2 rounded-full bg-whiskey px-4 py-2 text-sm font-bold text-kelp transition hover:brightness-105 active:scale-[0.98]"
        >
          <Compass className="size-4" /> Explore routes
        </Link>
      </div>
    </header>
  )
}
