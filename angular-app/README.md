# Work Order Timeline Application

**Author:** Ameen Rasheed

A modern Angular-based work order scheduling application with an interactive timeline interface. This standalone Angular application provides complete work order management with CRUD operations, validation, and a responsive timeline visualization.

## 🎯 Core Features

- **Interactive Timeline**: View work orders across Hour, Day, Week, and Month zoom levels
- **CRUD Operations**: Create, read, update, and delete work orders
- **Work Center Management**: Organize work orders by work center
- **Advanced Scheduling**: Drag-and-drop style date selection with visual previews
- **Real-time Validation**: Form validation with overlap detection and error messaging
- **Status Tracking**: Track work orders through Open, In Progress, Complete, and Blocked states
- **Responsive Design**: Works seamlessly on desktop and tablet views

## ✨ Bonus Features Implemented

- **localStorage Persistence**: Automatically saves work orders and zoom level preference
- **29 Unit Tests**: Comprehensive test coverage for core functionality
- **18 E2E Tests**: End-to-end testing for user workflows
- **Keyboard Navigation**: Support for Escape key to close panels
- **Smooth Animations**: SVG and CSS animations for visual feedback
- **Today Button**: Quick navigation to current date
- **Hover Tooltips**: Contextual information on work order hover
- **ARIA Accessibility**: Full accessibility labels for screen readers
- **OnPush Change Detection**: Optimized performance strategy
- **TrackBy Functions**: Efficient list rendering
- **Custom SVG Icons**: Dropdown chevron and status indicators
- **Styled Dropdown Arrows**: Custom-styled dropdown arrows with proper colors
- **Grid Dimming**: Semi-transparent overlay when work order panel opens
- **Font Refinements**: Optimized typography with proper font weights and colors

## 🛠️ Tech Stack

- **Angular**: 21.1.0 (Standalone Components)
- **TypeScript**: 5.9 (Strict Mode)
- **Styling**: SCSS with CSS Grid & Flexbox
- **Forms**: Reactive Forms with custom validators
- **UI Libraries**: 
  - ng-select (21.4.0) - Dropdown component
  - ng-bootstrap (20.0.0) - Bootstrap components
- **Testing**: Jasmine & Vitest
- **State Management**: Angular Signals

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── timeline/
│   │   │   ├── timeline.component.ts
│   │   │   ├── timeline.component.html
│   │   │   └── timeline.component.scss
│   │   └── work-order-panel/
│   │       ├── work-order-panel.component.ts
│   │       ├── work-order-panel.component.html
│   │       └── work-order-panel.component.scss
│   ├── services/
│   │   └── timeline.service.ts
│   ├── models/
│   │   └── index.ts
│   ├── data/
│   │   └── sample-data.ts
│   ├── app.ts
│   └── app.html
├── styles.scss
├── main.ts
└── index.html
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd angular-app
npm install
```

### Development Server

```bash
npm run start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

### Building for Production

```bash
npm run build
# or
ng build
```

Build artifacts are stored in the `dist/` directory.

## 🧪 Testing

### Run Unit Tests

```bash
npm run test
# or
ng test
```

Runs 29 unit tests covering:
- Timeline calculations
- Date formatting
- Work order CRUD operations
- Form validation
- Overlap detection
- State management

### Run End-to-End Tests

```bash
npm run e2e
# or
ng e2e
```

18 E2E tests covering user workflows and interactions.

## 🎨 Key Components

### TimelineComponent
- Main timeline view with multiple zoom levels
- Grid-based layout with sticky headers
- Real-time work order visualization
- Ghost box hover preview for new orders
- Context menu for quick actions

### WorkOrderPanelComponent
- Side panel for create/edit operations
- Form validation with overlap detection
- Status selection with color-coded pills
- Date picker integration
- Animated in/out transitions

### TimelineService
- Column generation for different zoom levels
- Pixel-to-date conversions
- Work order positioning calculations
- localStorage integration
- Sample data management

## 📊 Data Models

### WorkOrderDocument
```typescript
{
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string;
    startDate: string;
    endDate: string;
    status: 'open' | 'in-progress' | 'complete' | 'blocked';
  };
}
```

### WorkCenterDocument
```typescript
{
  docId: string;
  docType: 'workCenter';
  data: {
    name: string;
  };
}
```

## 🎯 Zoom Levels

- **Hour**: 80px per column, 24-hour buffer
- **Day**: 120px per column, 20-day buffer
- **Week**: 160px per column, 8-week buffer
- **Month**: 150px per column, 4-month buffer

## 🔍 Timeline Features

- **Current Period Indicator**: Highlights current hour/day/week/month with blue line and badge
- **Work Order Bars**: Color-coded by status with hover tooltips
- **Status Pills**: Quick status identification on work orders
- **Overlap Detection**: Prevents scheduling conflicts with real-time validation
- **Ghost Box**: Visual preview when hovering over empty time slots

## 💾 Persistence

The application uses localStorage to persist:
- Work orders (key: `workOrders`)
- Work centers (key: `workCenters`)
- Current zoom level (key: `zoomLevel`)

All data is automatically saved when modified and restored on page reload.

## ♿ Accessibility

- Full ARIA labels on interactive elements
- Semantic HTML structure
- Keyboard navigation (Escape to close panels)
- Color-independent status indication
- Proper heading hierarchy
- Screen reader support for dynamic content

## 📊 Performance Optimizations

- **OnPush Change Detection**: Minimal CD cycles
- **TrackBy Functions**: Efficient list rendering
- **Lazy Rendering**: Components only re-render when necessary
- **Optimized Selectors**: Minimal DOM queries
- **CSS Grid**: Native layout performance

## 🎬 Demo

For a demonstration of all features and functionality, refer to the submitted video walkthrough which covers:
- Timeline zoom functionality
- Creating and editing work orders
- Form validation and error handling
- Status management
- Overlap detection
- Navigation and UI interactions

## 📝 Notes

- The application uses standalone components for modern Angular architecture
- All components use OnPush change detection strategy
- Reactive Forms are used for form management and validation
- Sample data is pre-populated on first load
- The design follows a clean, minimalist aesthetic with proper spacing and typography

## 📄 License

This project is part of a Naologic take-home coding challenge.

