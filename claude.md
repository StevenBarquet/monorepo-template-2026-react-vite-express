# Project Rules

## Git Policy

- NEVER commit, push, or interact with git in any way
- The user is solely responsible for all git operations
- Do not run git add, git commit, git push, git stash, or any other git command

## Stack

- Vite + React 19 (full client-side SPA, no SSR)
- Supabase (client-side SDK for database)
- OpenAI SDK (client-side, streaming responses)
- Ant Design 5 (ConfigProvider for dark theming)
- Formik + Yup for forms
- Zustand (with devtools + persist middleware) for client state
- SCSS Modules for styling
- react-router-dom 6 for routing
- react-forge-grid (Frow, Fcol) for form layouts
- framer-motion for animations
- react-markdown + remark-gfm + rehype-katex for rendering AI responses
- Biome for linting/formatting
- TypeScript strict

## Project Structure

```
src/
├── pages/              # Route pages (one folder per page)
│   ├── Home/           # Main chat page
│   │   └── HomeCont/   # Page container component
│   ├── Login/          # Login page
│   └── Page404/        # 404 page
├── layout/             # App shell components (Panel, ModelSelector, nav)
├── common/             # Generic reusable UI building blocks (design-system level)
├── providers/          # Logical wrappers (OpenAI, Antd, routing rules)
├── store/              # Zustand stores (one file per domain)
├── database/           # Entity definitions (types per Supabase table)
├── utils/
│   ├── app/            # App-specific hooks (useSupabase)
│   ├── hooks/          # Generic reusable hooks
│   └── functions/      # Pure utility functions
├── styles/             # Global SCSS (variables, utils, theme)
├── appConfig/          # App-level config (constants)
├── assets/             # Static assets (SVGs, images)
├── App.tsx             # Root component
├── Routes.tsx          # Route definitions
└── main.tsx            # Entry point
```

## Component Conventions

### Structure

Every component follows this internal structure:

```tsx
// -----------------------CONSTS, HOOKS, STATES
// -----------------------MAIN METHODS
// -----------------------AUX METHODS
// -----------------------RENDER
```

### Naming and Files

- Component name in PascalCase matches its folder and file name
- Each component lives in its own folder: `ComponentName/ComponentName.tsx`
- SCSS module file: `ComponentName/ComponentName.module.scss`
- Auxiliary files (utils, constants, hooks) go in the same folder as the component that uses them

### Component Placement (Where does it live?)

Decide placement by asking: **who uses this component?**

| Who uses it | Where it lives | Examples |
|-------------|---------------|----------|
| Any component, context-agnostic (design-system level) | `src/common/` | `CopyButton`, `Spinner`, `DynamicIcon`, form controls |
| All pages (app shell / global visual structure) | `src/layout/` | `Panel`, `ModelSelector`, `MessagesPagination` |
| All pages (logical wrapper, non-visual) | `src/providers/` | `OpenAiProvider`, `AntdProv`, `RoutingRules` |
| A single parent component | Co-located inside the parent's folder | `Gpts/` inside `Panel/` |

### Co-location Rules

Components specific to a parent live inside its folder, mirroring the component tree:

```
ParentComponent/
├── ParentComponent.tsx
├── ParentComponent.module.scss
├── ChildA/
│   ├── ChildA.tsx
│   ├── ChildA.module.scss
│   ├── GrandchildX/
│   │   └── GrandchildX.tsx
│   └── GrandchildY/
│       └── GrandchildY.tsx
└── ChildB/
    └── ChildB.tsx
```

- Hooks, utils, constants that are specific to a component live in that component's folder
- If `common/` grows, group by type: `common/buttons/`, `common/Formctlr/`, etc.

### Abstraction Rule

When a pattern (component, hook, util, mixin) repeats across unrelated components, extract it into `common/`, `utils/`, or `styles/` as appropriate. Do not tolerate copy-paste across siblings.

### Style Import Variable

Use `style` (singular), not `styles`:

```tsx
import style from './MyComponent.module.scss';
```

### className Usage

- The root element uses the SCSS module reference: `className={style.ComponentName}`
- All child elements use plain string classNames: `className="child-class"`
- Never reference `style.xxx` for anything other than the root element
- This works because SCSS modules have class collision names disabled in this project
- If the component has NO SCSS file, the root also uses a plain string: `className="ComponentName"`

## Styling Rules

### SCSS Module Boilerplate

Every SCSS module file MUST import variables and utils, even if not immediately used:

```scss
@import '/src/styles/variables';
@import '/src/styles/utils';

.ComponentName {
  // styles here
}
```

### Minimize classNames in JSX

- The root element gets the component name className — that's mandatory
- For child elements, prefer targeting HTML tag specificity inside the parent scope rather than adding classNames
- Good targets: `h1`, `h2`, `header`, `footer`, `ul`, `li`, `button`, `blockquote`, `table`, `th`, `td`, `p`, `strong`, `small`
- Avoid targeting overly generic tags: `span`, `div` — these need a className
- Only add a className when the tag is too generic or when there are multiple sibling elements of the same tag that need different styles

```scss
// GOOD: targeting specific tags within component scope
.DaySummary {
  header { ... }
  ul { ... }
  li { ... }
  blockquote { ... }
}

// GOOD: className only when needed for specificity
.DaySummary {
  .badge { ... }
  .empty { ... }
}
```

### Nesting Rules

- Only 1 level of nesting depth inside the component class
- For deeper specificity, chain class names on the same level:

```scss
// GOOD
.Parent {
  .child .grandchild { ... }
}

// BAD
.Parent {
  .child {
    .grandchild { ... }
  }
}
```

### No :global Required

SCSS modules have class collision names disabled — no need for `:global` to target library classes (like Ant Design). Just write them directly:

```scss
.MyComponent {
  .ant-picker-calendar { ... }
}
```

### No Inline Styles (almost)

- Never use inline `style={{}}` for layout or design
- Acceptable inline style: dynamic values that come from JS (like `backgroundColor` from a variable/map)
- If you already have a className, all its styles go in the SCSS file

### Style Responsibility

- Each component is responsible for styling its OWN elements only
- Never style a child component's internal elements from a parent's SCSS
- You CAN control a child component's positioning/margin from the parent (e.g., margin, grid placement)

## Database Conventions (Supabase)

### Entity Definitions

- Types for each Supabase table live in `src/database/<Entity>/definitions.ts`
- Each file exports the entity type matching the table columns
- Entities: `Messages`, `GPTs`, `Conversations`

### Data Access Pattern

- All Supabase operations are centralized in `src/utils/app/useSupabase.ts`
- The hook creates a Supabase client using keys from `useKeysStore` (persisted in localStorage)
- Methods follow the pattern: fetch data → update Zustand store (via `update()`)
- Error handling uses `swalApiError` for user-facing errors
- Each method manages its own `isLoading` state

### Conventions

- Never call Supabase directly from components — always go through `useSupabase()`
- Populate methods (`populateGpts`, `populateConversations`) handle the fetch-and-store-update cycle
- Use `WithId<T>` type wrapper for entities that include the Supabase `id` field

## Zustand Store Conventions

- One store per domain in `src/store/`
- Always use `devtools` middleware with a descriptive name
- Define `State` interface, `initialState`, and the store interface extending State
- Always include a `reset` method
- Use the `update` pattern: `update: (data) => set((state) => ({ ...state, ...data }))`
- For stores that need persistence (like API keys), use `persist` middleware wrapping the actions before `devtools`
- Derived/computed values can be functions on the store

## Form Conventions (Formik)

### Custom Hook Pattern

Every form MUST be implemented through a custom hook that encapsulates all Formik logic. The component only renders — it never owns form state or submit logic.

```tsx
// useMyForm.ts
export function useMyForm() {
  const formik = useFormik({
    initialValues: { ... },
    validationSchema: mySchema,
    onSubmit: async (values) => { ... },
  });

  return { formik };
}

// MyFormComponent.tsx
export function MyFormComponent(): ReactElement {
  const { formik } = useMyForm();
  // render using formik.values, formik.handleChange, etc.
}
```

### Rules

- The hook returns `{ formik }` (and any extra helpers if needed)
- All submit logic, validation, side effects (swal confirms, mutations, drawer closing) live in the hook
- The component is purely presentational — it destructures from the hook and renders
- Hook file lives in the same folder as the component: `ComponentName/useComponentNameForm.ts`

## useEffect Rules

- **Never use `useEffect` unless absolutely impossible to achieve otherwise**
- For derived state: compute it inline or use Zustand computed functions
- For subscriptions/event listeners: use dedicated hooks (`useEventListener`)
- If you think you need `useEffect`, first consider: Zustand, context, computed values, or restructuring the data flow
- Acceptable uses: third-party library integration that requires imperative setup, browser APIs with no React binding, or initial data fetching on mount

## TypeScript Conventions

- Use `type` imports where possible
- Export constants with `as const` for literal types
- Define domain types in `src/database/<Entity>/definitions.ts`
- Prefer union types over enums (`'A' | 'B' | 'C' | 'D'`)
- Extract constants arrays for runtime use: `const MODELS = ['gpt-4o', 'gpt-4o-mini'] as const`

## General Code Style

- Use named exports, never default exports
- Explicit return types on components (`: ReactElement`)
- No comments explaining WHAT — only WHY when non-obvious
- Keep JSX clean and readable — minimal props, minimal className noise
- Prefer semantic HTML tags for both accessibility and styling convenience
- Responsive design via the `onlyIn()` mixin (mob, desk, xs, sm, md, lg, xl, xxl)

## File Organization

- Imports order: Dependencies → UI Dependencies → Custom Hooks → Components → Config/Utils → Styles
- Mark import sections with comments: `// ---Dependencies`, `// ---Custom Hooks`, `// ---Components`, `// ---Config`
