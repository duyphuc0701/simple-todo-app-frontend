# Playwright E2E Testing Setup Guide

## Overview

This project now includes comprehensive end-to-end (E2E) testing using **Playwright**. Playwright is a powerful testing framework that allows you to test your React application across multiple browsers (Chromium, Firefox, WebKit) and device types (Desktop, Mobile).

## What's Included

### 1. **Playwright Configuration** (`playwright.config.ts`)
- Multi-browser testing (Chrome, Firefox, Safari)
- Mobile viewport testing (iOS, Android)
- Screenshot and trace collection on failures
- HTML reporter for detailed test results
- Automatic dev server startup before tests

### 2. **Test Fixtures** (`e2e/fixtures.ts`)
Reusable helper functions that simplify test writing:
- `enterUserName()` - Enter a name and proceed to main app
- `addTask()` - Create a new task with optional date and priority
- `toggleTask()` - Mark task as complete/incomplete
- `deleteTask()` - Remove a task
- `editTask()` - Update task title
- `switchTab()` - Navigate between Today/Pending/Overdue tabs
- `verifyTaskVisible()` - Assert task visibility
- `changeUser()` - Switch to a different user

### 3. **Comprehensive Test Suite** (`e2e/todo.spec.ts`)
Tests organized into logical groups:

#### Name Entry Tests
- Display validation
- Empty name handling
- User navigation
- localStorage persistence
- User switching

#### Task Management Tests
- Add tasks (title only, with date, with priority)
- Form validation
- Cancel operations

#### Task Actions Tests
- Toggle completion
- Completed section behavior
- Edit tasks
- Delete tasks
- Priority indicators

#### Tab Navigation Tests
- Default tab selection
- Tab switching
- Filter logic (Today/Pending/Overdue)
- Empty states

#### Responsive Design Tests
- Mobile (375x667)
- Tablet (768x1024)

#### Full User Workflow Test
- Complete end-to-end user scenario with multiple operations

## Installation

### 1. Install Playwright

```bash
npm install
```

This installs `@playwright/test` and all other dependencies.

### 2. Install Playwright Browsers

After the first run, Playwright will automatically install browsers. Alternatively, install them manually:

```bash
npx playwright install
```

## Running Tests

### Run All Tests
```bash
npm run test:e2e
```

### Run Tests with UI (Recommended for Development)
```bash
npm run test:e2e:ui
```
This opens the Playwright UI where you can:
- See all tests and their status
- Filter tests
- Step through tests interactively
- View traces and screenshots

### Run Tests in Headed Mode (Visible Browser)
```bash
npm run test:e2e:headed
```
Tests run with a visible browser window so you can watch the interactions.

### Run Specific Test File
```bash
npx playwright test e2e/todo.spec.ts
```

### Run Specific Test
```bash
npx playwright test -g "should add a new task"
```

### Run Tests in Debug Mode
```bash
npm run test:e2e:debug
```
Opens the Playwright Inspector for step-by-step debugging.

### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests on Specific Device
```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Test Results

After running tests, an HTML report is generated:

```bash
npx playwright show-report
```

The report includes:
- Pass/fail status for each test
- Execution time
- Screenshots (on failure)
- Traces (can be replayed)
- Detailed error messages

## Continuous Integration

Tests are ready for CI/CD pipelines. The config automatically detects CI environment:

```bash
# In CI environment (GitHub Actions, etc.)
CI=true npm run test:e2e
```

CI mode automatically:
- Retries failed tests 2 times
- Uses a single worker (no parallelization)
- Sets `forbidOnly: true` to prevent `.only` in production

## Best Practices

### 1. Wait for Elements Properly
```typescript
// Good - Playwright auto-waits
await page.click('button:has-text("Add Task")');

// Avoid - Manual waits are usually unnecessary
await page.waitForTimeout(1000);
```

### 2. Use Meaningful Selectors
```typescript
// Good - Role-based
await page.click('button:has-text("Start")');

// Good - Test attributes
await page.fill('input[placeholder="Your name..."]');

// Avoid - Fragile index selectors
await page.click('button:nth-of-type(3)');
```

### 3. Group Related Tests
```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });
  
  test('specific behavior', async ({ page }) => {
    // Test
  });
});
```

### 4. Use Fixtures for Common Setup
Tests inherit fixtures for repetitive operations (already done in this project).

### 5. Test User Behavior, Not Implementation Details
```typescript
// Good - User sees text
await expect(page.locator('text=Hello, John Doe!')).toBeVisible();

// Avoid - Implementation details
await expect(page.locator('.user-name')).toHaveText('John Doe');
```

## Project Structure

```
e2e/
├── fixtures.ts          # Reusable helper functions
├── todo.spec.ts         # Main test file with all tests
└── todo.spec.ts.html    # Generated test report

playwright.config.ts     # Playwright configuration
package.json            # Updated with Playwright deps & scripts
```

## Understanding the Todo App

The app is a React-based todo application with these key features:

### Components
- **NameEntry**: Initial user name input
- **HeroHeader**: App header with user greeting
- **TabNavigation**: Today/Pending/Overdue tab switcher
- **AddTaskForm**: Form to create new tasks
- **TaskListView**: Main task list display
- **TaskCard**: Individual task display with actions

### Key Features
- **User Management**: Users have isolated todo lists (via `X-User-Name` header)
- **Task Filtering**: Tasks filtered by due date (Today/Pending/Overdue)
- **Task Priority**: Low/Medium/High priority indicators
- **Task Completion**: Toggle tasks complete/incomplete
- **Task Editing**: Edit task titles inline
- **Task Deletion**: Remove completed tasks
- **localStorage**: Persist user name across sessions

### API Integration
- Communicates with backend via axios
- Base URL: `http://localhost:8080/api`
- Endpoints:
  - `POST /users` - Create user
  - `GET /todos` - Get user's todos
  - `POST /todos` - Create todo
  - `PUT /todos/:id/toggle` - Toggle todo completion
  - `PUT /todos/:id` - Update todo
  - `DELETE /todos/:id` - Delete todo

## Troubleshooting

### Tests Fail Due to Backend Connection
Make sure your backend API server is running on `http://localhost:8080` or configure the URL in tests.

### Selectors Not Finding Elements
Use Playwright Inspector to debug:
```bash
npm run test:e2e:debug
```

### Tests Timeout
Increase timeout in `playwright.config.ts`:
```typescript
use: {
  navigationTimeout: 30000,
  actionTimeout: 10000,
}
```

### Port 5173 Already in Use
Either kill the process using the port or configure a different port in `playwright.config.ts`.

## Adding New Tests

1. Create test cases in `e2e/todo.spec.ts`
2. Use helper functions from `e2e/fixtures.ts`
3. Follow the existing test structure
4. Run and debug with UI mode: `npm run test:e2e:ui`

Example:
```typescript
test('should do something', async ({ page }) => {
  await page.goto('/');
  await enterUserName(page, 'Test User');
  await addTask(page, 'Test task');
  await expect(page.locator('text=Test task')).toBeVisible();
});
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Test Runner](https://playwright.dev/docs/test-intro)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Best Practices](https://playwright.dev/docs/best-practices)

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start your backend API** (if not running)
3. **Run tests**: `npm run test:e2e:ui` for interactive mode
4. **Review results**: Check the HTML report for detailed insights
5. **Add more tests**: Extend the test suite as your app evolves

## Support

For Playwright-specific issues, check the official [Playwright Discord](https://discord.com/invite/playwright) community.
