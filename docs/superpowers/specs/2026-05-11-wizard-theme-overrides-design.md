# Wizard Theme Overrides — Design Spec

**Date:** 2026-05-11  
**Repo:** `react-ui` (changes), `vision` (consumer)

## Goal

Allow the wizard layout to be themed per-use-case: left panel transparent (window colour shows through), right content panel and button area independently overridable, and a horizontal divider between content and actions matching the existing vertical left/right divider.

## ThemeModel Changes

Add optional properties to `wizard` in `ThemeModel`:

```typescript
wizard: {
  progress: {
    panelBackgroundColor?: string  // was required; now optional — undefined = transparent
    // all other existing properties unchanged
  }
  contentBackgroundColor?: string  // right step-content panel background
  actionsBackgroundColor?: string  // button/actions area background
}
```

**Fallback behaviour:**
- `panelBackgroundColor` undefined → `backgroundColor` not set on left panel → window background colour bleeds through
- `contentBackgroundColor` undefined → falls back to `windows.content.active.backgroundColor`
- `actionsBackgroundColor` undefined → falls back to `windows.content.active.backgroundColor` (same as today)

**DefaultTheme:** all three new/modified properties left unset — no behaviour change for existing wizards.

## Component Changes (`react-ui`)

### `WizardStepIndicator.tsx`
- Change `backgroundColor: progress.panelBackgroundColor` to `backgroundColor: progress.panelBackgroundColor ?? 'transparent'`

### `Wizard.tsx`
- Add `backgroundColor: wizard.contentBackgroundColor ?? windows.content.active.backgroundColor` to the `wizardRight` style block

### `WizardActions.tsx`
- Add `borderTop: \`1px solid \${progress.panelBorderColor}\`` to create the horizontal divider (mirrors the vertical line style)
- Override background: `backgroundColor: wizard.actionsBackgroundColor ?? windows.content.active.backgroundColor`

## Consumer Changes (`vision` — `creamTheme.ts`)

Set the two right-panel theme properties to match the button area colour. Leave `panelBackgroundColor` unset so `#F3DBB8` (the window background) shows through the left panel.

## Acceptance Criteria

- Left panel has no background — window's `#F3DBB8` cream shows through
- Right content area and button area share a consistent background colour
- A horizontal hairline divider separates content from buttons (same weight/colour as the vertical left/right divider)
- All existing wizards on `DefaultTheme` are visually unchanged
