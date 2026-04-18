import { expect, type Page } from '@playwright/test';

const adminEmail = process.env.PLAYWRIGHT_ADMIN_EMAIL ?? 'admin@empresa.com';
const adminPassword = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? 'admin123';

export const signInAsAdmin = async (page: Page, nextPath = '/dashboard') => {
  await page.goto(`/login?next=${encodeURIComponent(nextPath)}`);

  await expect(page.getByRole('heading', { name: /pontoprecise/i })).toBeVisible();

  await page.getByLabel(/email/i).fill(adminEmail);
  await page.getByLabel(/senha/i).fill(adminPassword);
  await page.getByRole('button', { name: /^entrar$/i }).click();

  await page.waitForURL((url) => url.pathname === nextPath || url.pathname.startsWith(nextPath), {
    timeout: 45_000,
  });
};
