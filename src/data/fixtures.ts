// ─────────────────────────────────────────────────────────────────────────────
// Stubbed product data for the Gogram preview.
//
// Every screen reads from this module. Shapes mirror the planned PostgreSQL +
// PostGIS tables (routes, waypoints, users) so a later milestone can swap these
// exports for real queries without touching the UI. See PLAN.md.
// ─────────────────────────────────────────────────────────────────────────────

import { breadcrumbs, pathLength, type LatLng } from '@/lib/geo'

export type RouteCategory =
  | 'budget'
  | 'photography_spots'
  | 'cafe_crawl'
  | 'hostel_pub_crawl'
  | 'historic'
  | 'off_grid'

export type TransportMode = 'walking' | 'transit' | 'cycling' | 'hitchhiking' | 'overland'

export const CATEGORY_LABELS: Record<RouteCategory, string> = {
  budget: 'Budget',
  photography_spots: 'Photo spots',
  cafe_crawl: 'Café crawl',
  hostel_pub_crawl: 'Pub crawl',
  historic: 'Historic',
  off_grid: 'Off-grid',
}

export const TRANSPORT_LABELS: Record<TransportMode, string> = {
  walking: 'Walking',
  transit: 'Transit',
  cycling: 'Cycling',
  hitchhiking: 'Hitchhiking',
  overland: 'Overland',
}

export interface User {
  userId: string
  handle: string
  name: string
  homeBase: string
  countriesVisited: number
}

export interface BorderCrossing {
  from: string
  to: string
  post: string
  hours: string
  notes: string
}

export interface Waypoint {
  waypointId: string
  sequenceOrder: number
  title: string
  location: LatLng
  description: string
  proTip: string
  estimatedStayMinutes: number
  localCost?: string
  warning?: string
  border?: BorderCrossing
}

export interface ReelItem {
  id: string
  image: string
  caption: string
  location: LatLng
  author: string
}

export interface Review {
  id: string
  author: string
  rating: number
  date: string
  body: string
  kind: 'review' | 'obstacle' | 'detour'
}

export interface Route {
  routeId: string
  creatorId: string
  title: string
  tagline: string
  city: string
  country: string
  category: RouteCategory
  transportMode: TransportMode
  estimatedDurationMinutes: number
  totalDistanceMeters: number
  polyline: LatLng[]
  waypoints: Waypoint[]
  completionCount: number
  likes: number
  cover: string
  createdAt: string
  reel: ReelItem[]
  reviews: Review[]
}

export const users: User[] = [
  { userId: 'u-sarah', handle: 'sarah_nomad', name: 'Sarah Okafor', homeBase: 'Lagos → everywhere', countriesVisited: 41 },
  { userId: 'u-joao', handle: 'joao.walks', name: 'João Mendes', homeBase: 'Lisbon, Portugal', countriesVisited: 23 },
  { userId: 'u-linh', handle: 'linh.on.foot', name: 'Linh Tran', homeBase: 'Hanoi, Vietnam', countriesVisited: 17 },
  { userId: 'u-theo', handle: 'thumbs_south', name: 'Theo Varga', homeBase: 'No fixed address', countriesVisited: 58 },
  { userId: 'u-rita', handle: 'ruinbar_rita', name: 'Rita Kovács', homeBase: 'Budapest, Hungary', countriesVisited: 29 },
]

export const userById = (id: string) => users.find((u) => u.userId === id)!

/** The signed-in traveller for the preview. */
export const currentUser = {
  handle: 'you.wandering',
  name: 'You',
  passport: {
    borderCrossings: 3,
    kmWalked: 186.4,
    routesConquered: 4,
    countries: ['PT', 'ES', 'FR', 'MA'],
    month: 'October',
  },
}

function wp(
  routeId: string,
  seq: number,
  title: string,
  location: LatLng,
  rest: Omit<Waypoint, 'waypointId' | 'sequenceOrder' | 'title' | 'location'>,
): Waypoint {
  return { waypointId: `${routeId}-w${seq}`, sequenceOrder: seq, title, location, ...rest }
}

function build(
  r: Omit<Route, 'polyline' | 'totalDistanceMeters'>,
  seed: number,
  wobble = 0.12,
): Route {
  const polyline = breadcrumbs(
    r.waypoints.map((w) => w.location),
    seed,
    12,
    wobble,
  )
  return { ...r, polyline, totalDistanceMeters: pathLength(polyline) }
}

export const routes: Route[] = [
  build(
    {
      routeId: 'paris-indie-walk',
      creatorId: 'u-sarah',
      title: 'Paris on €15 a Day: The Indie Walk',
      tagline: 'Canal-side croissants to the steps of Sacré-Cœur, skipping every tourist trap in between.',
      city: 'Paris',
      country: 'France',
      category: 'budget',
      transportMode: 'walking',
      estimatedDurationMinutes: 195,
      completionCount: 142,
      likes: 2380,
      cover: 'paris',
      createdAt: '2026-09-28',
      waypoints: [
        wp('paris-indie-walk', 1, 'Canal Saint-Martin', [48.8722, 2.3655], {
          description: 'Start at the iron footbridges. Locals picnic along the quay from 8am — grab a spot before the joggers.',
          proTip: 'Du Pain et des Idées is 3 minutes away. Their escargot pistache is worth the €4.',
          estimatedStayMinutes: 25,
          localCost: '€4 pastry',
        }),
        wp('paris-indie-walk', 2, 'Belleville Market', [48.872, 2.377], {
          description: 'Tuesday and Friday mornings only. The cheapest fruit in the city and the loudest vendors.',
          proTip: 'Wait until the last 30 minutes — stalls drop prices to clear stock.',
          estimatedStayMinutes: 30,
          localCost: '€3 for a bag of clementines',
          warning: 'Very busy — keep your bag zipped and in front.',
        }),
        wp('paris-indie-walk', 3, 'Parc de Belleville Lookout', [48.8716, 2.3847], {
          description: 'The highest park in Paris with a free view that rivals the Eiffel Tower deck.',
          proTip: 'Sunset here is free. The Eiffel Tower summit costs €29.',
          estimatedStayMinutes: 20,
        }),
        wp('paris-indie-walk', 4, 'Buttes-Chaumont', [48.88, 2.382], {
          description: 'Cliffs, a suspension bridge and a temple on a rock. Perfect lunch stop.',
          proTip: 'Rosa Bonheur guinguette has €5 glasses of wine before 6pm.',
          estimatedStayMinutes: 50,
          localCost: '€8 baguette sandwich',
        }),
        wp('paris-indie-walk', 5, 'Sacré-Cœur', [48.8867, 2.3431], {
          description: 'Finish on the steps as the city turns gold. Buskers usually start around 7pm.',
          proTip: 'Skip the funicular. The back stairs on Rue du Chevalier-de-la-Barre are empty.',
          estimatedStayMinutes: 40,
          warning: 'Bracelet scammers at the bottom stairs — keep walking, hands in pockets.',
        }),
      ],
      reel: [
        { id: 'r1', image: 'paris', caption: 'Montmartre at 7am, before the crowds', location: [48.8862, 2.3415], author: 'sarah_nomad' },
        { id: 'r2', image: 'hero', caption: 'Belleville lookout haze', location: [48.8716, 2.3847], author: 'kai.backpacks' },
        { id: 'r3', image: 'lisbon', caption: 'Canal footbridge golden hour', location: [48.8722, 2.3655], author: 'mira_moves' },
      ],
      reviews: [
        { id: 'v1', author: 'kai.backpacks', rating: 5, date: '2026-10-11', kind: 'review', body: 'Spent €13.40 total including wine. Belleville view was the best surprise of my Europe trip.' },
        { id: 'v2', author: 'mira_moves', rating: 4, date: '2026-10-08', kind: 'obstacle', body: 'Buttes-Chaumont east gate closed for works until November — enter from Rue Botzaris.' },
        { id: 'v3', author: 'dev_overland', rating: 5, date: '2026-10-02', kind: 'detour', body: 'Add a 10 min detour to Rue Dénoyez for the street art wall between stops 2 and 3.' },
      ],
    },
    7,
  ),
  build(
    {
      routeId: 'alfama-miradouros',
      creatorId: 'u-joao',
      title: 'Seven Hills, Zero Trams: Alfama Miradouro Crawl',
      tagline: 'Every viewpoint worth the climb, threaded through tiled alleys and fado bars.',
      city: 'Lisbon',
      country: 'Portugal',
      category: 'photography_spots',
      transportMode: 'walking',
      estimatedDurationMinutes: 150,
      completionCount: 318,
      likes: 4105,
      cover: 'lisbon',
      createdAt: '2026-09-14',
      waypoints: [
        wp('alfama-miradouros', 1, 'Praça do Comércio', [38.7078, -9.1365], {
          description: 'Start at the river arch. Face the Tagus and turn left into the old town.',
          proTip: 'Public toilets under the arch are €0.50 and the cleanest you will find today.',
          estimatedStayMinutes: 10,
        }),
        wp('alfama-miradouros', 2, 'Sé Cathedral', [38.7099, -9.1334], {
          description: 'Romanesque fortress-church. The tram 28 rattles past every few minutes — perfect for motion shots.',
          proTip: 'Shoot at 1/30s from the curve uphill for the classic tram blur.',
          estimatedStayMinutes: 15,
        }),
        wp('alfama-miradouros', 3, 'Miradouro de Santa Luzia', [38.7118, -9.1302], {
          description: 'Bougainvillea, azulejo panels and terracotta roofs falling to the river.',
          proTip: 'The kiosk at Portas do Sol next door sells €2 ginjinha in chocolate cups.',
          estimatedStayMinutes: 25,
          localCost: '€2 ginjinha',
        }),
        wp('alfama-miradouros', 4, 'Castelo de São Jorge walls', [38.7139, -9.1335], {
          description: 'Walk the outside of the walls — you get the same views without the €15 entry.',
          proTip: 'Peacocks roam the lane by the north gate. Bring patience, not bread.',
          estimatedStayMinutes: 20,
        }),
        wp('alfama-miradouros', 5, 'Miradouro da Graça', [38.7163, -9.1316], {
          description: 'Pine trees, a terrace café and a view straight across to the castle.',
          proTip: 'Arrive 40 min before sunset — the good wall spots go fast.',
          estimatedStayMinutes: 30,
          localCost: '€1.80 Super Bock',
        }),
        wp('alfama-miradouros', 6, 'Senhora do Monte', [38.719, -9.1328], {
          description: 'The highest viewpoint in Lisbon. Finish here as the city lights come on.',
          proTip: 'Steep final climb — the stairs on Calçada do Monte are shorter than the road.',
          estimatedStayMinutes: 35,
          warning: 'Cobbles are slick after rain. Wear grippy shoes.',
        }),
      ],
      reel: [
        { id: 'r1', image: 'lisbon', caption: 'Tram 28 on the curve', location: [38.7101, -9.1331], author: 'joao.walks' },
        { id: 'r2', image: 'paris', caption: 'Laundry lines over Rua de São Miguel', location: [38.7112, -9.1289], author: 'ana.pinhole' },
        { id: 'r3', image: 'hero', caption: 'Graça after the storm', location: [38.7163, -9.1316], author: 'lukas_rides' },
      ],
      reviews: [
        { id: 'v1', author: 'ana.pinhole', rating: 5, date: '2026-10-12', kind: 'review', body: 'Every stop is a photo. My camera roll is 90% roofs now.' },
        { id: 'v2', author: 'lukas_rides', rating: 4, date: '2026-10-05', kind: 'obstacle', body: 'Scaffolding on Santa Luzia terrace — still accessible from the side steps.' },
      ],
    },
    3,
  ),
  build(
    {
      routeId: 'hanoi-egg-coffee',
      creatorId: 'u-linh',
      title: 'Egg Coffee to Train Street: Hanoi After Dark',
      tagline: 'A local’s loop of plastic-stool dinners, rooftop cafés and the train that squeezes through.',
      city: 'Hanoi',
      country: 'Vietnam',
      category: 'cafe_crawl',
      transportMode: 'walking',
      estimatedDurationMinutes: 210,
      completionCount: 97,
      likes: 1764,
      cover: 'hanoi',
      createdAt: '2026-10-03',
      waypoints: [
        wp('hanoi-egg-coffee', 1, 'Hoàn Kiếm Lake', [21.0285, 105.8522], {
          description: 'Walk the north shore past the red Huc Bridge as the lake lights up.',
          proTip: 'Weekend nights the streets around the lake go car-free.',
          estimatedStayMinutes: 20,
        }),
        wp('hanoi-egg-coffee', 2, 'Café Giảng', [21.0333, 105.8545], {
          description: 'The original egg coffee, served since 1946 down a narrow alley.',
          proTip: 'Order it hot, sitting in a bowl of warm water. Iced loses the custard texture.',
          estimatedStayMinutes: 30,
          localCost: '35,000₫ (~$1.40)',
        }),
        wp('hanoi-egg-coffee', 3, 'Tạ Hiện Beer Corner', [21.0357, 105.8519], {
          description: 'Bia hơi — fresh draught beer brewed daily — on stools facing the street.',
          proTip: 'Look for the yellow plastic jugs. That is the 15,000₫ fresh stuff.',
          estimatedStayMinutes: 40,
          localCost: '15,000₫ a glass',
          warning: 'Pickpockets work the crowd after 9pm.',
        }),
        wp('hanoi-egg-coffee', 4, 'Đồng Xuân Night Market', [21.0382, 105.8495], {
          description: 'Friday to Sunday night market spilling south from the old covered hall.',
          proTip: 'Bargain with a smile — start at 50% and settle around 70%.',
          estimatedStayMinutes: 35,
        }),
        wp('hanoi-egg-coffee', 5, 'Phở Bát Đàn', [21.0335, 105.8466], {
          description: 'Queue, pay, carry your own bowl. Worth every minute of the line.',
          proTip: 'Add a quẩy (fried dough) and dunk it.',
          estimatedStayMinutes: 25,
          localCost: '60,000₫ bowl',
        }),
        wp('hanoi-egg-coffee', 6, 'Train Street', [21.0285, 105.8445], {
          description: 'Houses and cafés inches from the tracks. Finish with a coffee as the evening train passes.',
          proTip: 'Buy a drink from a café — it is your ticket to sit trackside.',
          estimatedStayMinutes: 60,
          warning: 'Access is restricted on some nights. Check the reviews tab before heading out.',
        }),
      ],
      reel: [
        { id: 'r1', image: 'hanoi', caption: 'Bia hơi o’clock', location: [21.0357, 105.8519], author: 'linh.on.foot' },
        { id: 'r2', image: 'hostel', caption: 'Rooftop above Café Giảng', location: [21.0333, 105.8545], author: 'tom_eats' },
      ],
      reviews: [
        { id: 'v1', author: 'tom_eats', rating: 5, date: '2026-10-13', kind: 'review', body: 'Ate four dinners. No regrets. Egg coffee changed my life.' },
        { id: 'v2', author: 'nadia.k', rating: 3, date: '2026-10-10', kind: 'obstacle', body: 'Police closed Train Street on Thursday night — try the Phùng Hưng end instead.' },
      ],
    },
    11,
  ),
  build(
    {
      routeId: 'patagonia-thumb-line',
      creatorId: 'u-theo',
      title: 'The Thumb Line: Puerto Natales → El Calafate',
      tagline: 'Hitching the Patagonian steppe across the Chile–Argentina border with nothing but a sign and a thermos.',
      city: 'Puerto Natales',
      country: 'Chile',
      category: 'off_grid',
      transportMode: 'hitchhiking',
      estimatedDurationMinutes: 600,
      completionCount: 38,
      likes: 3290,
      cover: 'patagonia',
      createdAt: '2026-08-30',
      waypoints: [
        wp('patagonia-thumb-line', 1, 'Puerto Natales exit', [-51.7236, -72.4875], {
          description: 'Walk to the Ruta 9 roundabout at the north edge of town. Stand past the petrol station.',
          proTip: 'Write “CALAFATE” in big letters, plus “🇦🇷 frontera” — drivers decide in 2 seconds.',
          estimatedStayMinutes: 60,
        }),
        wp('patagonia-thumb-line', 2, 'Cerro Castillo border post', [-51.2667, -72.3333], {
          description: 'Chilean exit stamp. Tiny village with one café and a lot of patient hitchhikers.',
          proTip: 'Declare ALL fruit, dairy and meat. SAG fines are steep.',
          estimatedStayMinutes: 45,
          border: {
            from: 'Chile',
            to: 'Argentina',
            post: 'Cerro Castillo / Río Don Guillermo',
            hours: '08:00 – 22:00 (summer)',
            notes: '~1 km no-man’s-land on foot is allowed. Argentine side asks for onward proof occasionally.',
          },
        }),
        wp('patagonia-thumb-line', 3, 'La Esperanza junction', [-51.0167, -70.7833], {
          description: 'A gas station on Ruta 40 and the only hot food for 160 km.',
          proTip: 'Truckers fuel up here at dawn — ask directly at the pumps.',
          estimatedStayMinutes: 90,
          localCost: 'ARS empanadas ~ $2',
          warning: 'Wind gusts over 90 km/h. Keep your pack weighted down.',
        }),
        wp('patagonia-thumb-line', 4, 'El Calafate', [-50.3379, -72.2648], {
          description: 'Lago Argentino turquoise and the gateway to Perito Moreno glacier.',
          proTip: 'America del Sur hostel trades 4 hours of reception work for a bed — check Gigs.',
          estimatedStayMinutes: 120,
        }),
      ],
      reel: [
        { id: 'r1', image: 'patagonia', caption: 'Ride number three, 2h wait', location: [-51.1, -71.2], author: 'thumbs_south' },
        { id: 'r2', image: 'hero', caption: 'Ruta 40 at golden hour', location: [-50.7, -71.5], author: 'elle_unpaved' },
      ],
      reviews: [
        { id: 'v1', author: 'elle_unpaved', rating: 5, date: '2026-10-01', kind: 'review', body: 'Four rides, one sheep truck, one border. Best travel day of my life.' },
        { id: 'v2', author: 'marco.solo', rating: 4, date: '2026-09-21', kind: 'detour', body: 'If La Esperanza is dead, walk 2 km toward Río Gallegos — trucks pull over at the lay-by.' },
      ],
    },
    5,
    0.06,
  ),
  build(
    {
      routeId: 'budapest-ruin-bars',
      creatorId: 'u-rita',
      title: 'Ruin Bar Pub Crawl: District VII Unplugged',
      tagline: 'Crumbling courtyards, €2 pálinka and the hostel crowd’s favourite night out.',
      city: 'Budapest',
      country: 'Hungary',
      category: 'hostel_pub_crawl',
      transportMode: 'walking',
      estimatedDurationMinutes: 240,
      completionCount: 512,
      likes: 5210,
      cover: 'hostel',
      createdAt: '2026-09-20',
      waypoints: [
        wp('budapest-ruin-bars', 1, 'Szimpla Kert', [47.497, 19.0633], {
          description: 'The original ruin bar. Bathtub seats, a Trabant and rooms that never end.',
          proTip: 'Go before 9pm to actually see it. After 10 it is shoulder-to-shoulder.',
          estimatedStayMinutes: 60,
          localCost: '1,200 Ft beer',
        }),
        wp('budapest-ruin-bars', 2, 'Kőleves Kert', [47.4975, 19.062], {
          description: 'Hammocks, fairy lights and the best lángos on the crawl.',
          proTip: 'Garlic and sour cream lángos is the move. Share — it is huge.',
          estimatedStayMinutes: 40,
        }),
        wp('budapest-ruin-bars', 3, 'Gozsdu Udvar', [47.4983, 19.059], {
          description: 'A passage of linked courtyards stuffed with bars and street food.',
          proTip: 'Friday flea market here in the day — come back sober for vintage finds.',
          estimatedStayMinutes: 45,
        }),
        wp('budapest-ruin-bars', 4, 'Mazel Tov', [47.5008, 19.066], {
          description: 'Leafy, glass-roofed courtyard. A softer landing for the night.',
          proTip: 'Book a table on weekends or eat at the bar.',
          estimatedStayMinutes: 45,
        }),
        wp('budapest-ruin-bars', 5, 'Instant-Fogas', [47.502, 19.062], {
          description: 'Seven bars, multiple dance floors. Finish whenever your legs give out.',
          proTip: 'Night bus 6 runs 24/7 along the Grand Boulevard right outside.',
          estimatedStayMinutes: 90,
          warning: 'Card-only bars after midnight. Keep a little forint just in case.',
        }),
      ],
      reel: [
        { id: 'r1', image: 'hostel', caption: 'Szimpla’s courtyard on a Tuesday', location: [47.497, 19.0633], author: 'ruinbar_rita' },
      ],
      reviews: [
        { id: 'v1', author: 'liam.hostels', rating: 5, date: '2026-10-14', kind: 'review', body: 'Joined with 9 people from my hostel, lost 4 by Gozsdu, found 2 new friends. 10/10.' },
      ],
    },
    13,
  ),
]

export const routeById = (id: string) => routes.find((r) => r.routeId === id)
