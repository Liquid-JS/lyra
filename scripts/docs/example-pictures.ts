import { mkdirSync, writeFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { dirname, join } from 'node:path'

import { chromium } from 'playwright'

// The docs import their own files without an extension, as the app's build resolves them; Node needs one, so a
// relative import it can't find is tried again as a TypeScript file.
registerHooks({
    resolve: (specifier, context, nextResolve) => {
        try {
            return nextResolve(specifier, context)
        } catch (error) {
            if (specifier.startsWith('.') && !/\.[cm]?[jt]s$/.test(specifier)) {
                return nextResolve(`${specifier}.ts`, context)
            }
            throw error
        }
    }
})

const { EXAMPLE_APPS, examplePicture, themeId } = await import(
    '../../packages/docs/src/app/blocks/components/example-gallery-block/example-apps.ts'
)

/**
 * Makes the pictures the docs' example gallery shows: each screen of each example app, in the app's theme, on the
 * device the gallery shows it on, as WebP under the docs' public assets; and the home page's of the theme editor. Run it against the docs, e.g. `yarn docs:serve`:
 *
 *   yarn docs:example-pictures [docs URL, by default http://localhost:4100]
 */

const base = process.argv[2] ?? 'http://localhost:4100'
const publicDir = join(import.meta.dirname, '../../packages/docs/public')

// The viewport each device shows a screen at, and the size the picture is saved at.
const DEVICES = {
    laptop: { viewport: { width: 1280, height: 800 }, picture: { width: 960, height: 600 } },
    phone: { viewport: { width: 390, height: 844 }, picture: { width: 390, height: 844 } }
}

const browser = await chromium.launch()
// A page that turns screenshots into WebP, which Chromium's canvas encodes.
const encoder = await browser.newPage()

// A screenshot as WebP of the given size, saved under the docs' public assets.
async function save(screenshot: Buffer, size: { width: number, height: number }, path: string) {
    const webp = await encoder.evaluate(
        async ({ png, width, height }) => {
            const image = new Image()
            image.src = `data:image/png;base64,${png}`
            await image.decode()
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const drawing = canvas.getContext('2d')
            if (!drawing) {
                throw new Error('No canvas')
            }
            drawing.imageSmoothingQuality = 'high'
            drawing.drawImage(image, 0, 0, width, height)
            return canvas.toDataURL('image/webp', 0.85).split(',')[1]
        },
        { png: screenshot.toString('base64'), ...size }
    )
    const file = join(publicDir, path)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, Buffer.from(webp, 'base64'))
    console.log(file)
}

for (const app of EXAMPLE_APPS) {
    const device = DEVICES[app.devices[0]]
    const context = await browser.newContext({ viewport: device.viewport })
    const page = await context.newPage()
    for (const screen of app.screens) {
        await page.goto(`${base}/example/${screen.id}?theme=${themeId(app.theme)}`, { waitUntil: 'networkidle' })
        // Without the button whose menu shows the code and customises the theme.
        await page.addStyleTag({ content: 'ngd-example > .controls { display: none !important; }' })
        await page.evaluate(() => document.fonts.ready)
        // Charts and the like finish moving in.
        await page.waitForTimeout(1500)
        await save(await page.screenshot(), device.picture, examplePicture(app, screen))
    }
    await context.close()
}

// The home page's pictures of the theme editor and its States sheet.
{
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    await page.goto(`${base}/theme/theme-editor`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    // The shop's products on a laptop and a phone, beside the controls.
    await page.locator('ngd-theme-editor-block .preview-bar nb-select').click()
    await page.locator('nb-option', { hasText: /^\s*Products\s*$/ }).click()
    await page.waitForTimeout(3000)
    // Its top, just below the docs' header, as far down as the window shows.
    const editor = page.locator('ngd-theme-editor-block .editor')
    await editor.evaluate((element) => {
        element.scrollIntoView()
        window.scrollBy(0, -88)
    })
    await page.waitForTimeout(500)
    const box = await editor.boundingBox()
    if (!box) {
        throw new Error('No theme editor')
    }
    const clip = { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 900 - box.y - 16) }
    await save(
        await page.screenshot({ clip }),
        { width: 1200, height: Math.round((1200 / clip.width) * clip.height) },
        'assets/home-pictures/theme-editor.webp'
    )

    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(`${base}/example/theme-editor/theme-editor-states.component`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)
    await save(await page.screenshot(), DEVICES.laptop.picture, 'assets/home-pictures/states.webp')
    await context.close()
}

await browser.close()
