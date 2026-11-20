import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { chromium, type Page } from 'playwright';

/**
 * Makes the home page's pictures of the showcase apps on real devices: photos from Unsplash of laptops, tablets and
 * phones with blank screens, two screens of each app in its theme placed on them in perspective, with the photo's own
 * light and shade over it. Run it against the docs, e.g. `yarn docs:serve`:
 *
 *   yarn docs:home-devices [docs URL, by default http://localhost:4100] [app-screen …, by default all]
 *
 * The photos are downloaded as it runs, under the Unsplash License; the pictures it saves are credited in
 * `assets/home-pictures/devices/CREDITS.md`.
 */

const [base = 'http://localhost:4100', ...only] = process.argv.slice(2);
const outDir = join(import.meta.dirname, '../../packages/docs/public/assets/home-pictures/devices');

// Each device's screen in CSS pixels, which the app lays out at.
const LAPTOP = { width: 1280, height: 832 };
const DESKTOP = { width: 1440, height: 820 };
const TABLET = { width: 768, height: 1024 };
const PHONE = { width: 393, height: 852 };

interface DeviceShot {
  /** The app, which is also its theme's id, and the screen shown. */
  app: string;
  screen: string;
  /** The Unsplash photo's id. */
  photo: string;
  device: { width: number; height: number };
  /**
   * The screen's corners in the photo, roughly: top left, top right, bottom right and bottom left as the app shows on
   * it. Each side is fitted to the screen's edge from there.
   */
  corners: [number, number][];
  /**
   * A dark screen's bezel, in the photo's pixels: its glass is one colour from edge to edge, so the screen found is the
   * whole glass, and the app is set in from it by this much. One width, or the top, right, bottom and left ones.
   */
  bezel?: number | [number, number, number, number];
  /**
   * Marks to paint out of the photo, such as a maker's name or logo: outlines in the photo's pixels, each filled in from
   * what's around it.
   */
  retouch?: [number, number][][];
  /** The display's corner radius in the app's pixels, which a bezel shows: a phone's are round. */
  radius?: number;
  /** The part of the photo saved, around the device, so its screen fills the picture: x, y, width and height. */
  crop: [number, number, number, number];
}

// The photos are 1800px wide. Each picture is saved as `<app>-<screen>.webp`.
const SHOTS: DeviceShot[] = [
  {
    app: 'relay',
    screen: 'home',
    photo: 'CGXm9WavLeo',
    device: LAPTOP,
    corners: [[706, 454], [1429, 532], [1372, 866], [722, 787]],
    crop: [420, 330, 1200, 950],
  },
  {
    app: 'relay',
    screen: 'events',
    photo: 'psGV5KhidlY',
    device: LAPTOP,
    corners: [[313, 277], [997, 275], [1056, 719], [372, 788]],
    bezel: [14, 12, 1, 15],
    crop: [200, 150, 1300, 950],
    retouch: [[[711, 768.5], [768, 764], [768, 777.5], [711, 781]]],
  },
  {
    app: 'book',
    screen: 'home',
    photo: 'TrAkfLXukpQ',
    device: LAPTOP,
    corners: [[490, 128], [1289, 113], [1298, 639], [515, 665]],
    crop: [300, 30, 1300, 880],
  },
  {
    app: 'book',
    screen: 'book',
    photo: 'voRfgeyiBKA',
    device: PHONE,
    corners: [[730, 395], [1396, 380], [1373, 1848], [700, 1848]],
    crop: [380, 230, 1300, 1900],
  },
  {
    app: 'summit',
    screen: 'home',
    photo: 'ozr4NhRNXEc',
    device: LAPTOP,
    corners: [[615, 240], [1478, 210], [1478, 853], [615, 827]],
    crop: [420, 120, 1260, 940],
  },
  {
    app: 'summit',
    screen: 'agenda',
    photo: 'wODRXggLv1E',
    device: PHONE,
    corners: [[823, 176], [1101, 208], [989, 865], [702, 806]],
    bezel: [8, 8, 9, 10],
    radius: 56,
    crop: [520, 100, 760, 900],
  },
  {
    app: 'hub',
    screen: 'home',
    photo: '8IkP2_AEsDU',
    device: LAPTOP,
    corners: [[492, 145], [1238, 143], [1235, 654], [498, 658]],
    crop: [280, 70, 1240, 930],
  },
  {
    app: 'hub',
    screen: 'tickets',
    photo: 'tsyO2_Q-kTU',
    device: LAPTOP,
    corners: [[469, 275], [1330, 275], [1330, 843], [469, 843]],
    crop: [300, 150, 1200, 950],
  },
  {
    app: 'portfolio',
    screen: 'home',
    photo: 'mBaLh5TLNPM',
    device: TABLET,
    corners: [[572, 313], [1115, 313], [1115, 1044], [569, 1044]],
    crop: [440, 240, 980, 870],
  },
  {
    app: 'portfolio',
    screen: 'work',
    photo: '183F_vNaN8A',
    device: DESKTOP,
    corners: [[408, 263], [1395, 256], [1404, 845], [405, 850]],
    bezel: 30,
    crop: [120, 120, 1500, 1000],
  },
  {
    app: 'learn',
    screen: 'catalogue',
    photo: '5RcSaLT_PrE',
    device: TABLET,
    corners: [[544, 280], [1069, 285], [1071, 989], [538, 993]],
    crop: [400, 200, 960, 850],
  },
  {
    app: 'learn',
    screen: 'lesson',
    photo: 'xbFX7qCoAqI',
    device: LAPTOP,
    corners: [[681, 263], [1401, 289], [1300, 862], [593, 745]],
    bezel: [14, 10, 0, 14],
    crop: [100, 180, 1400, 1000],
    retouch: [[[885, 832], [943, 843], [943, 856], [885, 846.5]]],
  },
  {
    app: 'wallet',
    screen: 'overview',
    photo: 'dBESAHgPL6c',
    device: PHONE,
    corners: [[1062, 184], [1593, 396], [729, 1001], [198, 742]],
    crop: [140, 100, 1540, 1060],
  },
  {
    app: 'wallet',
    screen: 'budgets',
    photo: 'J5nqcKfrkpk',
    device: PHONE,
    corners: [[639, 212], [1099, 161], [1099, 1643], [639, 1571]],
    crop: [380, 60, 1040, 1740],
  },
  {
    app: 'pulse',
    screen: 'today',
    photo: 'u1b6E6IkSGQ',
    device: PHONE,
    corners: [[603, 171], [1242, 171], [1238, 1548], [599, 1548]],
    crop: [300, 90, 1200, 1500],
  },
  {
    app: 'pulse',
    screen: 'trends',
    photo: 'ikAlhV_zCHo',
    device: PHONE,
    corners: [[923, 255], [1161, 257], [1153, 775], [910, 775]],
    crop: [700, 170, 700, 700],
  },
  {
    app: 'stay',
    screen: 'search',
    photo: 'X4S-G_Q9U9g',
    device: PHONE,
    corners: [[958, 126], [1289, 126], [1289, 833], [958, 833]],
    crop: [840, 50, 880, 940],
    retouch: [[[1428, 540], [1506, 540], [1506, 651], [1428, 651]]],
  },
  {
    app: 'stay',
    screen: 'listing',
    photo: 'ZPGembOJ9kI',
    device: TABLET,
    corners: [[621, 885], [1328, 888], [1329, 1828], [623, 1829]],
    crop: [440, 700, 1100, 1300],
  },
];

/** The saved pictures' width, which a tile draws at up to about 760 pixels on a 2× screen. */
const WIDTH = 1400;
/**
 * The apps are captured at this pixel density, like a phone's or a laptop's screen, and the photo composed at it too,
 * then scaled down: a screen's text stays sharp, the more so a phone's, which is wider in the photo than in CSS pixels.
 */
const SCALE = 2;

const browser = await chromium.launch();
try {
  mkdirSync(outDir, { recursive: true });
  for (const shot of SHOTS.filter(({ app, screen }) => !only.length || only.includes(`${app}-${screen}`))) {
    const screenshot = await capture(shot);
    const response = await fetch(`https://unsplash.com/photos/${shot.photo}/download?w=1800`);
    if (!response.ok) {
      throw new Error(`Unsplash photo ${shot.photo}: ${response.status}`);
    }
    const photo = Buffer.from(await response.arrayBuffer());
    const page = await browser.newPage({ viewport: { width: 1800, height: 1800 }, deviceScaleFactor: SCALE });
    const webp = await compose(page, shot, photo, screenshot);
    await page.close();
    const file = join(outDir, `${shot.app}-${shot.screen}.webp`);
    writeFileSync(file, webp);
    console.log(file);
  }
} finally {
  await browser.close();
}

/** The app's screen at the device's size, in its theme. */
async function capture({ app, screen, device }: DeviceShot): Promise<Buffer> {
  const context = await browser.newContext({ viewport: device, deviceScaleFactor: SCALE });
  const page = await context.newPage();
  await page.goto(`${base}/example/showcase/${app}/${screen}?theme=${app}`, { waitUntil: 'networkidle' });
  // Without the button whose menu shows the code and customises the theme.
  await page.addStyleTag({ content: 'ngd-example > .controls { display: none !important; }' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  const screenshot = await page.screenshot();
  await context.close();
  return screenshot;
}

/**
 * The photo with the screenshot on its screen, as WebP: the screen is the region of the colour at its middle, its sides
 * fitted to that region's edge; the screenshot is warped onto it, everything that isn't screen (a notch, a finger)
 * stays in front, and the photo's light and shade on the screen are multiplied over the app.
 */
async function compose(page: Page, shot: DeviceShot, photo: Buffer, screenshot: Buffer): Promise<Buffer> {
  await page.setContent('<body style="margin:0"></body>');
  const size = await page.evaluate(
    async ({ photoData, screenshotData, corners: rough, device, bezel, retouch, radius }) => {
      const load = async (src: string) => {
        const image = new Image();
        image.src = src;
        await image.decode();
        return image;
      };
      const image = await load(`data:image/jpeg;base64,${photoData}`);
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const canvas = new OffscreenCanvas(width, height);
      const drawing = canvas.getContext('2d');
      if (!drawing) {
        throw new Error('No canvas');
      }
      drawing.drawImage(image, 0, 0);
      // The marks painted out: each outline's pixels smoothed in from the ones around it, as heat spreads, then given
      // back the surface's grain.
      for (const outline of retouch) {
        const left = Math.floor(Math.min(...outline.map(([x]) => x))) - 2;
        const top = Math.floor(Math.min(...outline.map(([, y]) => y))) - 2;
        const w = Math.ceil(Math.max(...outline.map(([x]) => x))) + 3 - left;
        const h = Math.ceil(Math.max(...outline.map(([, y]) => y))) + 3 - top;
        const patch = drawing.getImageData(left, top, w, h);
        const path = new Path2D();
        outline.forEach(([x, y], k) => (k ? path.lineTo(x - left, y - top) : path.moveTo(x - left, y - top)));
        path.closePath();
        const inside = new Uint8Array(w * h);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            inside[y * w + x] = drawing.isPointInPath(path, x + 0.5, y + 0.5) ? 1 : 0;
          }
        }
        // The grain: how much the pixels just outside differ from each other.
        const ring = new Array<number>();
        for (let i = 0; i < w * h; i++) {
          if (!inside[i]) {
            ring.push(patch.data[i * 4] + patch.data[i * 4 + 1] + patch.data[i * 4 + 2]);
          }
        }
        const mean = ring.reduce((sum, v) => sum + v, 0) / ring.length;
        const grain = Math.min(6, Math.sqrt(ring.reduce((sum, v) => sum + (v - mean) ** 2, 0) / ring.length) / 3);
        // A start: each pixel from the nearest ones outside the outline to its left, right, top and bottom, the
        // nearer weighing more; then smoothed.
        const values = Float32Array.from(patch.data);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = y * w + x;
            if (!inside[i]) {
              continue;
            }
            const sum = [0, 0, 0];
            let weights = 0;
            for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
              let nx = x;
              let ny = y;
              let steps = 0;
              while (nx >= 0 && nx < w && ny >= 0 && ny < h && inside[ny * w + nx]) {
                nx += dx;
                ny += dy;
                steps++;
              }
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                const j = ny * w + nx;
                for (let c = 0; c < 3; c++) {
                  sum[c] += patch.data[j * 4 + c] / steps;
                }
                weights += 1 / steps;
              }
            }
            for (let c = 0; c < 3; c++) {
              values[i * 4 + c] = sum[c] / weights;
            }
          }
        }
        for (let round = 0; round < 400; round++) {
          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const i = y * w + x;
              if (inside[i]) {
                for (let c = 0; c < 3; c++) {
                  const around = values[(i - 1) * 4 + c] + values[(i + 1) * 4 + c];
                  values[i * 4 + c] = (around + values[(i - w) * 4 + c] + values[(i + w) * 4 + c]) / 4;
                }
              }
            }
          }
        }
        let seed = 1;
        for (let i = 0; i < w * h; i++) {
          if (inside[i]) {
            seed = (seed * 16807) % 2147483647;
            const noise = ((seed / 2147483647) * 2 - 1) * grain;
            for (let c = 0; c < 3; c++) {
              patch.data[i * 4 + c] = Math.round(values[i * 4 + c] + noise);
            }
          }
        }
        drawing.putImageData(patch, left, top);
      }
      const photoUrl = URL.createObjectURL(await canvas.convertToBlob({ type: 'image/png' }));
      const pixels = drawing.getImageData(0, 0, width, height).data;
      const lightness = (i: number) => 0.299 * pixels[i * 4] + 0.587 * pixels[i * 4 + 1] + 0.114 * pixels[i * 4 + 2];

      // The screen: pixels as light as its middle, connected to it, within the rough corners grown a little.
      const middle = rough.reduce(([x, y], [cx, cy]) => [x + cx / 4, y + cy / 4], [0, 0]);
      const grown = rough.map(([x, y]) => [x + (x - middle[0]) * 0.04, y + (y - middle[1]) * 0.04]);
      const within = (x: number, y: number) =>
        grown.every(([px, py], k) => {
          const [qx, qy] = grown[(k + 1) % 4];
          return (qx - px) * (y - py) - (qy - py) * (x - px) >= 0;
        });
      const seed = Math.round(middle[1]) * width + Math.round(middle[0]);
      const reference = lightness(seed);
      const screen = new Uint8Array(width * height);
      const stack = [seed];
      while (stack.length) {
        const i = stack.pop() ?? 0;
        const x = i % width;
        const y = (i - x) / width;
        if (screen[i] || Math.abs(lightness(i) - reference) > 40 || !within(x, y)) {
          continue;
        }
        screen[i] = 1;
        const neighbours = [
          x > 0 ? i - 1 : -1,
          x < width - 1 ? i + 1 : -1,
          y > 0 ? i - width : -1,
          y < height - 1 ? i + width : -1,
        ];
        stack.push(...neighbours.filter((j) => j >= 0));
      }

      // Each side: a line through the region's edge near it, away from the rounded corners; the corners where they meet.
      const edge: [number, number][] = [];
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const i = y * width + x;
          if (screen[i] && (!screen[i - 1] || !screen[i + 1] || !screen[i - width] || !screen[i + width])) {
            edge.push([x, y]);
          }
        }
      }
      const sides = rough.map(([px, py], k) => {
        const [qx, qy] = rough[(k + 1) % 4];
        const length = Math.hypot(qx - px, qy - py);
        const nx = -(qy - py) / length;
        const ny = (qx - px) / length;
        // The region's edge near the side, nearly all along it.
        const outside = nx * (px - middle[0]) + ny * (py - middle[1]) > 0 ? 1 : -1;
        const near = edge
          .map(([x, y]) => ({
            point: [x, y] as [number, number],
            along: ((x - px) * (qx - px) + (y - py) * (qy - py)) / (length * length),
            out: outside * ((x - px) * nx + (y - py) * ny),
          }))
          .filter(({ along, out }) => along > 0.05 && along < 0.95 && Math.abs(out) < Math.max(12, length * 0.04));
        // In each of a few dozen stretches of it, the outermost point: where the edge is, or where a notch, a thumb or
        // a rounded corner hides it, further in.
        const STRETCHES = 24;
        const outermost = new Array<{ point: [number, number]; out: number } | undefined>(STRETCHES);
        for (const item of near) {
          const stretch = Math.min(STRETCHES - 1, Math.floor(((item.along - 0.05) / 0.9) * STRETCHES));
          if (!outermost[stretch] || item.out > (outermost[stretch]?.out ?? 0)) {
            outermost[stretch] = item;
          }
        }
        let points = outermost.flatMap((item) => (item ? [item.point] : []));
        if (points.length < 6) {
          throw new Error('A side of the screen has no edge near it');
        }
        const fit = (fitted: [number, number][]) => {
          const mx = fitted.reduce((sum, [x]) => sum + x, 0) / fitted.length;
          const my = fitted.reduce((sum, [, y]) => sum + y, 0) / fitted.length;
          let sxx = 0;
          let sxy = 0;
          let syy = 0;
          for (const [x, y] of fitted) {
            sxx += (x - mx) ** 2;
            sxy += (x - mx) * (y - my);
            syy += (y - my) ** 2;
          }
          const angle = 0.5 * Math.atan2(2 * sxy, sxx - syy);
          return { x: mx, y: my, dx: Math.cos(angle), dy: Math.sin(angle) };
        };
        // A line through them, then again without the stretches well inside it, until none are.
        let line = fit(points);
        for (let round = 0; round < 6; round++) {
          const { x: lx, y: ly, dx, dy } = line;
          const turned = outside * Math.sign(-dy * nx + dx * ny);
          const kept = points.filter(([x, y]) => turned * ((x - lx) * -dy + (y - ly) * dx) > -2);
          if (kept.length === points.length || kept.length < 4) {
            break;
          }
          points = kept;
          line = fit(points);
        }
        return line;
      });
      // Each side moved in by the bezel, where there is one, outside which the photo's glass shows; elsewhere out by a few
      // pixels, which the mask then hides, so the app reaches every edge of the screen, which in a photo isn't quite
      // straight.
      const bezels = typeof bezel === 'number' ? [bezel, bezel, bezel, bezel] : bezel;
      sides.forEach((side, k) => {
        const inward = (-side.dy * (middle[0] - side.x) + side.dx * (middle[1] - side.y) > 0 ? 1 : -1);
        const by = bezels[k] > 0 ? bezels[k] : -4;
        side.x += inward * -side.dy * by;
        side.y += inward * side.dx * by;
      });
      const corners = sides.map((side, k) => {
        const previous = sides[(k + 3) % 4];
        const det = previous.dx * side.dy - previous.dy * side.dx;
        const t = ((side.x - previous.x) * side.dy - (side.y - previous.y) * side.dx) / det;
        return [previous.x + t * previous.dx, previous.y + t * previous.dy];
      });

      // The mask: the screen's region, holes and all, a pixel or two under the bezel.
      const mask = new OffscreenCanvas(width, height);
      const masking = mask.getContext('2d');
      if (!masking) {
        throw new Error('No canvas');
      }
      const maskData = masking.createImageData(width, height);
      let sum = 0;
      let count = 0;
      for (let i = 0; i < width * height; i++) {
        if (screen[i]) {
          maskData.data[i * 4 + 3] = 255;
          sum += lightness(i);
          count++;
        }
      }
      masking.putImageData(maskData, 0, 0);
      // A pixel wider, so its soft edge falls on the bezel or a notch rather than letting the photo's screen through.
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        masking.drawImage(mask, dx, dy);
      }
      masking.filter = 'blur(1px)';
      masking.drawImage(mask, 0, 0);
      masking.drawImage(mask, 0, 0);
      // A lit screen's shade is multiplied over the app, as bright as a white screen so it doesn't dim the app; a dark
      // screen's reflections are added to it instead, like glass.
      const average = sum / count;
      const shade =
        average < 100
          ? 'mix-blend-mode:screen;opacity:0.85'
          : `mix-blend-mode:multiply;filter:brightness(${Math.min(1.35, 250 / average)}) saturate(0)`;

      // The warp: the homography from the screenshot's rectangle to the corners, as a CSS matrix.
      const from = [[0, 0], [device.width, 0], [device.width, device.height], [0, device.height]];
      const a: number[][] = [];
      const b: number[] = [];
      from.forEach(([x, y], k) => {
        const [u, v] = corners[k];
        a.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
        b.push(u);
        a.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
        b.push(v);
      });
      for (let i = 0; i < 8; i++) {
        let pivot = i;
        for (let r = i + 1; r < 8; r++) {
          if (Math.abs(a[r][i]) > Math.abs(a[pivot][i])) {
            pivot = r;
          }
        }
        [a[i], a[pivot]] = [a[pivot], a[i]];
        [b[i], b[pivot]] = [b[pivot], b[i]];
        for (let r = 0; r < 8; r++) {
          if (r !== i) {
            const factor = a[r][i] / a[i][i];
            for (let c = i; c < 8; c++) {
              a[r][c] -= factor * a[i][c];
            }
            b[r] -= factor * b[i];
          }
        }
      }
      const h = b.map((value, i) => value / a[i][i]);
      const matrix = [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1];

      const maskUrl = URL.createObjectURL(await mask.convertToBlob({ type: 'image/png' }));
      document.body.innerHTML = `<div id="picture" style="position:relative;width:${width}px;height:${height}px;overflow:hidden">
        <img src="${photoUrl}" style="position:absolute;inset:0;display:block">
        <div style="position:absolute;inset:0;isolation:isolate;mask-image:url(${maskUrl});mask-size:100% 100%">
          <img src="data:image/png;base64,${screenshotData}" style="position:absolute;left:0;top:0;width:${device.width}px;
            height:${device.height}px;border-radius:${radius}px;transform-origin:0 0;transform:matrix3d(${matrix.join(',')})">
          <img src="${photoUrl}" style="position:absolute;inset:0;${shade}">
        </div>
      </div>`;
      await Promise.all([...document.images].map((item) => item.decode()));
      return { width, height };
    },
    {
      photoData: photo.toString('base64'),
      screenshotData: screenshot.toString('base64'),
      corners: shot.corners,
      device: shot.device,
      bezel: shot.bezel ?? 0,
      retouch: shot.retouch ?? [],
      radius: shot.radius ?? 0,
    },
  );
  await page.setViewportSize(size);
  await page.waitForTimeout(300);
  const [cropX, cropY, cropWidth, cropHeight] = shot.crop;
  const png = await page.screenshot({ clip: { x: cropX, y: cropY, width: cropWidth, height: cropHeight } });
  // Smaller, in halves while it's more than twice the size, so the detail is averaged rather than skipped; as WebP,
  // which Chromium's canvas encodes.
  const webp = await page.evaluate(
    async ({ pngData, width }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${pngData}`;
      await image.decode();
      const scaled = (source: CanvasImageSource, from: number, to: number, height: number) => {
        const canvas = document.createElement('canvas');
        canvas.width = to;
        canvas.height = Math.round((to / from) * height);
        const drawing = canvas.getContext('2d');
        if (!drawing) {
          throw new Error('No canvas');
        }
        drawing.imageSmoothingQuality = 'high';
        drawing.drawImage(source, 0, 0, canvas.width, canvas.height);
        return canvas;
      };
      let current: HTMLCanvasElement | HTMLImageElement = image;
      let currentWidth = image.naturalWidth;
      let currentHeight = image.naturalHeight;
      while (currentWidth > width * 2) {
        const half: HTMLCanvasElement = scaled(current, currentWidth, Math.round(currentWidth / 2), currentHeight);
        current = half;
        currentWidth = half.width;
        currentHeight = half.height;
      }
      return scaled(current, currentWidth, width, currentHeight).toDataURL('image/webp', 0.9).split(',')[1];
    },
    { pngData: png.toString('base64'), width: Math.min(WIDTH, cropWidth) },
  );
  return Buffer.from(webp, 'base64');
}
