// e2e/login.spec.ts
import { test, expect, enterUserName } from './fixtures';

test.describe('Todo App - Name Entry', () => {
  test('should display name entry on initial load', async ({ page, mockApiServer }) => {
    await page.goto('/login');
    await expect(page.locator('text=Welcome to Todo App')).toBeVisible();
    await expect(page.locator('input[placeholder="Your name..."]')).toBeVisible();
    await expect(page.locator('button:has-text("Start")')).toBeVisible();
  });

  test('should show warning when submitting empty name', async ({ page, mockApiServer }) => {
    await page.goto('/login');
    await page.click('button:has-text("Start")');
    // Check for toast message (Chakra toast)
    await expect(page.locator('text=Please enter your name')).toBeVisible();
  });

  test('should accept name and navigate to main app', async ({ page, mockApiServer }) => {
    await page.goto('/login');
    await enterUserName(page, 'John Doe');

    await expect(page.locator('text=Tasks')).toBeVisible();
  });

  test('should persist username in localStorage', async ({ page, context, mockApiServer }) => {
    await page.goto('/login');
    await enterUserName(page, 'Alice Smith');

    // Create a new page to verify localStorage persists
    const newPage = await context.newPage();
    await newPage.goto('/');

    await expect(newPage.getByText('Hello, Alice Smith', { exact: false })).toBeVisible();

    await newPage.close();
  });

  test('should allow changing user', async ({ page, mockApiServer }) => {
    await page.goto('/login');
    await enterUserName(page, 'Bob Johnson');

    await expect(page.getByText('Hello, Bob Johnson', { exact: false })).toBeVisible();

    // Click change user (either link or button)
    await page.click('a:has-text("Change user"), button:has-text("Change user")');

    // Should return to name entry
    await expect(page.locator('text=Welcome to Todo App')).toBeVisible();
    await expect(page.locator('input[placeholder="Your name..."]')).toBeVisible();
  });
});
