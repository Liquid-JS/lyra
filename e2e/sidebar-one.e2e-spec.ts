import { expect, test } from '@playwright/test'
import { boxOf, openExample } from './e2e-helper'

test.describe('nb-sidebar-one', () => {
    test.beforeEach(({ page }) => openExample(page, '/sidebar/sidebar-one-test.component'))
    test('should render sidebar full pages', async ({ page }) => {
        const layout = await boxOf(page.locator('nb-layout'))
        const sidebar = await boxOf(page.locator('nb-sidebar').first())
        expect(Math.round(sidebar.height)).toBe(Math.round(layout.height))
        expect(Math.round(sidebar.width)).toBe(256)
    })
})
