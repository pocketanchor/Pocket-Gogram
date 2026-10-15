export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--color-kelp)" />
      <path d="M7 23c4-1 4-9 9-9s4 6 9-3" fill="none" stroke="var(--color-willow-grove)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="25" cy="11" r="3.5" fill="var(--color-whiskey)" />
      <circle cx="7" cy="23" r="2.5" fill="var(--color-tamarillo)" />
    </svg>
  )
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="size-8 ring-1 ring-white/15 rounded-lg" />
      <span className={`text-xl font-extrabold tracking-tight ${light ? 'text-paper' : 'text-kelp'}`}>
        gogram
      </span>
    </span>
  )
}
