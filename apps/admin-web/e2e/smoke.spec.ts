import { expect, test } from '@playwright/test';

import { signInAsAdmin } from './utils/admin-auth';

test.describe('admin-web smoke', () => {
  test('carrega o dashboard após login administrativo', async ({ page }) => {
    await signInAsAdmin(page, '/dashboard');

    await expect(page.getByRole('heading', { name: /dashboard operacional/i })).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
