import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ArrowUpRight, Navigation, Search, Sparkles, Stamp } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { RouteCard } from '@/components/RouteCard'
import {
  CATEGORY_LABELS,
  TRANSPORT_LABELS,
  currentUser,
  routes,
  type RouteCategory,
  type TransportMode,
} from '@/data/fixtures'
import { img } from '@/lib/img'

export const Route = createFileRoute('/feed')({
  head: () => ({ meta: [{ title: 'Route feed · Gogram' }] }),
  component: Feed,
})

type SortKey = 'trending' | 'newest' | 'conquered'

function Feed() {
  const [category, setCategory] = useState<RouteCategory | 'all'>('all')
  const [mode, setMode] = useState<TransportMode | 'all'>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('trending')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = routes.filter(
      (r) =>
        (category === 'all' || r.category === category) &&
        (mode === 'all' || r.transportMode === mode) &&
        (!q || `${r.title} ${r.city} ${r.country}`.toLowerCase().includes(q)),
    )
    const by: Record<SortKey, (a: (typeof list)[0], b: (typeof list)[0]) => number> = {
      trending: (a, b) => b.likes - a.likes,
      newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
      conquered: (a, b) => b.completionCount - a.completionCount,
    }
    return [...list].sort(by[sort])
  }, [category, mode, query, sort])

  const reset = () => {
    setCategory('all')
    setMode('all')
    setQuery('')
  }

  return (
    <div className="grain min-h-screen">
      <AppHeader />

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <main>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs tracking-[0.25em] text-willow uppercase">Movement feed</p>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-kelp sm:text-5xl">
                Where people are walking
              </h1>
            </div>
            <label className="flex items-center gap-2 rounded-full border border-kelp/15 bg-white px-4 py-2.5 focus-within:border-willow focus-within:ring-2 focus-within:ring-willow/25 sm:w-72">
              <Search className="size-4 text-lavender" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="City, country or route"
                className="w-full bg-transparent text-sm text-kelp outline-none placeholder:text-lavender/70"
              />
            </label>
          </div>

          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            <Chip active={category === 'all'} onClick={() => setCategory('all')}>
              All routes
            </Chip>
            {(Object.keys(CATEGORY_LABELS) as RouteCategory[]).map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                {CATEGORY_LABELS[c]}
              </Chip>
            ))}
          </div>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(['all', ...Object.keys(TRANSPORT_LABELS)] as (TransportMode | 'all')[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] tracking-wider uppercase transition ${
                    mode === m ? 'bg-willow text-white' : 'text-lavender hover:bg-paper-deep'
                  }`}
                >
                  {m === 'all' ? 'Any mode' : TRANSPORT_LABELS[m]}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-kelp/15 bg-white px-3 py-1.5 text-xs font-semibold text-kelp outline-none focus:ring-2 focus:ring-willow/30"
              aria-label="Sort routes"
            >
              <option value="trending">Trending</option>
              <option value="newest">Newest</option>
              <option value="conquered">Most conquered</option>
            </select>
          </div>

          {visible.length ? (
            <div className="grid gap-8 md:grid-cols-2">
              {visible.map((r, i) => (
                <RouteCard key={r.routeId} route={r} index={i} />
              ))}
            </div>
          ) : (
            <div className="topo grid place-items-center rounded-[28px] border border-dashed border-kelp/25 px-6 py-20 text-center">
              <svg viewBox="0 0 120 40" className="mb-4 w-40" aria-hidden="true">
                <path d="M5 30 C 30 5, 50 35, 70 18 S 105 10, 115 25" fill="none" stroke="var(--color-willow-grove)" strokeWidth="3" strokeDasharray="3 6" strokeLinecap="round" />
                <circle cx="5" cy="30" r="4" fill="var(--color-whiskey)" />
                <circle cx="115" cy="25" r="4" fill="var(--color-dusty-lavender)" />
              </svg>
              <p className="text-xl font-bold text-kelp">No trail here yet</p>
              <p className="mt-1 max-w-sm font-serif text-ink/70">
                Nobody has recorded a route matching those filters. Be the first to drop the pins.
              </p>
              <button onClick={reset} className="mt-5 rounded-full bg-kelp px-5 py-2 text-sm font-bold text-paper hover:bg-kelp/90">
                Clear filters
              </button>
            </div>
          )}
        </main>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <PassportCard />
          <MarketplaceTeaser />
        </aside>
      </div>

      <Link
        to="/routes/$routeId"
        params={{ routeId: visible[0]?.routeId ?? routes[0].routeId }}
        search={{ tab: 'map', play: true }}
        className="fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full bg-[var(--brand-cta-urgent)] px-6 py-4 font-extrabold text-white shadow-[0_18px_40px_-12px_rgba(156,13,15,0.7)] transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
      >
        <Navigation className="size-5 fill-white" /> Start Route
      </Link>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
        active
          ? 'border-kelp bg-kelp text-paper'
          : 'border-kelp/15 bg-white text-kelp hover:border-kelp/40'
      }`}
    >
      {children}
    </button>
  )
}

function PassportCard() {
  const p = currentUser.passport
  const impact = Math.round(p.borderCrossings + p.kmWalked + p.routesConquered)
  return (
    <section className="bg-cinematic relative overflow-hidden rounded-[28px] p-6 text-paper">
      <Stamp className="absolute -top-4 -right-4 size-32 rotate-12 text-white/5" />
      <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-whiskey uppercase">
        <Sparkles className="size-3.5" /> Digital passport
      </p>
      <p className="mt-3 font-serif text-2xl leading-snug">
        You crossed <b className="font-display text-whiskey not-italic">{p.borderCrossings} national borders</b> and
        completed <b className="font-display text-whiskey">{p.routesConquered} community routes</b> this {p.month}.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        {[
          ['Borders', p.borderCrossings],
          ['Km walked', p.kmWalked],
          ['Conquered', p.routesConquered],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white/8 px-2 py-3 ring-1 ring-white/10">
            <p className="text-2xl font-extrabold">{value}</p>
            <p className="font-mono text-[10px] tracking-wider text-paper/60 uppercase">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
        <span className="font-mono text-[11px] tracking-wider text-paper/70 uppercase">User impact</span>
        <span className="text-2xl font-extrabold text-whiskey">{impact}</span>
      </div>
      <div className="mt-4 flex gap-1.5">
        {p.countries.map((c) => (
          <span key={c} className="rounded-md border border-whiskey/40 px-2 py-1 font-mono text-[11px] text-whiskey">
            {c}
          </span>
        ))}
      </div>
    </section>
  )
}

function MarketplaceTeaser() {
  const items = [
    ['Room offered', 'Lisbon · Graça · €410/mo', 'from @joao.walks'],
    ['House swap', 'Budapest flat ⇄ Mexico City', 'Nov 3 – Dec 1'],
    ['Hostel gig', 'Reception · El Calafate', '20h/wk → free bed'],
  ]
  return (
    <section className="overflow-hidden rounded-[28px] border border-kelp/10 bg-white">
      <div className="relative h-32">
        <img src={img('hostel', 700)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-kelp via-kelp/50 to-transparent" />
        <p className="absolute bottom-3 left-5 text-lg font-extrabold text-paper">Community board</p>
      </div>
      <ul className="divide-y divide-kelp/10 px-5">
        {items.map(([type, title, meta]) => (
          <li key={title} className="py-3">
            <p className="font-mono text-[10px] tracking-widest text-tamarillo uppercase">{type}</p>
            <p className="text-sm font-bold text-kelp">{title}</p>
            <p className="text-xs text-lavender">{meta}</p>
          </li>
        ))}
      </ul>
      <p className="flex items-center justify-between bg-paper px-5 py-3 text-xs font-semibold text-lavender">
        Housing, swaps & gigs open soon <ArrowUpRight className="size-3.5" />
      </p>
    </section>
  )
}
