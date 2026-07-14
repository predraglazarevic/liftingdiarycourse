# UI Coding Standards

These rules are mandatory for all UI work in this project. They exist to keep the
UI layer consistent, and to avoid the maintenance burden of bespoke, one-off
components.

## Components: shadcn/ui ONLY

- **ONLY shadcn/ui components may be used to build UI in this project.**
- **ABSOLUTELY NO custom components are to be created.** Do not hand-roll
  buttons, inputs, dialogs, popovers, calendars, cards, or any other UI
  primitive/pattern that shadcn/ui already provides.
- If a needed component does not yet exist in `src/components/ui`, add it via
  the shadcn CLI:

  ```bash
  npx shadcn@latest add <component>
  ```

  Do not write it by hand, and do not copy/paste a similar implementation
  from elsewhere.
- Compose screens and features by combining existing shadcn/ui components
  (`src/components/ui/*`). Feature-level code should arrange and wire up
  shadcn components with data/behavior — it should not introduce new
  presentational components, wrapper components purely for styling, or
  reimplementations of shadcn functionality.
- If a shadcn component needs different behavior, prefer configuring it via
  its existing props/variants. Only modify the generated file under
  `src/components/ui` itself if the shadcn component truly cannot support the
  need — never fork it into a parallel custom component.

## Dates: date-fns ONLY, one format

- All date formatting must go through [`date-fns`](https://date-fns.org/).
  Do not use `Intl.DateTimeFormat`, `Date.prototype.toLocaleDateString`, or
  any other formatting utility/library for dates shown in the UI.
- All dates displayed in the UI must use the ordinal day format:

  ```
  1st Sep 2025
  2nd Aug 2025
  3rd Jan 2026
  4th Jun 2024
  ```

  This is produced with the `date-fns` `format` function and the token
  string `"do MMM yyyy"`:

  ```ts
  import { format } from "date-fns";

  format(date, "do MMM yyyy"); // "1st Sep 2025"
  ```

- This format is the single standard for displaying dates in this project.
  Do not introduce alternate date formats (e.g. `MM/dd/yyyy`,
  `yyyy-MM-dd`, long weekday names) in UI-facing text. Non-display use
  cases (e.g. `date` query params, database values) are not bound by this
  format and may continue to use plain ISO date keys (`yyyy-MM-dd`).
