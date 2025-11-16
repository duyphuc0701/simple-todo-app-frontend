// e2e/fixtures.ts
import { test as base, expect, Page } from '@playwright/test';

type TodoFixtures = {
  mockApiServer: void;
};

/**
 * Custom fixture that provides utilities for testing the Todo app
 */
export const test = base.extend<TodoFixtures>({
  mockApiServer: async ({ page }, use) => {
    await page.route('**/api/users', async route => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON() as { name: string };

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1, name: body.name }), // <- echo input
        });
      } else {
        await route.continue();
      }
    });

    await page.route('**/api/todos', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await use();
  },
});

export { expect };

/**
 * Helper to enter a user name and proceed to the main app
 */
export async function enterUserName(page: Page, name: string) {
  await page.fill('input[placeholder="Your name..."]', name);
  await page.click('button:has-text("Start")');

  // Wait for the main header/greeting instead of any text with the name
  await expect(page.getByText(`Hello, ${name}!`)).toBeVisible();
}
