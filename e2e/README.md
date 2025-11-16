# E2E Tests Index

This directory contains comprehensive end-to-end tests for the Todo App using Playwright.

## Test Files

### 1. `fixtures.ts` - Test Utilities & Helpers
Reusable helper functions and fixtures for testing:
- `enterUserName()` - Setup helper to enter name and access main app
- `addTask()` - Create new tasks with optional date and priority
- `toggleTask()` - Mark tasks complete/incomplete  
- `deleteTask()` - Remove tasks
- `editTask()` - Update task titles
- `switchTab()` - Navigate between tabs
- `verifyTaskVisible()` - Assert task visibility
- `changeUser()` - Switch to different user

**Usage**: Import these helpers in test files to reduce code duplication.

### 2. `todo.spec.ts` - Core Test Suite (23 tests)
Main test file covering all critical user workflows:

#### Test Groups:
1. **Name Entry** (5 tests)
   - Initial display
   - Validation
   - Navigation
   - localStorage persistence
   - User switching

2. **Task Management** (5 tests)
   - Add tasks with various options
   - Form validation
   - Cancellation

3. **Task Actions** (6 tests)
   - Toggle completion
   - Completed section behavior
   - Editing tasks
   - Deleting tasks
   - Priority indicators

4. **Tab Navigation** (4 tests)
   - Tab switching
   - Filter logic
   - Empty states

5. **Responsive Design** (2 tests)
   - Mobile viewport (375x667)
   - Tablet viewport (768x1024)

6. **Full Workflow** (1 test)
   - Complete user scenario with multiple operations

### 3. `advanced.spec.ts` - Advanced Scenarios (Under Development)
Advanced test patterns for edge cases and performance:

#### Test Groups:
1. **Network Error Handling**
   - Offline task creation
   - Graceful degradation

2. **Performance Tests**
   - Adding many tasks
   - Quick tab switching

3. **Data Integrity**
   - Task data persistence
   - Rapid operations

4. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Screen reader support

5. **Edge Cases**
   - Long task titles
   - Special characters
   - Unicode and emoji
   - Empty strings
   - Rapid toggles

6. **Cross-browser Rendering**
   - Color rendering
   - Form state preservation

## Running Tests

### Run All Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npx playwright test e2e/todo.spec.ts
npx playwright test e2e/advanced.spec.ts
```

### Run Specific Test
```bash
npx playwright test -g "should add a new task"
```

### Interactive UI Mode (Recommended)
```bash
npm run test:e2e:ui
```

### Debug Mode
```bash
npm run test:e2e:debug
```

### Headed Mode (Visible Browser)
```bash
npm run test:e2e:headed
```

## Test Structure

Each test file follows this pattern:

```typescript
import { test, expect, helperFunction } from './fixtures';

test.describe('Feature Group', () => {
  test.beforeEach(async ({ page }) => {
    // Setup common to all tests in group
  });

  test('specific behavior', async ({ page }) => {
    // Test implementation
    // Use helpers from fixtures.ts
  });
});
```

## Best Practices Implemented

✅ **Organized Structure** - Tests grouped logically with beforeEach hooks  
✅ **DRY Code** - Helper functions reduce duplication  
✅ **Clear Names** - Test names describe expected behavior  
✅ **User Focus** - Testing what users see/do, not implementation  
✅ **Error Cases** - Including validation and error scenarios  
✅ **Full Workflows** - Integration tests covering multiple steps  
✅ **Multiple Browsers** - Configured for Chromium, Firefox, WebKit  
✅ **Responsive** - Testing on mobile, tablet, desktop  

## Adding New Tests

### Quick Example
```typescript
test('should do something new', async ({ page }) => {
  await page.goto('/');
  await enterUserName(page, 'Test User');
  
  // Your test steps here
  
  await expect(page.locator('text=Expected Result')).toBeVisible();
});
```

### With Setup
```typescript
test.describe('New Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await enterUserName(page, 'Test User');
  });

  test('should do something', async ({ page }) => {
    // Test steps
  });

  test('should handle error', async ({ page }) => {
    // Error handling test
  });
});
```

## Test Results & Reports

After running tests:

```bash
npx playwright show-report
```

Reports include:
- Pass/fail status
- Execution time
- Screenshots (on failure)
- Full traces (replay able)
- Error details

## Debugging Failing Tests

### Method 1: UI Mode
```bash
npm run test:e2e:ui
```
- Visual test explorer
- Step-by-step execution
- Live browser interaction

### Method 2: Debug Mode
```bash
npm run test:e2e:debug
```
- Playwright Inspector opens
- Step through code
- Evaluate expressions

### Method 3: Add Debugging
```typescript
test('debug example', async ({ page }) => {
  await page.goto('/');
  // Add breakpoint for interactive debugging
  await page.pause();
});
```

### Method 4: Screenshots
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

## CI/CD Integration

Tests are ready for CI/CD pipelines. Set `CI=true`:

```bash
CI=true npm run test:e2e
```

Automatic CI features:
- 2x test retries on failure
- Single worker (no parallelization)
- `forbidOnly: true` to prevent `.only` in production

## Coverage

Current test coverage:
- **User Entry**: ✅ Complete
- **Task CRUD**: ✅ Complete
- **Filtering**: ✅ Complete  
- **UI Interactions**: ✅ Complete
- **Error Handling**: ✅ Partial (see advanced.spec.ts)
- **Performance**: ⏳ In Development
- **Accessibility**: ⏳ In Development
- **Edge Cases**: ⏳ In Development

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## Troubleshooting

### Tests timeout
Increase timeout in `playwright.config.ts`

### Port 5173 in use
Configure different port or kill process using it

### Backend connection fails
Ensure API server runs on `http://localhost:8080`

### Selector not found
Use debug mode: `npm run test:e2e:debug`

## Next Steps

1. ✅ Run existing tests: `npm run test:e2e:ui`
2. ⏳ Implement advanced scenarios from `advanced.spec.ts`
3. ⏳ Add performance benchmarks
4. ⏳ Implement accessibility audit tests
5. ⏳ Integrate with CI/CD pipeline

---

**Total Tests**: 23 main + advanced scenarios  
**Browsers**: 3 (Chromium, Firefox, WebKit)  
**Devices**: 5+ (Desktop + Mobile viewports)  
**Status**: ✅ Ready for Use
