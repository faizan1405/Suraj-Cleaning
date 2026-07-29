<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:context-aware-workflow -->
# Context-Aware Development Workflow

## Principle

Before making any changes, resolve the request to the **minimum set of relevant files**. Do not scan or read the entire project for every request. Load only what the task actually touches, plus its direct dependencies.

## Workflow (follow every request)

1. **Resolve** — Map the user's request to the relevant area(s) using the trigger keywords and dependency map in `PROJECT_INDEX.md`.
2. **Load** — Read only the files identified in the index (and their direct dependencies). Do NOT read unrelated pages, components, or utilities.
3. **Analyze** — Understand the specific code that needs to change. Identify all files that must be edited.
4. **Edit** — Make minimal, targeted changes. Use `Edit` for surgical replacements, `Write` only for new files.
5. **Verify** — Confirm no unintended side-effects on unrelated files.

## PROJECT_INDEX.md

The file `PROJECT_INDEX.md` is the authoritative map. It contains:

- **Sections 1–9:** Complete file listing organized by concern (Pages, Components, API Routes, Data, Libs, Contexts, Hooks, Types, Config).
- **Section 10 (Dependency Map):** For each major feature/topic, the exact files involved and their relationships.
- **Section 11 (Trigger Keywords):** Natural-language keywords mapped to file sections for quick resolution.
- **Section 12 (Env Vars):** Environment variables and where they're consumed.
- **Section 13 (Assets):** Public assets and where they're referenced.

When a task mentions a specific feature or keyword, use Section 11 to find the relevant section, then use Section 10 for the exact file list.

## Rules

- **Never read the entire `src/` directory** to answer a question or make a change.
- **Never read all components** when only one component is relevant.
- **Never read all API routes** when only one route is relevant.
- If a task mentions a feature not in the index, do a targeted search (`Grep` for the keyword) rather than reading all files.
- Preserve existing functionality — only change what the request explicitly requires.
- When the index is out of date (new files, moved files), update `PROJECT_INDEX.md` as part of the task.
<!-- END:context-aware-workflow -->
