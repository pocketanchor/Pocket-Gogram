import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Clapperboard,
  Coins,
  Crosshair,
  Footprints,
  Lightbulb,
  Map as MapIcon,
  MapPin,
  Navigation,
  Pause,
  Play,
  RotateCcw,
  Ruler,
  Star,
  Timer,
  Trophy,
  X,
} from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { Avatar } from '@/components/Avatar'
import { RouteMap } from '@/components/RouteMap'
import {
  CATEGORY_LABELS,
  TRANSPORT_LABELS,
  routeById,
  userById,
  type BorderCrossing,
  type Review,
  type Route as GogramRoute,
  type Waypoint,
} from '@/data/fixtures'
import { formatCoord, formatDistance, formatDuration } from '@/lib/geo'
import { img } from '@/lib/img'
import { PROXIMITY_METERS, useRoutePlayer } from '@/lib/player'

const TABS = ['map', 'journal', 'reel', 'reviews'] as const
type Tab = (typeof TABS)[number]

export const Route = createFileRoute('/routes/$routeId')({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab; play?: boolean } => ({
    tab: TABS.includes(search.tab as Tab) ? (search.tab as Tab) : undefined,
    play: search.play === true || search.play === 'true' ? true : undefined,
  }),
  loader: ({ params }) => {
    const route = routeById(params.routeId)
    if (!route) throw notFound()
    return { title: route.title, tagline: route.tagline }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · Gogram` },
          { name: 'description', content: loaderData.tagline },
        ]
      : [],
  }),
  component: RouteDetail,
  notFoundComponent: RouteNotFound,
})

function RouteDetail() {
  const { routeId } = Route.useParams()
  const { tab = 'map', play } = Route.useSearch()
  const route = routeById(routeId)!
  const creator = userById(route.creatorId)
  const player = useRoutePlayer(route)
  const navigate = Route.useNavigate()

  useEffect(() => {
    if (play) player.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startRoute = () => {
    if (tab !== 'map') navigate({ search: { tab: 'map' }, replace: true })
    player.start()
    if (typeof window !== 'undefined') document.getElementById('route-tabs')?.scrollIntoView({ behavior: 'smooth' })
  }

  const avg = route.reviews.length
    ? route.reviews.reduce((a, r) => a + r.rating, 0) / route.reviews.length
    : 0

  return (
    <div className="grain min-h-screen">
      <AppHeader />

      {/* Journal hero */}
      <section className="relative overflow-hidden text-paper">
        <img src={img(route.cover, 1600)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="bg-journal-hero absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 pt-8 pb-12">
          <Link to="/feed" className="inline-flex items-center gap-1.5 text-sm font-semibold text-paper/75 hover:text-paper">
            <ArrowLeft className="size-4" /> Back to feed
          </Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="rise flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase">
                <span className="rounded-full bg-whiskey px-3 py-1 font-bold text-kelp">{CATEGORY_LABELS[route.category]}</span>
                <span className="rounded-full border border-paper/30 px-3 py-1">{TRANSPORT_LABELS[route.transportMode]}</span>
                <span className="text-paper/70">
                  {route.city}, {route.country}
                </span>
              </div>
              <h1 className="rise mt-4 text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl" style={{ animationDelay: '80ms' }}>
                {route.title}
              </h1>
              <p className="rise mt-4 max-w-2xl font-serif text-xl text-paper/85 italic" style={{ animationDelay: '160ms' }}>
                {route.tagline}
              </p>
              <div className="rise mt-6 flex items-center gap-3" style={{ animationDelay: '240ms' }}>
                <Avatar handle={creator.handle} />
                <div className="text-sm leading-tight">
                  <p className="font-bold">@{creator.handle}</p>
                  <p className="text-paper/65">
                    {creator.countriesVisited} countries · {creator.homeBase}
                  </p>
                </div>
              </div>
            </div>

            <div className="rise flex flex-col gap-4" style={{ animationDelay: '320ms' }}>
              <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/15 backdrop-blur-md">
                <HeroStat icon={Ruler} label="Distance" value={formatDistance(route.totalDistanceMeters)} />
                <HeroStat icon={Timer} label="Duration" value={formatDuration(route.estimatedDurationMinutes)} />
                <HeroStat
                  icon={Trophy}
                  label="Conquered"
                  value={(route.completionCount + (player.conquered ? 1 : 0)).toLocaleString()}
                />
              </dl>
              <button
                onClick={startRoute}
                className="flex items-center justify-center gap-2 rounded-full bg-[var(--brand-cta-urgent)] px-6 py-4 text-lg font-extrabold text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                <Navigation className="size-5 fill-white" /> {player.active ? 'Resume route' : 'Start Route'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav id="route-tabs" className="sticky top-16 z-30 scroll-mt-16 border-b border-kelp/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5">
          {(
            [
              ['map', 'Interactive Map', MapIcon],
              ['journal', 'Travel Journal', BookOpen],
              ['reel', 'Media Reel', Clapperboard],
              ['reviews', `Conqueror Reviews · ${route.reviews.length}`, Star],
            ] as const
          ).map(([key, label, Icon]) => (
            <Link
              key={key}
              to="/routes/$routeId"
              params={{ routeId: route.routeId }}
              search={{ tab: key }}
              replace
              resetScroll={false}
              className={`flex shrink-0 items-center gap-2 border-b-[3px] px-4 py-4 text-sm font-bold transition ${
                tab === key ? 'border-whiskey text-kelp' : 'border-transparent text-lavender hover:text-kelp'
              }`}
            >
              <Icon className="size-4" /> {label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {tab === 'map' && <MapTab route={route} player={player} />}
        {tab === 'journal' && <JournalTab route={route} />}
        {tab === 'reel' && <ReelTab route={route} />}
        {tab === 'reviews' && <ReviewsTab route={route} avg={avg} />}
      </main>

      {player.arrival && <ArrivalToast arrival={player.arrival.waypoint} key={player.arrival.at} onClose={player.dismissArrival} />}
      {player.showConquered && <ConqueredModal route={route} onClose={player.dismissConquered} />}
    </div>
  )
}

function HeroStat({ icon: Icon, label, value }: { icon: typeof Ruler; label: string; value: string }) {
  return (
    <div className="bg-kelp/40 px-5 py-3">
      <dt className="flex items-center gap-1 font-mono text-[10px] tracking-widest text-paper/65 uppercase">
        <Icon className="size-3" /> {label}
      </dt>
      <dd className="mt-0.5 text-2xl font-extrabold">{value}</dd>
    </div>
  )
}

/* ───────────────────────────── Map tab ───────────────────────────── */

type Player = ReturnType<typeof useRoutePlayer>

function MapTab({ route, player }: { route: GogramRoute; player: Player }) {
  const [selected, setSelected] = useState<number>(1)
  const lastReached = player.arrival?.waypoint.sequenceOrder
  useEffect(() => {
    if (lastReached) setSelected(lastReached)
  }, [lastReached])
  const wp = route.waypoints.find((w) => w.sequenceOrder === selected)!
  const pct = Math.round((player.progress / player.total) * 100)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4">
        <div className="topo relative overflow-hidden rounded-[28px] border border-kelp/10 shadow-[0_30px_60px_-40px_rgba(61,64,47,0.6)]">
          <div className="aspect-[800/560]">
            <RouteMap
              route={route}
              variant="full"
              width={800}
              height={560}
              animate={!player.active}
              progressMeters={player.progress}
              position={player.position}
              activeWaypoint={selected}
              reachedWaypoints={player.reached}
              onSelectWaypoint={setSelected}
            />
          </div>
          <div className="absolute top-4 left-4 rounded-full bg-paper/90 px-3 py-1.5 font-mono text-[11px] text-kelp shadow backdrop-blur">
            {formatCoord(route.waypoints[0].location)}
          </div>
          {player.active && (
            <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-tamarillo px-3 py-1.5 font-mono text-[11px] font-semibold text-white shadow">
              <span className="size-2 animate-pulse rounded-full bg-white" /> LIVE · simulated GPS
            </div>
          )}
        </div>

        {/* Player console */}
        <div className="flex flex-col gap-4 rounded-[24px] bg-kelp p-4 text-paper sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={player.playing ? player.pause : player.start}
              className="grid size-12 place-items-center rounded-full bg-[var(--brand-cta-urgent)] transition hover:brightness-110 active:scale-95"
              aria-label={player.playing ? 'Pause route' : 'Start route'}
            >
              {player.playing ? <Pause className="size-5 fill-white" /> : <Play className="size-5 translate-x-px fill-white" />}
            </button>
            <button
              onClick={player.reset}
              className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="Reset route"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex justify-between font-mono text-[11px] text-paper/70">
              <span>
                {formatDistance(player.progress)} / {formatDistance(player.total)}
              </span>
              <span>
                {player.reached.size}/{route.waypoints.length} stops · {pct}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-willow transition-[width] duration-150" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-paper/70">
              {player.conquered ? (
                <span className="font-bold text-whiskey">Route conquered 🏆</span>
              ) : player.nextStop && player.active ? (
                <>
                  Next: <b className="text-paper">{player.nextStop.title}</b> in {formatDistance(player.toNext)} · alerts fire within{' '}
                  {PROXIMITY_METERS} m
                </>
              ) : (
                <>Press play to simulate walking this route. Stops trigger within {PROXIMITY_METERS} m.</>
              )}
            </p>
          </div>
          <div className="flex gap-1 rounded-full bg-white/10 p-1">
            {[1, 3, 8].map((s) => (
              <button
                key={s}
                onClick={() => player.setSpeed(s)}
                className={`rounded-full px-3 py-1 font-mono text-xs font-semibold transition ${
                  player.speed === s ? 'bg-whiskey text-kelp' : 'text-paper/70 hover:text-paper'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Waypoint rail */}
      <aside className="space-y-4">
        <WaypointDetail wp={wp} reached={player.reached.has(wp.sequenceOrder)} />
        <ol className="overflow-hidden rounded-[24px] border border-kelp/10 bg-white">
          {route.waypoints.map((w) => {
            const reached = player.reached.has(w.sequenceOrder)
            return (
              <li key={w.waypointId}>
                <button
                  onClick={() => setSelected(w.sequenceOrder)}
                  className={`flex w-full items-center gap-3 border-b border-kelp/5 px-4 py-3 text-left transition last:border-0 ${
                    selected === w.sequenceOrder ? 'bg-paper' : 'hover:bg-paper/60'
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-bold ${
                      w.border ? 'bg-tamarillo text-white' : reached ? 'bg-kelp text-paper' : 'bg-whiskey text-kelp'
                    }`}
                  >
                    {w.border ? '⇄' : w.sequenceOrder}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-kelp">{w.title}</span>
                    <span className="font-mono text-[10px] text-lavender">~{w.estimatedStayMinutes} min stay</span>
                  </span>
                  {reached && <span className="font-mono text-[10px] font-bold text-willow">✓ REACHED</span>}
                </button>
              </li>
            )
          })}
        </ol>
      </aside>
    </div>
  )
}

function WaypointDetail({ wp, reached }: { wp: Waypoint; reached: boolean }) {
  return (
    <div key={wp.waypointId} className="rise rounded-[24px] border border-kelp/10 bg-white p-5" style={{ animationDuration: '0.4s' }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-widest text-lavender uppercase">Stop {wp.sequenceOrder}</p>
          <h3 className="text-xl font-extrabold text-kelp">{wp.title}</h3>
        </div>
        {reached && <span className="rounded-full bg-willow px-2.5 py-1 font-mono text-[10px] font-bold text-white">REACHED</span>}
      </div>
      <p className="mt-2 font-serif leading-relaxed text-ink/80">{wp.description}</p>
      {wp.border && <BorderCard border={wp.border} compact />}
      <ProTip text={wp.proTip} />
      <div className="mt-3 flex flex-wrap gap-2 font-mono text-[11px] text-lavender">
        <span className="flex items-center gap-1">
          <Crosshair className="size-3" /> {formatCoord(wp.location)}
        </span>
        {wp.localCost && (
          <span className="flex items-center gap-1">
            <Coins className="size-3" /> {wp.localCost}
          </span>
        )}
      </div>
    </div>
  )
}

function ProTip({ text }: { text: string }) {
  return (
    <div className="mt-3 flex gap-2.5 rounded-2xl bg-whiskey/20 p-3 text-sm text-kelp">
      <Lightbulb className="mt-0.5 size-4 shrink-0 text-[#9a5a38]" />
      <p>
        <b className="font-mono text-[10px] tracking-widest uppercase">Backpacker pro-tip · </b>
        {text}
      </p>
    </div>
  )
}

function BorderCard({ border, compact = false }: { border: BorderCrossing; compact?: boolean }) {
  return (
    <div className={`relative mt-3 overflow-hidden rounded-2xl bg-tamarillo text-white ${compact ? 'p-4' : 'p-5'}`}>
      <div className="absolute -top-6 -right-6 size-24 rounded-full border-[10px] border-white/10" />
      <p className="font-mono text-[10px] tracking-[0.25em] text-white/75 uppercase">Border crossing</p>
      <p className={`${compact ? 'text-lg' : 'text-2xl'} mt-1 font-extrabold`}>
        {border.from} <span className="text-whiskey">⇄</span> {border.to}
      </p>
      <dl className="mt-2 space-y-1 text-sm text-white/90">
        <div>
          <dt className="inline font-semibold">Post: </dt>
          <dd className="inline">{border.post}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">Hours: </dt>
          <dd className="inline">{border.hours}</dd>
        </div>
      </dl>
      <p className="mt-2 font-serif text-sm text-white/85 italic">{border.notes}</p>
    </div>
  )
}

/* ─────────────────────────── Journal tab ─────────────────────────── */

function JournalTab({ route }: { route: GogramRoute }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-serif text-lg text-ink/70 italic">
        Written along the way by @{userById(route.creatorId).handle}. Costs are what they paid on the day.
      </p>
      <ol className="relative mt-8 border-l-2 border-dashed border-willow/60 pl-8">
        {route.waypoints.map((w, i) => (
          <li key={w.waypointId} className="rise relative pb-12 last:pb-0" style={{ animationDelay: `${i * 70}ms` }}>
            <span
              className={`absolute top-0 -left-[49px] grid size-8 place-items-center rounded-full font-mono text-sm font-bold ring-4 ring-paper ${
                w.border ? 'bg-tamarillo text-white' : 'bg-whiskey text-kelp'
              }`}
            >
              {w.border ? '⇄' : w.sequenceOrder}
            </span>
            <p className="font-mono text-[11px] tracking-widest text-lavender uppercase">
              Stop {w.sequenceOrder} · stay ~{formatDuration(w.estimatedStayMinutes)}
            </p>
            <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-kelp">{w.title}</h3>
            <p className="mt-2 font-serif text-lg leading-relaxed text-ink/85">{w.description}</p>
            {w.border && <BorderCard border={w.border} />}
            <ProTip text={w.proTip} />
            <div className="mt-3 flex flex-wrap gap-2">
              {w.localCost && (
                <span className="flex items-center gap-1.5 rounded-full bg-willow/15 px-3 py-1 text-xs font-semibold text-kelp">
                  <Coins className="size-3.5" /> Local cost: {w.localCost}
                </span>
              )}
              {w.warning && (
                <span className="flex items-center gap-1.5 rounded-full bg-tamarillo/10 px-3 py-1 text-xs font-semibold text-tamarillo">
                  <AlertTriangle className="size-3.5" /> {w.warning}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ──────────────────────────── Reel tab ──────────────────────────── */

function ReelTab({ route }: { route: GogramRoute }) {
  const [open, setOpen] = useState<number | null>(null)
  const item = open != null ? route.reel[open] : null
  return (
    <>
      <div className="mb-6 flex items-end justify-between">
        <p className="max-w-xl font-serif text-lg text-ink/70 italic">
          Shots from conquerors, pinned to the exact spot they were taken.
        </p>
        <span className="font-mono text-xs text-lavender">{route.reel.length} clips & photos</span>
      </div>
      <div className="grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {route.reel.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-[24px] text-left ${i === 0 ? 'sm:row-span-2' : ''}`}
          >
            <img src={img(r.image, 800)} alt={r.caption} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-crimson/85 via-transparent to-transparent" />
            <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 font-mono text-[10px] text-paper backdrop-blur">
              <MapPin className="size-3" /> {formatCoord(r.location)}
            </span>
            <div className="absolute right-4 bottom-4 left-4 text-paper">
              <p className="font-serif text-lg leading-tight italic">{r.caption}</p>
              <p className="mt-1 text-xs font-semibold text-paper/75">@{r.author}</p>
            </div>
          </button>
        ))}
        <div className="grid place-items-center rounded-[24px] border-2 border-dashed border-kelp/20 p-6 text-center">
          <div>
            <Clapperboard className="mx-auto size-6 text-lavender" />
            <p className="mt-2 font-bold text-kelp">Walked this route?</p>
            <p className="text-sm text-lavender">GPS-tagged uploads open with traveller accounts.</p>
          </div>
        </div>
      </div>

      {item && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/85 p-4 backdrop-blur" onClick={() => setOpen(null)}>
          <figure className="relative max-h-full max-w-4xl overflow-hidden rounded-[24px]" onClick={(e) => e.stopPropagation()}>
            <img src={img(item.image, 1600)} alt={item.caption} className="max-h-[80vh] w-full object-cover" />
            <figcaption className="bg-journal-hero absolute inset-x-0 bottom-0 p-5 text-paper">
              <p className="font-serif text-2xl italic">{item.caption}</p>
              <p className="mt-1 font-mono text-xs text-paper/75">
                @{item.author} · {formatCoord(item.location)}
              </p>
            </figcaption>
            <button onClick={() => setOpen(null)} className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-black/40 text-paper" aria-label="Close">
              <X className="size-5" />
            </button>
          </figure>
        </div>
      )}
    </>
  )
}

/* ─────────────────────────── Reviews tab ─────────────────────────── */

const KIND_META: Record<Review['kind'], { label: string; cls: string }> = {
  review: { label: 'Review', cls: 'bg-willow/15 text-kelp' },
  obstacle: { label: 'Obstacle warning', cls: 'bg-tamarillo/10 text-tamarillo' },
  detour: { label: 'Detour note', cls: 'bg-lavender/15 text-lavender' },
}

function ReviewsTab({ route, avg }: { route: GogramRoute; avg: number }) {
  const [filter, setFilter] = useState<Review['kind'] | 'all'>('all')
  const [extra, setExtra] = useState<Review[]>([])
  const [draft, setDraft] = useState({ body: '', rating: 5, kind: 'review' as Review['kind'] })
  const [error, setError] = useState('')
  const all = useMemo(() => [...extra, ...route.reviews], [extra, route.reviews])
  const list = filter === 'all' ? all : all.filter((r) => r.kind === filter)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (draft.body.trim().length < 10) {
      setError('Give fellow travellers a little more detail — at least 10 characters.')
      return
    }
    setExtra((x) => [
      { id: `local-${Date.now()}`, author: 'you.wandering', date: new Date().toISOString().slice(0, 10), ...draft, body: draft.body.trim() },
      ...x,
    ])
    setDraft({ body: '', rating: 5, kind: 'review' })
    setError('')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4 lg:sticky lg:top-36 lg:self-start">
        <div className="bg-cinematic rounded-[24px] p-6 text-paper">
          <p className="font-mono text-[11px] tracking-widest text-whiskey uppercase">Conqueror rating</p>
          <p className="mt-1 text-6xl font-extrabold">{avg.toFixed(1)}</p>
          <Stars n={Math.round(avg)} />
          <p className="mt-3 text-sm text-paper/75">
            From {route.completionCount.toLocaleString()} backpackers who finished every stop.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3 rounded-[24px] border border-kelp/10 bg-white p-5">
          <p className="font-bold text-kelp">Leave a note</p>
          <div className="flex gap-1">
            {(Object.keys(KIND_META) as Review['kind'][]).map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setDraft((d) => ({ ...d, kind: k }))}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${draft.kind === k ? 'bg-kelp text-paper' : 'bg-paper text-lavender'}`}
              >
                {KIND_META[k].label.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="flex gap-0.5" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setDraft((d) => ({ ...d, rating: n }))} aria-label={`${n} stars`}>
                <Star className={`size-5 ${n <= draft.rating ? 'fill-whiskey text-whiskey' : 'text-kelp/20'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={draft.body}
            onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
            rows={3}
            placeholder="What should the next traveller know?"
            className={`w-full rounded-xl border bg-paper/50 p-3 text-sm outline-none focus:ring-2 ${
              error ? 'border-tamarillo focus:ring-tamarillo/25' : 'border-kelp/15 focus:ring-willow/30'
            }`}
          />
          {error && <p className="text-xs font-semibold text-tamarillo">{error}</p>}
          <button className="w-full rounded-full bg-kelp py-2.5 text-sm font-bold text-paper hover:bg-kelp/90">Post note</button>
        </form>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap gap-2">
          {(['all', 'review', 'obstacle', 'detour'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
                filter === k ? 'border-kelp bg-kelp text-paper' : 'border-kelp/15 bg-white text-kelp'
              }`}
            >
              {k === 'all' ? 'Everything' : KIND_META[k].label}
            </button>
          ))}
        </div>
        {list.length ? (
          <ul className="space-y-4">
            {list.map((r) => (
              <li key={r.id} className="rise rounded-[24px] border border-kelp/10 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar handle={r.author} size="size-9" />
                    <div className="leading-tight">
                      <p className="text-sm font-bold text-kelp">@{r.author}</p>
                      <p className="font-mono text-[10px] text-lavender">{r.date}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase ${KIND_META[r.kind].cls}`}>
                    {KIND_META[r.kind].label}
                  </span>
                </div>
                <Stars n={r.rating} className="mt-3" />
                <p className="mt-2 font-serif text-lg leading-relaxed text-ink/85">{r.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[24px] border border-dashed border-kelp/20 p-10 text-center font-serif text-ink/60 italic">
            No {filter === 'all' ? 'notes' : KIND_META[filter as Review['kind']].label.toLowerCase() + 's'} yet. Trail looks clear.
          </p>
        )}
      </div>
    </div>
  )
}

function Stars({ n, className = '' }: { n: number; className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`} aria-label={`${n} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`size-4 ${i <= n ? 'fill-whiskey text-whiskey' : 'text-current opacity-20'}`} />
      ))}
    </div>
  )
}

/* ─────────────────────── Overlays & empty states ─────────────────────── */

function ArrivalToast({ arrival, onClose }: { arrival: Waypoint; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="rise fixed bottom-5 left-1/2 z-[60] w-[min(92vw,420px)] -translate-x-1/2" role="status" style={{ animationDuration: '0.35s' }}>
      <div className={`flex items-start gap-3 rounded-[22px] p-4 text-paper shadow-2xl ${arrival.border ? 'bg-tamarillo' : 'bg-kelp'}`}>
        <span className={`grid size-10 shrink-0 place-items-center rounded-full font-mono font-bold ${arrival.border ? 'bg-white text-tamarillo' : 'bg-whiskey text-kelp'}`}>
          {arrival.border ? '⇄' : arrival.sequenceOrder}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-widest text-paper/70 uppercase">
            {arrival.border ? 'Border ahead' : `Within ${PROXIMITY_METERS} m`}
          </p>
          <p className="font-bold">{arrival.title}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-paper/80">{arrival.proTip}</p>
        </div>
        <button onClick={onClose} aria-label="Dismiss" className="text-paper/60 hover:text-paper">
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}

function ConqueredModal({ route, onClose }: { route: GogramRoute; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-cinematic rise relative w-full max-w-md overflow-hidden rounded-[32px] p-8 text-center text-paper" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto grid size-32 rotate-[-8deg] place-items-center rounded-full border-4 border-dashed border-whiskey">
          <div className="text-center">
            <Trophy className="mx-auto size-9 text-whiskey" />
            <p className="mt-1 font-mono text-[10px] font-bold tracking-[0.2em] text-whiskey uppercase">Conquered</p>
            <p className="font-mono text-[10px] text-paper/70">{route.city.toUpperCase()}</p>
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight">Route conquered!</h2>
        <p className="mt-2 font-serif text-lg text-paper/80 italic">
          “{route.title}” is stamped into your digital passport. You are backpacker #{(route.completionCount + 1).toLocaleString()} to finish it.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2 text-left">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="font-mono text-[10px] text-paper/60 uppercase">Distance</p>
            <p className="text-xl font-bold">+{formatDistance(route.totalDistanceMeters)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="font-mono text-[10px] text-paper/60 uppercase">Stops</p>
            <p className="text-xl font-bold">
              {route.waypoints.length}/{route.waypoints.length}
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Link
            to="/routes/$routeId"
            params={{ routeId: route.routeId }}
            search={{ tab: 'reviews' }}
            onClick={onClose}
            className="flex-1 rounded-full bg-whiskey py-3 text-sm font-bold text-kelp"
          >
            Leave a review
          </Link>
          <Link to="/feed" className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white/10 py-3 text-sm font-bold">
            <Footprints className="size-4" /> Next route
          </Link>
        </div>
      </div>
    </div>
  )
}

function RouteNotFound() {
  return (
    <div className="grain min-h-screen">
      <AppHeader />
      <div className="topo mx-auto mt-16 max-w-xl rounded-[28px] p-12 text-center">
        <p className="font-mono text-xs tracking-widest text-lavender uppercase">Off the map</p>
        <h1 className="mt-2 text-3xl font-extrabold text-kelp">This trail has gone cold</h1>
        <p className="mt-2 font-serif text-ink/70">The route may have been removed by its creator.</p>
        <Link to="/feed" className="mt-6 inline-block rounded-full bg-kelp px-5 py-2.5 text-sm font-bold text-paper">
          Back to the feed
        </Link>
      </div>
    </div>
  )
}
