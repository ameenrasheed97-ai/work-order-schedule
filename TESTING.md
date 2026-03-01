# Testing Guide

This project includes both unit tests and E2E tests for comprehensive coverage.

## Unit Tests

Unit tests are located throughout the codebase using the `.spec.ts` convention:

- `src/app/services/timeline.service.spec.ts` - Tests for the timeline service (date calculations, work order CRUD, zoom level handling)
- `src/app/components/timeline/timeline.component.spec.ts` - Tests for the main timeline component

### Running Unit Tests

```bash
# Run unit tests in watch mode
npm run test

# Run unit tests once (headless)
npm run test:unit
```

## E2E Tests

E2E tests are located in `cypress/e2e/` and test the entire application flow:

- `timeline.cy.ts` - Tests for basic timeline rendering and visibility
- `zoom.cy.ts` - Tests for zoom level switching and "Today" button functionality
- `crud.cy.ts` - Tests for creating, editing, and deleting work orders

### Running E2E Tests

```bash
# Run E2E tests in headless mode
npm run test:e2e

# Open Cypress interactive test runner
npm run test:e2e:open

# Run both unit and E2E tests
npm run test:all
```

## Test Coverage

### Unit Tests Cover:

- Timeline Service:
  - Work center loading
  - Zoom level management
  - Date-to-pixel conversions
  - Work order filtering
  - Overlap detection
  - CRUD operations (Create, Read, Update, Delete)
  - Column generation for different zoom levels
  - Column label formatting

- Timeline Component:
  - Component creation and initialization
  - Display of work centers and bars
  - Correct column widths for each zoom level
  - Status badge rendering
  - Toolbar functionality

### E2E Tests Cover:

- Basic functionality:
  - Application loads with timeline visible
  - All work centers are displayed
  - Work order bars appear on timeline
  - Hover states show work order details

- Zoom level switching:
  - Day, Week, and Month zoom levels work
  - Different work orders load for different zoom levels
  - "Today" button functionality

- CRUD operations:
  - Creating new work orders
  - Editing existing work orders
  - Deleting work orders
  - Panel open/close behavior
  - Form validation

## Test Results

To see test results in CI/CD pipelines:

```bash
# Generate unit test coverage report
ng test --code-coverage

# View reports
open coverage/index.html
```

## Notes

- Unit tests use Jasmine and Karma (Angular's built-in testing framework)
- E2E tests use Cypress for browser automation testing
- All tests are isolated and can run independently
- Sample data is used for consistent test behavior
