import { expect, test } from '@playwright/test';

import { signInAsAdmin } from './utils/admin-auth';

test.describe('fluxo de fechamento de folha', () => {
  test('abre a visão geral e o detalhe individual com dados persistidos', async ({ page }) => {
    await signInAsAdmin(page, '/payroll');

    await expect(page.getByRole('heading', { name: /fechamento de folha/i })).toBeVisible();
    await expect(page.getByText(/período:\s*abril de 2026/i)).toBeVisible();
    await expect(page.locator('tbody tr').filter({ hasText: 'João Pereira' })).toBeVisible();
    await expect(page.locator('tbody tr').filter({ hasText: 'Ana Ribeiro' })).toBeVisible();

    await page.goto('/payroll/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1');

    await expect(page).toHaveURL(/\/payroll\/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1$/);
    await expect(page.getByRole('heading', { name: /detalhamento de folha/i })).toBeVisible();
    await expect(page.getByText(/abril de 2026/i).first()).toBeVisible();
    await expect(page.getByText(/joão pereira/i).first()).toBeVisible();
    await expect(page.getByRole('tab', { name: /espelho/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /imprimir pdf/i })).toBeVisible();
  });
});
