import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Footprints,
  Globe2,
  House,
  MapPinned,
  Navigation,
  Repeat2,
  Route as RouteIcon,
  Trophy,
} from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { RouteCard } from '@/components/RouteCard'
import { RouteMap } from '@/components/RouteMap'
import { Wordmark } from '@/components/Logo'
import { routes } from '@/data/fixtures'
import { formatDistance } from '@/lib/geo'
import { img } from '@/lib/img'

export const Route = createFileRoute('/')({
  component: Landing,
})

const featured = routes[0]
const phoneRoute = routes[1]

function Landing() {
  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <AppHeader />

      {/* ───── Hero ───── */}
      <section className="relative isolate overflow-hidden bg-kelp text-paper">
        <img
          src={img('hero', 1920, 75)}
          alt="A backpacker walking a winding mountain ridge trail at dusk"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-80"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-kelp via-kelp/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-paper to-transparent" />

        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="rise inline-flex items-center gap-2 rounded-full border border-paper/25 bg-black/20 px-4 py-1.5 font-mono text-[11px] tracking-[0.25em] text-whiskey uppercase backdrop-blur">
              <Footprints className="size-3.5" /> Movement-first travel
            </p>
            <h1
              className="rise mt-6 text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] font-extrabold tracking-[-0.035em]"
              style={{ animationDelay: '90ms' }}
            >
              Don’t post
              <br />
              the photo.
              <br />
              <span className="font-serif font-normal text-whiskey italic">Post the path.</span>
            </h1>
            <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-paper/85" style={{ animationDelay: '180ms' }}>
              Gogram is Instagram <i className="font-serif">and</i> Strava for backpackers. Record GPS-traced routes, drop pins
              with pro-tips, and let the community walk in your footsteps — then find your next bed, house swap or hostel gig
              on the way.
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '270ms' }}>
              <Link
                to="/feed"
                className="group flex items-center gap-2 rounded-full bg-whiskey px-7 py-4 font-extrabold text-kelp transition hover:brightness-105"
              >
                Explore routes <ArrowRight className="size-5 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/routes/$routeId"
                params={{ routeId: featured.routeId }}
                search={{ tab: 'map', play: true }}
                className="flex items-center gap-2 rounded-full bg-[var(--brand-cta-urgent)] px-7 py-4 font-extrabold text-white shadow-[0_18px_40px_-12px_rgba(156,13,15,0.8)] transition hover:-translate-y-0.5"
              >
                <Navigation className="size-5 fill-white" /> Start Route
              </Link>
            </div>
            <dl className="rise mt-12 flex flex-wrap gap-x-10 gap-y-4" style={{ animationDelay: '360ms' }}>
              {[
                ['1,107', 'routes conquered this week'],
                ['64', 'countries mapped'],
                ['25 m', 'proximity alerts'],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="text-3xl font-extrabold">{n}</dt>
                  <dd className="font-mono text-[11px] tracking-wider text-paper/65 uppercase">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <PhoneMock />
        </div>
      </section>

      {/* ───── Contrast strip ───── */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-stretch">
          <div className="flex flex-col justify-between rounded-[28px] border border-kelp/10 bg-white p-8">
            <p className="font-mono text-[11px] tracking-[0.25em] text-lavender uppercase">A fitness app says</p>
            <p className="mt-10 text-3xl font-bold tracking-tight text-kelp/45">“You walked 8.2 km today.”</p>
          </div>
          <div className="bg-cinematic relative flex flex-col justify-between overflow-hidden rounded-[28px] p-8 text-paper">
            <Globe2 className="absolute -right-10 -bottom-10 size-64 text-white/5" />
            <p className="font-mono text-[11px] tracking-[0.25em] text-whiskey uppercase">Gogram says</p>
            <p className="relative mt-10 font-serif text-4xl leading-tight sm:text-5xl">
              “You crossed <span className="font-display font-extrabold text-whiskey">3 national borders</span> and completed{' '}
              <span className="font-display font-extrabold text-whiskey">4 community routes</span> this month!”
            </p>
          </div>
        </div>
      </section>

      {/* ───── Layer 1: Movement engine ───── */}
      <section className="topo-dark text-paper">
        <div className="mx-auto max-w-7xl px-5 py-24">
          <SectionLabel n="01" label="Movement engine" light />
          <h2 className="mt-4 max-w-3xl text-5xl leading-[0.98] font-extrabold tracking-tight sm:text-6xl">
            Every trip becomes a trail someone else can walk.
          </h2>
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            <EngineCard
              kicker="Record & drop"
              title="Your walk, traced and annotated"
              steps={[
                [RouteIcon, 'Low-power GPS breadcrumbs adapt to how fast you’re moving.'],
                [MapPinned, 'Drop pins at real stops with photos, dwell time and a Backpacker Pro-Tip.'],
                [Globe2, 'Publish as a shareable route — border crossings included.'],
              ]}
            />
            <EngineCard
              kicker="Play & explore"
              title="Follow a creator’s footsteps, live"
              steps={[
                [Navigation, 'Interactive trail overlay with every numbered stop.'],
                [Bell, 'A gentle buzz when you’re within 25 m of the next pin.'],
                [Trophy, 'Finish every stop to conquer it and stamp your digital passport.'],
              ]}
              accent
            />
          </div>
        </div>
      </section>

      {/* ───── Feed preview ───── */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel n="02" label="The feed" />
            <h2 className="mt-4 max-w-2xl text-5xl leading-[0.98] font-extrabold tracking-tight text-kelp">
              A social feed made of movement.
            </h2>
            <p className="mt-4 max-w-xl font-serif text-lg text-ink/70">
              Every post centres on a living polyline, not a filtered square. Tap in for the map, the journal, the reel and the
              reviews from people who actually finished it.
            </p>
          </div>
          <Link to="/feed" className="group flex items-center gap-2 rounded-full border-2 border-kelp px-6 py-3 font-bold text-kelp transition hover:bg-kelp hover:text-paper">
            See all routes <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {routes.slice(0, 2).map((r, i) => (
            <RouteCard key={r.routeId} route={r} index={i} />
          ))}
        </div>
      </section>

      {/* ───── Layer 2: Community & marketplace ───── */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <SectionLabel n="03" label="Community & marketplace" />
        <h2 className="mt-4 max-w-3xl text-5xl leading-[0.98] font-extrabold tracking-tight text-kelp">
          Stay longer. Spend less. Belong somewhere.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <MarketCard
            image="lisbon"
            icon={House}
            title="Housing board"
            body="Roommate-wanted and room-offered posts with budgets, move-in dates and lifestyle tags."
            sample="Room in Graça · €410/mo · quiet, plants, early riser"
          />
          <MarketCard
            image="paris"
            icon={Repeat2}
            title="House swaps"
            body="List your place, name the cities you dream of, and get matched with travellers heading your way."
            sample="Budapest flat ⇄ Mexico City · Nov 3 – Dec 1"
          />
          <MarketCard
            image="hostel"
            icon={BriefcaseBusiness}
            title="Backpacker gigs"
            body="Hostel shifts, café work, pet-sitting and photo gigs — paid, stipend or a bed in exchange."
            sample="Reception · El Calafate · 20h/wk → free bed"
          />
        </div>
      </section>

      {/* ───── Gamification ───── */}
      <section className="bg-kelp text-paper">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionLabel n="04" label="Your digital passport" light />
            <h2 className="mt-4 text-5xl leading-[0.98] font-extrabold tracking-tight">Measure the journey, not the steps.</h2>
            <p className="mt-5 max-w-lg font-serif text-lg text-paper/75">
              Gogram turns raw movement into travel context. Your impact score grows with every border you cross, every
              kilometre on foot and every community route you conquer.
            </p>
          </div>
          <div className="rounded-[28px] bg-black/20 p-8 ring-1 ring-white/10">
            <p className="font-mono text-[11px] tracking-[0.25em] text-whiskey uppercase">User impact =</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['Σ', 'Border crossings', '3'],
                ['Σ', 'Kilometres walked', '186.4'],
                ['Σ', 'Routes conquered', '4'],
              ].map(([sym, label, v], i) => (
                <div key={label} className="relative rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  {i > 0 && <span className="absolute top-1/2 -left-3 hidden -translate-y-1/2 text-xl font-bold text-whiskey sm:block">+</span>}
                  <p className="font-serif text-3xl text-whiskey italic">{sym}</p>
                  <p className="mt-1 text-sm font-semibold">{label}</p>
                  <p className="mt-3 font-mono text-2xl font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-[var(--color-willow-grove)] px-5 py-4">
              <span className="font-bold">Your impact this October</span>
              <span className="text-3xl font-extrabold">193</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative isolate overflow-hidden">
        <img src={img('patagonia', 1920)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" loading="lazy" />
        <div className="bg-journal-hero absolute inset-0 -z-10" />
        <div className="mx-auto max-w-4xl px-5 py-32 text-center text-paper">
          <h2 className="text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-7xl">
            The road is <span className="font-serif font-normal text-whiskey italic">already</span> mapped.
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl text-paper/80">
            {routes.length} community routes across {new Set(routes.map((r) => r.country)).size} countries are waiting. Pick one
            and start walking.
          </p>
          <Link
            to="/feed"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-whiskey px-8 py-4 text-lg font-extrabold text-kelp transition hover:brightness-105"
          >
            Find your route <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      <footer className="bg-ink text-paper/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm">
          <Wordmark light />
          <p className="font-mono text-xs">Made for people who travel on foot, by thumb and by night bus.</p>
        </div>
      </footer>
    </div>
  )
}

function SectionLabel({ n, label, light = false }: { n: string; label: string; light?: boolean }) {
  return (
    <p className={`flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase ${light ? 'text-whiskey' : 'text-willow'}`}>
      <span className={`rounded-full px-2 py-0.5 ${light ? 'bg-whiskey/15' : 'bg-willow/15'}`}>{n}</span> {label}
    </p>
  )
}

function EngineCard({
  kicker,
  title,
  steps,
  accent = false,
}: {
  kicker: string
  title: string
  steps: [typeof RouteIcon, string][]
  accent?: boolean
}) {
  return (
    <div className={`rounded-[28px] p-8 ring-1 ${accent ? 'bg-crimson/60 ring-whiskey/20' : 'bg-white/5 ring-white/10'}`}>
      <p className="font-mono text-[11px] tracking-[0.25em] text-whiskey uppercase">{kicker}</p>
      <h3 className="mt-2 text-3xl font-extrabold tracking-tight">{title}</h3>
      <ol className="mt-8 space-y-5">
        {steps.map(([Icon, text], i) => (
          <li key={text} className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-paper/10 text-whiskey">
              <Icon className="size-5" />
            </span>
            <p className="pt-2.5 text-paper/85">
              <span className="mr-2 font-mono text-xs text-paper/45">0{i + 1}</span>
              {text}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function MarketCard({
  image,
  icon: Icon,
  title,
  body,
  sample,
}: {
  image: string
  icon: typeof House
  title: string
  body: string
  sample: string
}) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-kelp/10 bg-white">
      <div className="relative h-48 overflow-hidden">
        <img src={img(image, 700)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute top-4 left-4 grid size-11 place-items-center rounded-2xl bg-paper text-kelp">
          <Icon className="size-5" />
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-lavender px-2.5 py-1 font-mono text-[10px] tracking-wider text-paper uppercase">
          Opening soon
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-extrabold text-kelp">{title}</h3>
        <p className="mt-2 font-serif text-ink/75">{body}</p>
        <p className="mt-4 rounded-xl bg-paper px-3 py-2 font-mono text-[11px] text-kelp/80">{sample}</p>
      </div>
    </article>
  )
}

function PhoneMock() {
  return (
    <div className="rise relative mx-auto hidden w-[320px] lg:block" style={{ animationDelay: '300ms' }}>
      <div className="rotate-[3deg] rounded-[44px] bg-ink p-3 shadow-[0_50px_80px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
        <div className="overflow-hidden rounded-[34px] bg-paper">
          <div className="flex items-center justify-between bg-kelp px-5 pt-4 pb-3 text-paper">
            <span className="text-sm font-extrabold">gogram</span>
            <span className="font-mono text-[10px] text-whiskey">● LIVE</span>
          </div>
          <div className="topo relative aspect-[600/560]">
            <RouteMap route={phoneRoute} width={600} height={560} animate />
            <div className="absolute right-3 bottom-3 left-3 rounded-2xl bg-kelp/95 p-3 text-paper shadow-lg">
              <p className="font-mono text-[9px] tracking-widest text-whiskey uppercase">Within 25 m · Stop 3</p>
              <p className="text-sm font-bold">Miradouro de Santa Luzia</p>
              <p className="text-[11px] text-paper/70">€2 ginjinha in chocolate cups next door.</p>
            </div>
          </div>
          <div className="space-y-1 px-5 py-4">
            <p className="text-sm leading-tight font-extrabold text-kelp">{phoneRoute.title}</p>
            <p className="font-mono text-[10px] text-lavender">
              {formatDistance(phoneRoute.totalDistanceMeters)} · {phoneRoute.completionCount} conquered
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-deep">
              <div className="h-full w-[48%] rounded-full bg-willow" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-24 -left-16 -rotate-6 rounded-2xl bg-tamarillo px-4 py-3 text-white shadow-xl">
        <p className="font-mono text-[9px] tracking-widest text-white/70 uppercase">Border crossing</p>
        <p className="text-sm font-extrabold">Chile ⇄ Argentina</p>
      </div>
      <div className="absolute -right-10 bottom-24 rotate-6 rounded-2xl bg-whiskey px-4 py-3 text-kelp shadow-xl">
        <p className="flex items-center gap-1.5 text-sm font-extrabold">
          <Trophy className="size-4" /> Conquered!
        </p>
        <p className="font-mono text-[9px] text-kelp/70">+1 passport stamp</p>
      </div>
    </div>
  )
}
