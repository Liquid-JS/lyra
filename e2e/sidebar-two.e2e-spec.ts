import { expect, test } from '@playwright/test'
import { boxOf, openExample } from './e2e-helper'

test.describe('nb-sidebar-two', () => {
    test.beforeEach(({ page }) => openExample(page, '/sidebar/sidebar-two-test.component'))
    test('should render left non-fixed sidebar height minus header', async ({ page }) => {
        const [layout, header, sidebar] = await Promise.all([
            boxOf(page.locator('nb-layout')),
            boxOf(page.locator('nb-layout-header')),
            boxOf(page.locator('nb-sidebar').first())
        ])
        expect(Math.round(sidebar.height)).toBe(Math.round(layout.height - header.height))
    })
})
