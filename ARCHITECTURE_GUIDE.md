# Visual Guide: Understanding the Todo App Architecture

## App Component Hierarchy

```
App (Root Container)
│
├── NameEntry (Initial Screen)
│   └── Shows when userName is null
│       ├── Name input field
│       ├── Welcome message
│       └── Start button
│
└── Main App UI (When userName is set)
    ├── HeroHeader (Top Banner)
    │   ├── App Title
    │   ├── User Greeting
    │   └── Change User Button
    │
    ├── TabNavigation (Filter Tabs)
    │   ├── Today Button
    │   ├── Pending Button
    │   └── Overdue Button
    │
    ├── Tasks Section
    │   ├── Add Task Button
    │   ├── AddTaskForm (When isAddingTask = true)
    │   │   ├── Title Input
    │   │   ├── Date Input
    │   │   ├── Time Input
    │   │   ├── Priority Select
    │   │   ├── Add Button
    │   │   └── Cancel Button
    │   │
    │   └── TaskListView
    │       ├── Active Tasks Section
    │       │   └── TaskCard[] (Filtered by tab)
    │       │       ├── Checkbox
    │       │       ├── Title (editable)
    │       │       ├── Due Date Display
    │       │       ├── Edit Button
    │       │       └── Priority Indicator
    │       │
    │       └── Completed Tasks Section (Collapsible)
    │           └── TaskCard[] (Completed only)
    │               ├── Checkbox
    │               ├── Title (strikethrough)
    │               ├── Edit Button
    │               └── Delete Button
    │
    └── Chakra UI Theme (Green color scheme)
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Browser                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   React App (App.tsx)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ State Management                                      │  │
│  ├─ userName: string | null                             │  │
│  ├─ todos: Todo[]                                       │  │
│  ├─ activeTab: 'today' | 'pending' | 'overdue'         │  │
│  ├─ showCompleted: boolean                              │  │
│  ├─ isAddingTask: boolean                               │  │
│  └─ editingId: number | null                            │  │
│  └─ editTitle: string                                   │  │
│  └───────────────────────────────────────────────────────┘  │
│              ↓                         ↓                     │
└─────────────────────────────────────────────────────────────┘
         ↓                                    ↓
    ┌─────────────┐                  ┌──────────────────┐
    │ localStorage│                  │  Event Handlers  │
    ├─ todoUserName                  ├─ handleSaveName │
    └─────────────┘                  ├─ handleAddTask  │
         ↓                           ├─ handleToggle   │
    ┌─────────────┐                  ├─ handleDelete   │
    │   Render    │                  ├─ handleEdit     │
    │Components   │                  └─ handleSaveEdit │
    └─────────────┘                         ↓
         ↓                           ┌──────────────────┐
    ┌─────────────┐                  │   todoApi       │
    │   Display   │                  │ (axios client)  │
    │     UI      │                  └──────────────────┘
    └─────────────┘                         ↓
                                   ┌──────────────────┐
                                   │  Backend API     │
                                   │ :8080/api        │
                                   │                  │
                                   │ /users           │
                                   │ /todos           │
                                   │ /todos/:id       │
                                   │ /todos/:id/toggle│
                                   └──────────────────┘
```

## Task Filtering Logic

```
All Tasks in State
      ↓
   Is Completed? → Yes → Completed Section
      ↓ No
   Is Due Date Set? 
      ↓ Yes
   Compare with Today
      ├─ DueDate = Today → Today Tab
      ├─ DueDate > Today → Pending Tab
      └─ DueDate < Today → Overdue Tab
      ↓ No DueDate
   → Pending Tab
```

## User Journey Flow

```
START
  ↓
[No User Name?]
  ↓ Yes
Show NameEntry Screen
  ↓
User Enters Name
  ↓
API Call: POST /users
  ↓
Save to localStorage
  ↓
Fetch Tasks: GET /todos
  ↓
Show Main App
  ↓
[User Actions Loop]
├─ Add Task → POST /todos
├─ Toggle Task → PUT /todos/:id/toggle
├─ Edit Task → PUT /todos/:id
├─ Delete Task → DELETE /todos/:id
├─ Switch Tab → Filter local todos
└─ Change User → Clear localStorage, restart
```

## Component Responsibilities

```
┌──────────────────────────────────────────────────────────┐
│ App.tsx (Main Controller)                                │
├──────────────────────────────────────────────────────────┤
│ ✓ State management (todos, userName, activeTab)          │
│ ✓ API communication                                       │
│ ✓ Event handlers                                         │
│ ✓ Routing (show NameEntry or main UI)                    │
└──────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────┐
│ HeroHeader.tsx                                           │
├──────────────────────────────────────────────────────────┤
│ ✓ Display app title                                      │
│ ✓ Show user greeting                                     │
│ ✓ Change user button                                     │
└──────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────┐
│ TabNavigation.tsx                                        │
├──────────────────────────────────────────────────────────┤
│ ✓ Display filter tabs                                    │
│ ✓ Handle tab selection                                   │
│ ✓ Highlight active tab                                  │
└──────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────┐
│ AddTaskForm.tsx                                          │
├──────────────────────────────────────────────────────────┤
│ ✓ Form inputs (title, date, time, priority)              │
│ ✓ Form validation                                        │
│ ✓ Submit handler                                         │
└──────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────┐
│ TaskListView.tsx                                         │
├──────────────────────────────────────────────────────────┤
│ ✓ Active tasks section                                   │
│ ✓ Completed section (collapsible)                        │
│ ✓ Render TaskCard for each task                          │
└──────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────┐
│ TaskCard.tsx                                             │
├──────────────────────────────────────────────────────────┤
│ ✓ Checkbox for completion toggle                         │
│ ✓ Title display (inline editable)                        │
│ ✓ Due date display                                       │
│ ✓ Edit/Delete buttons                                    │
│ ✓ Priority indicator                                     │
└──────────────────────────────────────────────────────────┘
```

## API Communication Flow

```
Frontend State Change
         ↓
Handler Function Called
         ↓
Try: API Request → Backend
         ↓
Success: Update state from response
         ↓
Toast Success
         ↓
┌─────────────────┐
│ Catch Error     │
└─────────────────┘
         ↓
Fallback: Update state locally
         ↓
Toast Warning (Offline Mode)
```

## Test Architecture

```
e2e/ (E2E Tests)
├── fixtures.ts (Helpers)
│   ├─ enterUserName()
│   ├─ addTask()
│   ├─ toggleTask()
│   ├─ deleteTask()
│   ├─ editTask()
│   ├─ switchTab()
│   └─ ... more helpers
│
├── todo.spec.ts (Core Tests)
│   ├─ Name Entry Tests (5)
│   ├─ Task Management Tests (5)
│   ├─ Task Actions Tests (6)
│   ├─ Tab Navigation Tests (4)
│   ├─ Responsive Tests (2)
│   └─ Full Workflow Test (1)
│
├── advanced.spec.ts (Advanced)
│   ├─ Network Error Tests
│   ├─ Performance Tests
│   ├─ Data Integrity Tests
│   ├─ Accessibility Tests
│   └─ Edge Case Tests
│
└── playwright.config.ts (Configuration)
    ├─ Browsers: Chromium, Firefox, WebKit
    ├─ Devices: Desktop, Mobile
    ├─ Reporter: HTML
    └─ Base URL: http://localhost:5173
```

## Responsive Layout Breakpoints

```
Desktop (1024px+)
├─ Full width tasks
├─ Horizontal tabs
├─ Side-by-side content
└─ All buttons visible

Tablet (768px - 1023px)
├─ Medium width tasks
├─ Stacked navigation
├─ Touch-friendly buttons
└─ Responsive spacing

Mobile (375px - 767px)
├─ Full width tasks
├─ Stacked form inputs
├─ Responsive typography
├─ Touch targets (44px+)
└─ Minimal padding
```

## Priority Color Scheme

```
High Priority    → Red (red.500)     🔴
Medium Priority  → Yellow (yellow.400) 🟡
Low Priority     → Light Yellow (yellow.300) 🟠
No Priority      → Gray (gray.300)   ⚪
```

## State Update Example (Add Task)

```
User clicks "Add Task"
         ↓
isAddingTask = true (show form)
         ↓
User fills form + clicks "Add"
         ↓
handleAddTask() called
         ↓
API: POST /api/todos {title, dueDate, priority}
         ↓
Success:
    newTodo = response
    todos = [...todos, newTodo]
    isAddingTask = false
    Toast: "Task added successfully"
         ↓
Catch Error:
    local fallback: todos = [...todos, {localId, ...}]
    isAddingTask = false
    Toast: "Task added locally (offline)"
         ↓
UI Re-renders with new task visible
```

## Key Design Patterns

```
1. Lifting State Up
   └─ All state in App.tsx
      └─ Passed down to children as props

2. Event Handler Delegation
   └─ All handlers in App.tsx
      └─ Passed to components as callbacks

3. Conditional Rendering
   ├─ Show NameEntry if !userName
   └─ Show main app if userName

4. Array Filtering
   └─ Filter todos based on:
      ├─ Completion status
      ├─ Active tab
      └─ Due date

5. Error Handling Pattern
   ├─ Try API call
   ├─ Fallback to local state
   └─ Inform user via toast

6. Offline Support
   ├─ Attempt API first
   ├─ Use local state if fails
   └─ Persist to localStorage
```

## Performance Considerations

```
Optimizations Used:
✓ localStorage caching (user name)
✓ Mounted flag in useEffect (cleanup)
✓ Conditional rendering
✓ Responsive image loading (if any)
✓ CSS-in-JS (Emotion/Chakra)

Potential Improvements:
⚠ Memoization for TaskCard
⚠ useMemo for filtered todos
⚠ useCallback for event handlers
⚠ Code splitting for routes
⚠ Lazy loading for components
```

---

This visual guide helps understand the interconnected parts of the Todo app!
