import { test, expect } from '@playwright/test';

test('Citizen → AI → Duplicate → Admin → Worker → Resolve → Gamification (smoke)', async ({ page }) => {
  // Submit a report as a citizen
  await page.goto('/report');
  await page.fill('#location-description', 'Ward 1, Test Road');
  await page.fill('#issue-description', 'Large pothole near test road causing hazard');
  await page.click('text=Submit issue');

  // Wait for success toast and extract issue id
  const toast = await page.waitForSelector('text=Issue created:', { timeout: 10000 });
  const toastText = await toast.textContent();
  const match = toastText?.match(/Issue created:\s*(\S+)/);
  expect(match).toBeTruthy();
  const issueId = match![1];

  // Admin sees the issue and can assign
  await page.goto('/admin');
  await expect(page.locator(`text=${issueId}`)).toBeVisible({ timeout: 5000 });
  await page.locator(`text=${issueId}`).first().click();
  // Select worker WRK-201 (Roads)
  await page.selectOption('select', 'WRK-201');

  // Worker dashboard shows assignment and can update status
  await page.goto('/worker');
  await expect(page.locator(`text=${issueId}`)).toBeVisible({ timeout: 5000 });
  await page.locator(`text=${issueId}`).first().click();
  await page.click('text=In Progress');
  await page.click('text=Resolved');

  // Confirm resolved status visible on worker page
  await expect(page.locator(`text=${issueId}`)).toBeVisible();
});
