import { expect, test } from '@playwright/test';

import { signInAsAdmin } from './utils/admin-auth';

test.describe('modal de detalhe das marcações', () => {
  test('abre o detalhe de uma marcação com os blocos principais visíveis', async ({ page }) => {
    await signInAsAdmin(page, '/time-records');

    await expect(page.getByRole('heading', { name: /registro de marcações/i })).toBeVisible();

    const openDetailsButton = page.getByRole('button', { name: /ver detalhes/i }).first();
    await expect(openDetailsButton).toBeVisible({ timeout: 45_000 });
    await openDetailsButton.click();

    const dialog = page.getByRole('dialog');

    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/detalhe da marcação/i)).toBeVisible();
    await expect(dialog.getByText(/evidências visuais/i)).toBeVisible();
    await expect(dialog.getByText(/localização capturada/i)).toBeVisible();
    await expect(dialog.getByText(/observações e rastreabilidade/i)).toBeVisible();
  });

  test('mantém o modal estável visualmente em viewport larga', async ({ page }) => {
    await signInAsAdmin(page, '/time-records');

    const openDetailsButton = page.getByRole('button', { name: /ver detalhes/i }).first();
    await expect(openDetailsButton).toBeVisible({ timeout: 45_000 });
    await openDetailsButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await expect(dialog).toHaveScreenshot('time-record-details-modal.png', {
      animations: 'disabled',
      caret: 'hide',
    });
  });
});
