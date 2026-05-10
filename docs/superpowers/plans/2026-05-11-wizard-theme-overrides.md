# Wizard Theme Overrides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional wizard theme properties so the left panel can be transparent and the right content/actions panels have independently overridable backgrounds, plus a horizontal divider between content and actions.

**Architecture:** Three new optional theme properties are added to `wizard` in `ThemeModel`. Components fall back to `windows.content.active.backgroundColor` when the override is unset. `creamTheme` in the `vision` repo sets all three to achieve the desired look.

**Tech Stack:** TypeScript, React, Emotion via `createStyles` from `@anupheaus/react-ui`

---

## File Map

| File | Repo | Change |
|------|------|--------|
| `src/theme/themes/ThemeModel.ts` | react-ui | Make `panelBackgroundColor` optional; add `contentBackgroundColor?`, `actionsBackgroundColor?` |
| `src/components/Wizard/Wizard/Wizard.tsx` | react-ui | Switch `createStyles` to function form; add `backgroundColor` to `wizardRight` |
| `src/components/Wizard/Wizard/WizardActions.tsx` | react-ui | Add `createStyles`; apply `borderTop` + `backgroundColor` override via className |
| `src/clients/common/providers/themes/creamTheme.ts` | vision | Remove `@ts-nocheck`; fix TS errors; add wizard theme overrides |

---

## Task 1: Extend ThemeModel

**Files:**
- Modify: `src/theme/themes/ThemeModel.ts`

- [ ] **Step 1: Update the `wizard` type in ThemeModel**

  Replace the existing `wizard` block (lines 446–457):

  ```typescript
  wizard: {
    progress: {
      currentColor: string;
      completedColor: string;
      futureColor: string;
      lineCompletedColor: string;
      lineColor: string;
      labelColor: string;
      panelBackgroundColor?: string;
      panelBorderColor: string;
    };
    contentBackgroundColor?: string;
    actionsBackgroundColor?: string;
  };
  ```

- [ ] **Step 2: Verify no TypeScript errors in react-ui**

  ```
  cd C:\code\personal\react-ui
  pnpm tsc --noEmit
  ```

  Expected: no errors. If there are errors relating to places that previously assigned `panelBackgroundColor` as a required `string`, they will be caught here — fix any that arise.

- [ ] **Step 3: Commit**

  ```
  git add src/theme/themes/ThemeModel.ts
  git commit -m "feat(theme): make wizard panelBackgroundColor optional; add contentBackgroundColor and actionsBackgroundColor"
  ```

---

## Task 2: Apply contentBackgroundColor to wizardRight in Wizard.tsx

**Depends on:** Task 1

**Files:**
- Modify: `src/components/Wizard/Wizard/Wizard.tsx`

- [ ] **Step 1: Switch `createStyles` to theme-accessor form and add backgroundColor to wizardRight**

  Replace the `useStyles` block (lines 12–35):

  ```typescript
  const useStyles = createStyles(({ wizard, windows: { content } }) => ({
    hidden: {
      display: 'none',
    },
    wizardLayout: {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1,
      overflow: 'hidden',
    },
    wizardRight: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflow: 'hidden',
      backgroundColor: wizard.contentBackgroundColor ?? content.active.backgroundColor,
    },
    wizardSteps: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr',
      flexGrow: 1,
      overflow: 'hidden',
    },
  }));
  ```

- [ ] **Step 2: Verify no TypeScript errors**

  ```
  cd C:\code\personal\react-ui
  pnpm tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```
  git add src/components/Wizard/Wizard/Wizard.tsx
  git commit -m "feat(Wizard): apply contentBackgroundColor theme override to wizardRight panel"
  ```

---

## Task 3: Add borderTop and actionsBackgroundColor to WizardActions.tsx

**Depends on:** Task 1

**Files:**
- Modify: `src/components/Wizard/Wizard/WizardActions.tsx`

- [ ] **Step 1: Add `createStyles` import and define wizard-specific styles**

  Add the import for `createStyles` (it doesn't exist in this file yet) and add the `useStyles` hook after the imports. The full updated file:

  ```typescript
  import { useContext } from 'react';
  import { createComponent } from '../../Component';
  import { createStyles } from '../../../theme';
  import { useDistributedState } from '../../../hooks';
  import { useBound } from '../../../hooks/useBound';
  import { Button } from '../../Button';
  import { UIState } from '../../../providers';
  import type { ActionsToolbarProps } from '../../ActionsToolbar';
  import { WindowActions } from '../../Windows/Window/WindowActions';
  import { useWindowValidation } from '../../Windows/Window/WindowValidationContext';
  import { WindowRenderContext } from '../../Windows/WindowsContexts';
  import { WizardContext, WizardEnabledContext } from '../WizardContexts';

  type Props = ActionsToolbarProps;

  const useStyles = createStyles(({ wizard, windows: { content } }) => ({
    wizardActions: {
      borderTop: `1px solid ${wizard.progress.panelBorderColor}`,
      backgroundColor: wizard.actionsBackgroundColor ?? content.active.backgroundColor,
    },
  }));

  export const WizardActions = createComponent('WizardActions', ({ children, onSave, saveLabel, isSaveReadOnly, className, ...rest }: Props) => {
    const { state, steps, moveNext, moveBack, checkStepIsValid } = useContext(WizardContext);
    const { isNextEnabled, isBackEnabled } = useContext(WizardEnabledContext);
    const { getAndObserve } = useDistributedState(state);
    const { close } = useContext(WindowRenderContext);
    const { isValid: isWindowValid } = useWindowValidation();
    const { css, join } = useStyles();

    const activeStepId = getAndObserve();
    const activeIndex = steps.findIndex(s => s.id === activeStepId);
    const isFirst = activeIndex <= 0;
    const isLast = activeIndex === steps.length - 1 || steps.length <= 1;
    const activeStep = steps[activeIndex];
    const stepHidesNext = activeStep?.hideNext === true;
    const stepHidesBack = activeStep?.hideBack === true;

    const handleSave = useBound(() => isLast ? (onSave ? onSave() : close?.('ok')) : moveNext());
    const handleCheckIsValid = useBound(() => isLast ? isWindowValid() : checkStepIsValid(activeStepId));

    return (
      <WindowActions
        {...rest}
        className={join(css.wizardActions, className)}
        onSave={stepHidesNext ? undefined : handleSave}
        onCheckIsValid={handleCheckIsValid}
        saveLabel={isLast ? (saveLabel ?? 'Save') : 'Next'}
        isSaveReadOnly={isSaveReadOnly === true || (!isNextEnabled && !isLast)}
      >
        {children}
        {!isFirst && !stepHidesBack && (
          <UIState isReadOnly={!isBackEnabled}>
            <Button onClick={moveBack}>Back</Button>
          </UIState>
        )}
      </WindowActions>
    );
  });
  ```

- [ ] **Step 2: Verify no TypeScript errors**

  ```
  cd C:\code\personal\react-ui
  pnpm tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```
  git add src/components/Wizard/Wizard/WizardActions.tsx
  git commit -m "feat(WizardActions): add borderTop divider and actionsBackgroundColor theme override"
  ```

---

## Task 4: Update creamTheme in vision

**Depends on:** Task 1 (react-ui must be built/linked before vision can consume the new types)

**Files:**
- Modify: `src/clients/common/providers/themes/creamTheme.ts` (in vision repo)

- [ ] **Step 1: Build react-ui so vision picks up the updated types**

  ```
  cd C:\code\personal\react-ui
  pnpm build
  ```

  Expected: build succeeds.

- [ ] **Step 2: Remove `@ts-nocheck`, remove invalid theme properties, and add wizard overrides**

  The file currently has `// @ts-nocheck` and two invalid properties (`action` and `field`) that don't exist in `Theme`. Replace the entire file with:

  ```typescript
  import { DefaultTheme, mergeThemes } from '@anupheaus/react-ui';
  import Color from 'color';

  const primaryTextColor = '#373B4D';
  const primaryBackgroundColor = '#F3DBB8';
  const primaryActionNormalColor = '#e2caa5';
  const primaryActionActiveColor = '#bca580';
  const primaryBackgroundLightColor = Color(primaryBackgroundColor).lighten(0.1).hex();

  export const creamTheme = mergeThemes(DefaultTheme, {
    fonts: [
      {
        fontFamily: 'Mulish',
        src: 'url(/assets/fonts/Mulish-Regular.ttf) format("truetype")',
      },
    ],
    buttons: {
      default: {
        normal: {
          backgroundColor: primaryActionNormalColor,
        },
        active: {
          backgroundColor: primaryActionActiveColor,
        },
        readOnly: {
          backgroundColor: 'rgba(0 0 0 / 5%)',
        },
      },
      bordered: {
        normal: {
          borderColor: primaryActionNormalColor,
        },
        active: {
          backgroundColor: primaryActionNormalColor,
          borderColor: primaryActionActiveColor,
        },
        readOnly: {
          backgroundColor: 'rgba(0 0 0 / 5%)',
        },
      },
      hover: {
        normal: {
        },
        active: {
          backgroundColor: primaryActionActiveColor,
        },
        readOnly: {
          backgroundColor: 'rgba(0 0 0 / 5%)',
        },
      }
    },
    text: {
      family: 'Mulish',
      color: primaryTextColor,
    },
    windows: {
      window: {
        active: {
          backgroundColor: primaryBackgroundColor,
        },
      },
      content: {
        active: {
          backgroundColor: primaryBackgroundLightColor,
        },
      },
    },
    chips: {
      chip: {
        normal: {
          backgroundColor: primaryActionNormalColor
        },
        active: {
          backgroundColor: primaryActionActiveColor
        },
      }
    },
    avatar: {
      normal: {
        backgroundColor: '#EBDBFD',
        shadow: '0 1px 3px 2px rgba(0 0 0 / 10%)',
      },
    },
    list: {
      normal: {
        textSize: 13,
      },
      item: {
        active: {
          backgroundColor: primaryBackgroundLightColor,
        },
      },
    },
    datePicker: {
      popup: {
        header: {
          shadow: '0 0 8px 0 rgba(0 0 0 / 40%)',
        },
      },
    },
    configurator: {
      header: {
        backgroundColor: primaryActionNormalColor,
        textColor: primaryTextColor,
      },
      item: {
        backgroundColor: primaryBackgroundColor,
      },
      subItem: {
        backgroundColor: Color(primaryBackgroundColor).darken(0.04).hex(),
      },
      slice: {
        backgroundColor: '#e1c9a4',
      }
    },
    assistiveLabel: {
      normal: {
        color: Color(primaryTextColor).alpha(0.6).hexa(),
      },
    },
    switch: {
      checked: {
        backgroundColor: primaryActionActiveColor,
      },
    },
    toolbar: {
      title: {
        fontSize: 20,
        boxShadow: 'none',
        textShadow: '0 0 4px rgba(0 0 0 / 50%)',
      },
      normal: {
        backgroundColor: primaryBackgroundColor,
        boxShadow: '0 0 8px 0 rgba(0 0 0 / 40%)',
        color: primaryTextColor,
      },
    },
    surface: {
      asAContainer: {
        normal: {
          backgroundColor: Color(primaryBackgroundColor).lighten(0.1).hex(),
        },
      },
    },
    menu: {
      normal: {
        backgroundColor: primaryBackgroundColor,
        fontSize: 13,
      },
    },
    wizard: {
      progress: {
        panelBackgroundColor: 'transparent',
      },
      contentBackgroundColor: primaryBackgroundLightColor,
      actionsBackgroundColor: primaryBackgroundLightColor,
    },
  });
  ```

  Note: the `action` block (not in `Theme`) and the `field` block (wrong key — `Theme` uses `fields`) have been removed as they were dead code that TypeScript was silently ignoring.

- [ ] **Step 3: Verify no TypeScript errors in vision**

  ```
  cd C:\code\personal\vision
  pnpm build-web
  ```

  Expected: web build succeeds with no type errors. If there are errors unrelated to this change (pre-existing), note them but do not fix them in this task — only fix errors caused by removing `@ts-nocheck`.

- [ ] **Step 4: Commit**

  ```
  git add src/clients/common/providers/themes/creamTheme.ts
  git commit -m "feat(creamTheme): set wizard panel transparent, align right panel backgrounds, add divider"
  ```

---

## Execution Notes

**Phase 1 (sequential):** Run Task 1 first — all other tasks depend on the updated types.

**Phase 2 (parallel):** Tasks 2 and 3 are independent of each other and can run simultaneously in react-ui. Task 4 requires react-ui to be built first (Step 1 of Task 4), then can proceed.

**Visual verification:** After all tasks are complete, open the Convert Quote to Order wizard in the running app and confirm:
- Left panel (step list): no background fill — the window's `#F3DBB8` cream shows through
- Right content area and button area: same background colour (`primaryBackgroundLightColor`)
- Horizontal hairline between content and buttons, matching the vertical left/right divider weight and colour
