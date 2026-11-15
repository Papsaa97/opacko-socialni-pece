import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { deflateSync } from 'node:zlib';

// Precompute IEEE 802.3 CRC32 lookup table for valid PNG chunks
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePngRgba(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * stride;
    raw[rowStart] = 0; // filter type None
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }

  const idatData = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function cubicPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return [
    mt2 * mt * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t2 * t * p3[0],
    mt2 * mt * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t2 * t * p3[1],
  ];
}

// Symmetric heart in 64x64 viewBox (fits safely inside central 80% maskable safe zone)
const HEART_SEGMENTS = [
  [[32, 49.5], [22, 42.5], [15.5, 34.8], [15.5, 27.2]],
  [[15.5, 27.2], [15.5, 21.3], [20.2, 16.8], [25.8, 16.8]],
  [[25.8, 16.8], [28.9, 16.8], [31.1, 18.4], [32, 20.8]],
  [[32, 20.8], [32.9, 18.4], [35.1, 16.8], [38.2, 16.8]],
  [[38.2, 16.8], [43.8, 16.8], [48.5, 21.3], [48.5, 27.2]],
  [[48.5, 27.2], [48.5, 34.8], [42, 42.5], [32, 49.5]],
];

const HEART_POLYGON = [];
const STEPS_PER_SEG = 36;
for (const [p0, p1, p2, p3] of HEART_SEGMENTS) {
  for (let i = 0; i < STEPS_PER_SEG; i += 1) {
    HEART_POLYGON.push(cubicPoint(p0, p1, p2, p3, i / STEPS_PER_SEG));
  }
}

function pointInPolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const xi = poly[i][0];
    const yi = poly[i][1];
    const xj = poly[j][0];
    const yj = poly[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function distToSegment(px, py, ax, ay, bx, by) {
  const vx = bx - ax;
  const vy = by - ay;
  const wx = px - ax;
  const wy = py - ay;
  const lenSq = vx * vx + vy * vy;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, (wx * vx + wy * vy) / lenSq));
  const dx = px - (ax + t * vx);
  const dy = py - (ay + t * vy);
  return Math.hypot(dx, dy);
}

function insideRoundedBox(x, y, size, radius) {
  if (radius <= 0) return true;
  const min = radius;
  const max = size - radius;
  const cx = Math.max(min, Math.min(max, x));
  const cy = Math.max(min, Math.min(max, y));
  return Math.hypot(x - cx, y - cy) <= radius;
}

function renderIcon(size, { roundedCorners }) {
  const rgba = Buffer.alloc(size * size * 4);
  const samples = 4; // 4x4 supersampling for smooth edges
  const invSamplesSq = 1 / (samples * samples);
  const scale = 64 / size;

  // Brand colors
  const TEAL_TOP = [15, 118, 110]; // #0f766e
  const TEAL_BOTTOM = [13, 102, 95]; // subtle depth gradient
  const AMBER = [245, 158, 11]; // #f59e0b
  const WHITE = [255, 255, 255];

  for (let py = 0; py < size; py += 1) {
    const tGrad = py / (size - 1);
    const bgR = TEAL_TOP[0] * (1 - tGrad) + TEAL_BOTTOM[0] * tGrad;
    const bgG = TEAL_TOP[1] * (1 - tGrad) + TEAL_BOTTOM[1] * tGrad;
    const bgB = TEAL_TOP[2] * (1 - tGrad) + TEAL_BOTTOM[2] * tGrad;

    for (let px = 0; px < size; px += 1) {
      let accR = 0;
      let accG = 0;
      let accB = 0;
      let accA = 0;

      for (let sy = 0; sy < samples; sy += 1) {
        const y64 = (py + (sy + 0.5) / samples) * scale;
        for (let sx = 0; sx < samples; sx += 1) {
          const x64 = (px + (sx + 0.5) / samples) * scale;

          const inBg = roundedCorners
            ? insideRoundedBox(x64, y64, 64, 15)
            : true;

          if (!inBg) {
            continue;
          }

          let r = bgR;
          let g = bgG;
          let b = bgB;

          if (pointInPolygon(x64, y64, HEART_POLYGON)) {
            r = AMBER[0];
            g = AMBER[1];
            b = AMBER[2];
          }

          const inCross =
            distToSegment(x64, y64, 32, 24.5, 32, 36.5) <= 1.85 ||
            distToSegment(x64, y64, 26, 30.5, 38, 30.5) <= 1.85;

          if (inCross) {
            r = WHITE[0];
            g = WHITE[1];
            b = WHITE[2];
          }

          accR += r;
          accG += g;
          accB += b;
          accA += 255;
        }
      }

      const idx = (py * size + px) * 4;
      if (accA === 0) {
        rgba[idx] = 0;
        rgba[idx + 1] = 0;
        rgba[idx + 2] = 0;
        rgba[idx + 3] = 0;
      } else {
        // Un-premultiply RGB so semi-transparent border pixels stay clean #0f766e
        const samplesHit = accA / 255;
        rgba[idx] = Math.round(accR / samplesHit);
        rgba[idx + 1] = Math.round(accG / samplesHit);
        rgba[idx + 2] = Math.round(accB / samplesHit);
        rgba[idx + 3] = Math.round(accA * invSamplesSq);
      }
    }
  }

  return encodePngRgba(size, size, rgba);
}

const targets = [
  { filename: 'public/icon-192.png', size: 192, roundedCorners: true },
  { filename: 'public/icon-512.png', size: 512, roundedCorners: true },
  // Apple iOS home screen icons should be opaque (iOS turns transparent corners black)
  { filename: 'public/apple-touch-icon.png', size: 180, roundedCorners: false },
];

for (const target of targets) {
  const abs = resolve(process.cwd(), target.filename);
  mkdirSync(dirname(abs), { recursive: true });
  const png = renderIcon(target.size, { roundedCorners: target.roundedCorners });
  writeFileSync(abs, png);
  console.log(`Generated ${target.filename} (${png.length} B)`);
}
