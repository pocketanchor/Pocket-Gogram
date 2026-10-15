/** Serves a generated image from /public/img through the Netlify Image CDN. */
export function img(name: string, width: number, quality = 72) {
  return `/.netlify/images?url=/img/${name}.png&w=${width}&q=${quality}&fm=webp`
}
