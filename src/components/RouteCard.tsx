import { Link } from '@tanstack/react-router'
import { BookOpen, Clapperboard, Heart, Map as MapIcon, Ruler, Star, Timer, Trophy } from 'lucide-react'
import { RouteMap } from './RouteMap'
import { Avatar } from './Avatar'
import { CATEGORY_LABELS, TRANSPORT_LABELS, userById, type Route } from '@/data/fixtures'
import { formatDistance, formatDuration } from '@/lib/geo'
import { img } from '@/lib/img'

const TABS = [
  { tab: 'map', label: 'Map', icon: MapIcon },
  { tab: 'journal', label: 'Journal', icon: BookOpen },
  { tab: 'reel', label: 'Reel', icon: Clapperboard },
  { tab: 'reviews', label: 'Reviews', icon: Star },
] as const

export function RouteCard({ route, index = 0 }: { route: Route; index?: number }) {
  const creator = userById(route.creatorId)
  const hasBorder = route.waypoints.some((w) => w.border)

  return (
    <article
      className="rise overflow-hidden rounded-[28px] border border-kelp/10 bg-white shadow-[0_1px_0_rgba(61,64,47,0.06),0_20px_40px_-28px_rgba(61,64,47,0.45)]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <header className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar handle={creator.handle} />
          <div className="leading-tight">
            <p className="text-sm font-bold text-kelp">@{creator.handle}</p>
            <p className="text-xs text-lavender">
              {route.city}, {route.country} · {TRANSPORT_LABELS[route.transportMode]}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-paper-deep px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-kelp/80">
          {CATEGORY_LABELS[route.category]}
        </span>
      </header>

      <Link
        to="/routes/$routeId"
        params={{ routeId: route.routeId }}
        className="group relative mx-3 block overflow-hidden rounded-[20px]"
      >
        <div className="topo relative aspect-[600/340]">
          <img
            src={img(route.cover, 900)}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.16] mix-blend-multiply grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-25"
          />
          <div className="absolute inset-0">
            <RouteMap route={route} animate />
          </div>
          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className="rounded-full bg-kelp/90 px-3 py-1 font-mono text-[11px] text-paper backdrop-blur">
              {route.waypoints.length} stops
            </span>
            {hasBorder && (
              <span className="rounded-full bg-tamarillo px-3 py-1 font-mono text-[11px] text-white">⇄ border crossing</span>
            )}
          </div>
          <span className="absolute right-3 bottom-3 translate-y-2 rounded-full bg-paper px-3 py-1 text-xs font-bold text-kelp opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            Open route →
          </span>
        </div>
      </Link>

      <div className="px-5 pt-4">
        <Link to="/routes/$routeId" params={{ routeId: route.routeId }}>
          <h3 className="text-xl leading-snug font-extrabold tracking-tight text-kelp hover:text-crimson">
            📍 {route.title}
          </h3>
        </Link>
        <p className="mt-1 font-serif text-[15px] leading-relaxed text-ink/70 italic">{route.tagline}</p>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-y border-kelp/10 py-3 text-kelp">
          <Stat icon={Ruler} label="Distance" value={formatDistance(route.totalDistanceMeters)} />
          <Stat icon={Timer} label="Duration" value={formatDuration(route.estimatedDurationMinutes)} />
          <Stat icon={Trophy} label="Conquered" value={route.completionCount.toLocaleString()} />
        </dl>
      </div>

      <footer className="flex items-center justify-between gap-2 px-3 py-3">
        <div className="flex flex-wrap gap-1">
          {TABS.map(({ tab, label, icon: Icon }) => (
            <Link
              key={tab}
              to="/routes/$routeId"
              params={{ routeId: route.routeId }}
              search={{ tab }}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-lavender transition hover:bg-paper hover:text-kelp"
            >
              <Icon className="size-3.5" /> {label}
            </Link>
          ))}
        </div>
        <span className="flex items-center gap-1 pr-2 text-xs font-semibold text-lavender">
          <Heart className="size-3.5" /> {route.likes.toLocaleString()}
        </span>
      </footer>
    </article>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof Ruler; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1 font-mono text-[10px] tracking-widest text-lavender uppercase">
        <Icon className="size-3" /> {label}
      </dt>
      <dd className="mt-0.5 text-lg font-bold">{value}</dd>
    </div>
  )
}
