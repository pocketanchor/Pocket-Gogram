// Lightweight geo helpers for the client-side Movement Engine preview.
// Coordinates are [lat, lng] in WGS84 (SRID 4326), matching the PostGIS schema.

export type LatLng = [number, number]

const EARTH_RADIUS_M = 6_371_000
const toRad = (deg: number) => (deg * Math.PI) / 180

export function haversine(a: LatLng, b: LatLng): number {
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h))
}

export function pathLength(points: LatLng[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) total += haversine(points[i - 1], points[i])
  return total
}

/** Cumulative distance (m) at each vertex. */
export function cumulative(points: LatLng[]): number[] {
  const out = [0]
  for (let i = 1; i < points.length; i++) out.push(out[i - 1] + haversine(points[i - 1], points[i]))
  return out
}

/** Interpolated position at `meters` along the path. */
export function pointAlong(points: LatLng[], cum: number[], meters: number): LatLng {
  if (meters <= 0) return points[0]
  const last = cum[cum.length - 1]
  if (meters >= last) return points[points.length - 1]
  let i = 1
  while (cum[i] < meters) i++
  const t = (meters - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
  const [a, b] = [points[i - 1], points[i]]
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

/**
 * Builds a breadcrumb-style polyline through the given stops, adding
 * deterministic wobble so previews look like real GPS traces.
 */
export function breadcrumbs(stops: LatLng[], seed = 1, perLeg = 10, wobble = 0.12): LatLng[] {
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647 - 0.5
  }
  const out: LatLng[] = []
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, b] = [stops[i], stops[i + 1]]
    const dLat = b[0] - a[0]
    const dLng = b[1] - a[1]
    const bend = rand() * 2
    for (let k = 0; k < perLeg; k++) {
      const t = k / perLeg
      const arc = Math.sin(t * Math.PI) * bend * wobble
      const jitter = rand() * wobble * 0.25 * Math.sin(t * Math.PI)
      out.push([a[0] + dLat * t - dLng * (arc + jitter), a[1] + dLng * t + dLat * (arc + jitter)])
    }
  }
  out.push(stops[stops.length - 1])
  return out
}

/** Fits lat/lng points into an SVG viewport, preserving aspect via cos(lat) scaling. */
export function makeProjector(points: LatLng[], width: number, height: number, pad = 24) {
  const lats = points.map((p) => p[0])
  const lngs = points.map((p) => p[1])
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)]
  const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)]
  const k = Math.cos(toRad((minLat + maxLat) / 2))
  const spanX = Math.max((maxLng - minLng) * k, 1e-6)
  const spanY = Math.max(maxLat - minLat, 1e-6)
  const scale = Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY)
  const offX = (width - spanX * scale) / 2
  const offY = (height - spanY * scale) / 2
  return (p: LatLng): [number, number] => [
    offX + (p[1] - minLng) * k * scale,
    offY + (maxLat - p[0]) * scale,
  ]
}

export function formatDistance(m: number): string {
  return m >= 10_000 ? `${Math.round(m / 1000)} km` : `${(m / 1000).toFixed(1)} km`
}

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (!h) return `${m}m`
  return m ? `${h}h ${m}m` : `${h}h`
}

export function formatCoord([lat, lng]: LatLng): string {
  const ns = lat >= 0 ? 'N' : 'S'
  const ew = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(4)}°${ns} ${Math.abs(lng).toFixed(4)}°${ew}`
}
