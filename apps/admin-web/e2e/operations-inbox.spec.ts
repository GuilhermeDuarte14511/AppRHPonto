import { expect, test } from '@playwright/test';

import { signInAsAdmin } from './utils/admin-auth';

test('operations inbox is reachable from the sidebar', async ({ page }) => {
  await signInAsAdmin(page, '/dashboard');

  await page.getByRole('link', { name: 'Inbox RH' }).click();

  await expect(page.getByRole('heading', { name: 'Inbox operacional do RH' })).toBeVisible();
});
