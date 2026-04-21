# README Hierarchy Design

**Date:** 2026-04-13  
**Status:** Approved

## Goal

Add a navigable README hierarchy to the entire codebase so that humans and agents can understand any part of the repo by following links from the root README downward. Every folder with meaningful content gets a README; all READMEs link back up to their parent.

## File hierarchy

```
AGENTS.md                                      ← root
├── src/components/AGENTS.md                   ← all components, grouped by category
│   └── src/components/[Name]/AGENTS.md        ← one per component (~68 total)
├── src/hooks/AGENTS.md                        ← all hooks listed with descriptions
│   └── src/hooks/[name]/AGENTS.md             ← one per hook (~36 total)
├── src/providers/AGENTS.md                    ← all providers listed with descriptions
│   └── src/providers/[Name]/AGENTS.md         ← one per provider (7 total)
├── src/theme/AGENTS.md                        ← theming system (single file, no sub-READMEs)
└── src/errors/AGENTS.md                       ← error handling (single file, no sub-READMEs)
```

`src/models/` and `src/extensions/` are small enough to be covered by section-level notes in the root README only.

## Filename convention

All documentation files are named **AGENTS.md**. The three existing AGENTS.md files (`Dialog/AGENTS.md`, `Configurator/AGENTS.md`, `Windows/AGENTS.md`) are migrated into AGENTS.md equivalents and the originals deleted. References in `agent.md` are updated accordingly.

## Content structure

### Component README (`src/components/[Name]/AGENTS.md`)
- What it is / problem it solves (1–3 sentences)
- Props table: name | type | required | description
- Usage example (brief code snippet)
- Architecture / file-role notes for complex components
- Back-link to `src/components/AGENTS.md`

### Hook README (`src/hooks/[name]/AGENTS.md`)
- What it does (1–2 sentences)
- Signature, parameters, return value
- Usage example
- Back-link to `src/hooks/AGENTS.md`

### Provider README (`src/providers/[Name]/AGENTS.md`)
- What it provides / when to mount it
- Props
- How to consume (hook or context)
- Back-link to `src/providers/AGENTS.md`

### Section index README (`src/components/AGENTS.md`, `src/hooks/AGENTS.md`, `src/providers/AGENTS.md`)
- Brief description of the section
- Grouped/categorised list of all entries with one-line descriptions and links to individual READMEs
- Back-link to root `AGENTS.md`

### `src/theme/AGENTS.md` and `src/errors/AGENTS.md`
- Purpose and mental model
- Key exports and their roles
- Usage patterns
- Back-link to root `AGENTS.md`

### Root `AGENTS.md`
- Keep existing intro text and badges
- Replace the large component table with a link to `src/components/AGENTS.md`
- Add links to all section READMEs (`components`, `hooks`, `providers`, `theme`, `errors`)
- Link to `agent.md`

### `agent.md`
- Add a note that agents can navigate the codebase via README files starting at `AGENTS.md`
- Update AGENTS.md references to point to the new AGENTS.md paths

## Execution plan

Three parallel streams:

**Stream 1 — this session (structural files):**
1. Update root `AGENTS.md`
2. Write `src/components/AGENTS.md`
3. Write `src/hooks/AGENTS.md`
4. Write `src/providers/AGENTS.md`
5. Write `src/theme/AGENTS.md`
6. Write `src/errors/AGENTS.md`
7. Update `agent.md`
8. Delete `Dialog/AGENTS.md`, `Configurator/AGENTS.md`, `Windows/AGENTS.md` (content migrated into their AGENTS.md)

**Stream 2 — 7 parallel component agents (~10 components each):**
Each agent reads its assigned component folders and writes one AGENTS.md per folder.

**Stream 3 — 2 parallel agents:**
- Hook agent: all ~36 hook folders
- Provider agent: all 7 provider folders

After all streams complete, final consistency pass to verify back-links.

## README freshness rule

`agent.md` must include an explicit instruction: whenever changes are made to the codebase (new components, modified APIs, renamed files, changed behaviour), the relevant README files must be updated to reflect those changes. Specifically:
- Added/removed props → update props table in component README
- New hook/component/provider → add its README and update the section index
- Behavioural change → update description and examples
- Deletion → remove from all READMEs that reference it

## Scope boundaries

- No changes to source code.
- No new AGENTS.md files — only AGENTS.md going forward.
- `src/models/` and `src/extensions/` covered in root README only (no new files).
- Storybook, tests, scripts, dist — no READMEs.
