// Baixa as imagens do site original e gera versões WebP otimizadas em public/img.
// Uso: node scripts/fetch-assets.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'https://assets.zyrosite.com/4SsuTtHdVe12zXTZ/'
const OUT = path.resolve('public/img')

const photos = {
  'projeto-3d': 'projeto-3d-NQPRKU5qsOJWgXPb.jpg',
  'projeto-tela': 'gpt-image-2_quero_uma_imagem_fotorealista_de_um_projeto_ela-c-trico_na_tela_de_um_computador-0-n1sW4sQ2lMX0ENmG.jpg',
  'ponte-rolante': 'whatsapp-image-2026-07-11-at-21.51.13-iNuJi6QW1KgXMArp.jpeg',
  'foto-2': 'whatsapp-image-2026-07-11-at-22.02.07-cozxqm0XQa4kfA4Z.jpeg',
  'foto-3': 'whatsapp-image-2026-07-11-at-22.07.32-WZM6DRkXTGC9hAfG.jpeg',
  'foto-4': 'whatsapp-image-2026-07-11-at-23.24.23-crw7utddpCgfGKj3.jpeg',
  'foto-5': 'whatsapp-image-2026-07-13-at-21.13.42-d4OJwUIPPMtk3iey.jpeg',
  'foto-6': 'whatsapp-image-2026-07-13-at-21.26.33-BgU2zdFbuwr9sZGr.jpeg',
  'foto-7': 'whatsapp-image-2026-07-13-at-22.23.14-OGG8o8DSFUMr3Ea0.jpeg',

  // Subpágina Programação de CLP
  'clp-ihm-painel': 'whatsapp-image-2026-07-23-at-15.08.16-nXcstJXELndNYRNi.jpeg',
  'clp-ihm': 'whatsapp-image-2026-07-23-at-17.58.55-FcaMZ5Qsf1uxXBTZ.jpeg',
  'clp-startup': 'whatsapp-image-2026-07-23-at-20.50.59-V32E3IydjioZWdd3.jpeg',
  'clp-opc': 'whatsapp-image-2026-07-23-at-21.17.44-UWZ3Xr6UR8YKywCR.jpeg',
  'clp-modbus': 'whatsapp-image-2026-07-23-at-21.36.07-TVN5O7Rylz03Fm5R.jpeg',
  'clp-can': 'whatsapp-image-2026-07-23-at-21.55.09-vwdfqpYXg4iwMxC6.jpeg',
  'clp-arquitetura': 'whatsapp-image-2026-07-23-at-21.58.48-Y3Pk3tVJwfzpgz0a.jpeg',

  // Subpágina Movimentação de carga
  'carga-roletes': 'chatgpt-image-21-de-jul.-de-2026-14_52_43-6rXfNO8Ecq2cNG4R.png',
  'carga-braco': 'chatgpt-image-21-de-jul.-de-2026-15_19_12-0hI6MRWGcj6URvFS.png',
  'carga-ponte-galpao': 'chatgpt-image-21-de-jul.-de-2026-15_57_11-S7N0FRaRfKRYV7wc.png',
  'carga-portico': 'chatgpt-image-22-de-jul.-de-2026-15_58_53-JlQWuPELW96bm9dc.png',
  'carga-retrofit': 'chatgpt-image-22-de-jul.-de-2026-16_33_01-QHKxTdQlyPZEYseH.png',
  'carga-ponte': 'ponte-editada-3-uiv4rKg6Ir9apYja.png',

  // Subpágina Painéis Elétricos
  'painel-bornes': 'bszrsq-mZlM6pIFy5BeZnbl.png',
  'painel-io': 'n3ejkh-K6WppofceB20DzXA.png',
  'painel-barramento': 'r1ygya-reP4F1LgCRQEpfE4.png',
  'painel-montagem': 'ub6b5s-N8qmDupRkcUPIfOV.png',

  // Subpágina Integração de Sistemas
  'int-painel': 'x2roxt-rnqJbkL0Z1Xm0Isr.png',
}
const WIDTHS = [360, 640, 960]

async function get(file) {
  const res = await fetch(SRC + file)
  if (!res.ok) throw new Error(`${res.status} ${file}`)
  return Buffer.from(await res.arrayBuffer())
}

await mkdir(OUT, { recursive: true })
const meta = {}

for (const [name, file] of Object.entries(photos)) {
  const buf = await get(file)
  const info = await sharp(buf).metadata()
  const widths = [...new Set(WIDTHS.map((w) => Math.min(w, info.width)))]
  meta[name] = { w: info.width, h: info.height, widths }
  for (const w of widths) {
    await sharp(buf).resize({ width: w }).webp({ quality: 72 }).toFile(path.join(OUT, `${name}-${w}.webp`))
  }
  console.log('ok', name, info.width, 'x', info.height)
}

const logo = await get('soluassaues-logo3-rIGXrxvrfW1nw00v.png')
await sharp(logo).resize({ height: 96 }).webp({ quality: 90 }).toFile(path.join(OUT, 'logo.webp'))
await sharp(logo).resize({ height: 96 }).png().toFile(path.join(OUT, 'logo.png'))
await sharp(logo).resize(192, 192, { fit: 'contain', background: '#0A0F1D' }).png().toFile(path.join(OUT, 'icon-192.png'))
await sharp(logo).resize(512, 512, { fit: 'contain', background: '#0A0F1D' }).png().toFile(path.join(OUT, 'icon-512.png'))
const lm = await sharp(logo).metadata()
meta.logo = { w: lm.width, h: lm.height }

await writeFile(path.resolve('src/data/images.json'), JSON.stringify(meta, null, 2))
console.log('logo', lm.width, 'x', lm.height)
