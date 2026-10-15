import { useId, useMemo } from 'react'
import { cumulative, makeProjector, pointAlong, type LatLng } from '@/lib/geo'
import type { Route } from '@/data/fixtures'

interface RouteMapProps {
  route: Route
  width?: number
  height?: number
  variant?: 'preview' | 'full'
  /** Meters travelled along the polyline; draws the completed trail. */
  progressMeters?: number
  /** Live position marker (e.g. simulated GPS). */
  position?: LatLng | null
  activeWaypoint?: number | null
  reachedWaypoints?: Set<number>
  onSelectWaypoint?: (seq: number) => void
  animate?: boolean
}

export function RouteMap({
  route,
  width = 600,
  height = 340,
  variant = 'preview',
  progressMeters,
  position,
  activeWaypoint,
  reachedWaypoints,
  onSelectWaypoint,
  animate = false,
}: RouteMapProps) {
  const full = variant === 'full'
  const glowId = `glow-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const pad = full ? 56 : 34

  const { d, project, cum, length } = useMemo(() => {
    const project = makeProjector(route.polyline, width, height, pad)
    const pts = route.polyline.map(project)
    let length = 0
    for (let i = 1; i < pts.length; i++)
      length += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    return {
      d: pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' '),
      project,
      cum: cumulative(route.polyline),
      length: Math.ceil(length),
    }
  }, [route, width, height, pad])

  const progressD = useMemo(() => {
    if (!progressMeters) return null
    const pts: LatLng[] = []
    for (let i = 0; i < route.polyline.length && cum[i] <= progressMeters; i++) pts.push(route.polyline[i])
    pts.push(pointAlong(route.polyline, cum, progressMeters))
    return pts
      .map(project)
      .map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(' ')
  }, [progressMeters, route, cum, project])

  const pinR = full ? 15 : 11
  const pos = position ? project(position) : null

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block h-full w-full"
      role="img"
      aria-label={`Route map: ${route.waypoints.map((w) => w.title).join(', ')}`}
    >
      <defs>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Casing + glow under the trail */}
      <path d={d} fill="none" stroke="var(--color-kelp)" strokeOpacity={0.18} strokeWidth={full ? 14 : 10} strokeLinecap="round" strokeLinejoin="round" filter={`url(#${glowId})`} />
      <path d={d} fill="none" stroke="#F3EFE6" strokeWidth={full ? 8 : 6} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={d}
        fill="none"
        stroke="var(--map-polyline-active)"
        strokeWidth={full ? 4.5 : 3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={progressD ? '2 7' : undefined}
        className={animate ? 'draw-path' : undefined}
        style={animate ? ({ '--len': length } as React.CSSProperties) : undefined}
      />
      {progressD && (
        <path d={progressD} fill="none" stroke="var(--color-kelp)" strokeWidth={full ? 6 : 4} strokeLinecap="round" strokeLinejoin="round" />
      )}

      {route.waypoints.map((w) => {
        const [x, y] = project(w.location)
        const isBorder = !!w.border
        const isActive = activeWaypoint === w.sequenceOrder
        const reached = reachedWaypoints?.has(w.sequenceOrder)
        const fill = isBorder ? 'var(--color-tamarillo)' : reached ? 'var(--color-kelp)' : 'var(--color-whiskey)'
        const textFill = isBorder || reached ? '#F3EFE6' : 'var(--color-kelp)'
        return (
          <g
            key={w.waypointId}
            transform={`translate(${x} ${y})`}
            onClick={onSelectWaypoint ? () => onSelectWaypoint(w.sequenceOrder) : undefined}
            className={onSelectWaypoint ? 'cursor-pointer' : undefined}
            role={onSelectWaypoint ? 'button' : undefined}
            aria-label={onSelectWaypoint ? `Stop ${w.sequenceOrder}: ${w.title}` : undefined}
          >
            {isActive && <circle r={pinR} fill={fill} className="ping-soft" />}
            <circle r={pinR + 3} fill="#F3EFE6" opacity={0.95} />
            <circle r={pinR} fill={fill} stroke={isActive ? 'var(--color-kelp)' : 'none'} strokeWidth={2.5} />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontWeight={700}
              fontSize={full ? 13 : 10}
              fill={textFill}
            >
              {isBorder ? '⇄' : w.sequenceOrder}
            </text>
            {full && (() => {
              const labelW = w.title.length * 7 + 14
              const flip = x + pinR + 8 + labelW > width - 8
              return (
                <g transform={`translate(${flip ? -(pinR + 8 + labelW) : pinR + 8} 0)`} className="pointer-events-none">
                  <rect x={-3} y={-11} rx={5} height={22} width={labelW} fill="#F3EFE6" fillOpacity={isActive ? 1 : 0.85} />
                  <text x={4} dominantBaseline="central" fontSize={12} fontWeight={600} fill="var(--color-kelp)" fontFamily="var(--font-display)">
                    {w.title}
                  </text>
                </g>
              )
            })()}
          </g>
        )
      })}

      {pos && (
        <g transform={`translate(${pos[0]} ${pos[1]})`}>
          <circle r={10} fill="var(--color-tamarillo)" className="ping-soft" />
          <circle r={9} fill="#fff" />
          <circle r={6} fill="var(--color-tamarillo)" />
        </g>
      )}
    </svg>
  )
}
