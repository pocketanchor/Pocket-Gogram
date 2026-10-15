import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cumulative, haversine, pointAlong, type LatLng } from '@/lib/geo'
import type { Route, Waypoint } from '@/data/fixtures'

/** Proximity radius for waypoint triggers, per spec. */
export const PROXIMITY_METERS = 25
/** A full simulated run takes roughly this long at 1×. */
const BASE_RUN_SECONDS = 45

export interface Arrival {
  waypoint: Waypoint
  at: number
}

/**
 * Simulated "Play & Explore" session. Moves a GPS fix along the route
 * polyline and fires geofence arrivals within PROXIMITY_METERS of each stop.
 * A later milestone swaps the simulated fix for navigator.geolocation.
 */
export function useRoutePlayer(route: Route) {
  const cum = useMemo(() => cumulative(route.polyline), [route])
  const total = cum[cum.length - 1]

  // Along-path distance of each waypoint (nearest polyline vertex).
  const stopMeters = useMemo(
    () =>
      route.waypoints.map((w) => {
        let best = 0
        let bestD = Infinity
        route.polyline.forEach((p, i) => {
          const d = haversine(p, w.location)
          if (d < bestD) [bestD, best] = [d, i]
        })
        return cum[best]
      }),
    [route, cum],
  )

  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [reached, setReached] = useState<Set<number>>(new Set())
  const [arrival, setArrival] = useState<Arrival | null>(null)
  const [conquered, setConquered] = useState(false)
  const [showConquered, setShowConquered] = useState(false)
  const last = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) {
      last.current = null
      return
    }
    let raf = 0
    const tick = (t: number) => {
      const dt = last.current == null ? 0 : (t - last.current) / 1000
      last.current = t
      setProgress((p) => Math.min(total, p + (total / BASE_RUN_SECONDS) * speed * dt))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, speed, total])

  // Geofence check
  useEffect(() => {
    if (!playing && progress === 0) return
    route.waypoints.forEach((w, i) => {
      if (reached.has(w.sequenceOrder)) return
      if (progress >= stopMeters[i] - PROXIMITY_METERS) {
        setReached((prev) => new Set(prev).add(w.sequenceOrder))
        setArrival({ waypoint: w, at: Date.now() })
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(80)
      }
    })
    if (progress >= total && !conquered) {
      setPlaying(false)
      setConquered(true)
      setShowConquered(true)
    }
  }, [progress, playing, route, stopMeters, reached, total, conquered])

  const position: LatLng | null = progress > 0 || playing ? pointAlong(route.polyline, cum, progress) : null
  const nextIndex = route.waypoints.findIndex((w) => !reached.has(w.sequenceOrder))
  const nextStop = nextIndex >= 0 ? route.waypoints[nextIndex] : null
  const toNext = nextIndex >= 0 ? Math.max(0, stopMeters[nextIndex] - progress) : 0

  const reset = useCallback(() => {
    setPlaying(false)
    setProgress(0)
    setReached(new Set())
    setArrival(null)
    setConquered(false)
    setShowConquered(false)
  }, [])

  const start = useCallback(() => {
    if (conquered) reset()
    setPlaying(true)
  }, [conquered, reset])

  const pause = useCallback(() => setPlaying(false), [])
  const dismissArrival = useCallback(() => setArrival(null), [])
  const dismissConquered = useCallback(() => setShowConquered(false), [])

  return {
    progress,
    total,
    playing,
    speed,
    setSpeed,
    start,
    pause,
    reset,
    reached,
    arrival,
    dismissArrival,
    conquered,
    showConquered,
    dismissConquered,
    position,
    nextStop,
    toNext,
    active: progress > 0 || playing,
  }
}
