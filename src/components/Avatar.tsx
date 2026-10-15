const SWATCHES = [
  ['var(--color-crimson-violet)', '#F3EFE6'],
  ['var(--color-willow-grove)', '#F3EFE6'],
  ['var(--color-whiskey)', 'var(--color-kelp)'],
  ['var(--color-dusty-lavender)', '#F3EFE6'],
  ['var(--color-kelp)', 'var(--color-whiskey)'],
]

export function Avatar({ handle, size = 'size-10' }: { handle: string; size?: string }) {
  const hash = [...handle].reduce((a, c) => a + c.charCodeAt(0), 0)
  const [bg, fg] = SWATCHES[hash % SWATCHES.length]
  return (
    <span
      className={`${size} grid shrink-0 place-items-center rounded-full text-sm font-extrabold uppercase ring-2 ring-white`}
      style={{ background: bg, color: fg }}
      aria-hidden="true"
    >
      {handle.replace(/[^a-z]/gi, '').slice(0, 2)}
    </span>
  )
}
