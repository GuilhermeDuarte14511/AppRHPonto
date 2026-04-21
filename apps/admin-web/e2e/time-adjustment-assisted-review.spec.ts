import { expect, test } from '@playwright/test';

import { signInAsAdmin } from './utils/admin-auth';

test('assisted time adjustment review flow is visible in operations inbox', async ({ page }) => {
  await signInAsAdmin(page, '/dashboard');

  await page.getByRole('link', { name: 'Inbox RH' }).click();

  await expect(page.getByRole('heading', { name: 'Inbox operacional do RH' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ajustes de ponto assistidos' })).toBeVisible();
  await expect(page.getByText('Buscar caso')).toBeVisible();

  const selectableCase = page.getByLabel(/Selecionar .* para lote/i).first();

  if (await selectableCase.isVisible()) {
    await selectableCase.check();
    await expect(page.getByText(/caso\(s\) elegivel\(is\) selecionado\(s\)/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Aprovar lote' })).toBeVisible();
  }

  await page.getByRole('button', { name: 'Abrir contexto' }).first().click();

  await expect(page.getByText('Decisao administrativa', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Aprovar sugestao' })).toBeVisible();
});
