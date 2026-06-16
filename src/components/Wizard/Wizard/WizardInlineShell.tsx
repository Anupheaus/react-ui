import type { CSSProperties, ReactNode } from 'react';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { useId } from '../../../hooks';
import { UIState, useValidation } from '../../../providers';
import { Flex } from '../../Flex';
import { Tag } from '../../Tag';
import { Titlebar } from '../../Titlebar';
import { useFormObserver } from '../../Form';
import { WindowContext } from '../../Windows/WindowsContexts';
import { WindowValidationProvider } from '../../Windows/Window/WindowValidationContext';

const useStyles = createStyles(({ wizard, windows: { content } }) => ({
  inlineShell: {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: wizard.contentBackgroundColor ?? content.active.backgroundColor,
  },
  inlineContentWrapper: {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
    overflow: 'hidden',
  },
}));

interface Props {
  className?: string;
  title?: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  children?: ReactNode;
}

/**
 * Chrome-less host for an inline wizard. Reproduces the content infrastructure that <Window>
 * provides (loading state, validation provider, form observer, validate section) plus an optional
 * header, but without any window chrome: no portal, no positioning, no drag/resize/maximize, and
 * no "preparing" transition. Fills its parent by default.
 */
export const WizardInlineShell = createComponent('WizardInlineShell', ({
  className,
  title,
  icon,
  isLoading = false,
  width,
  height,
  minWidth,
  minHeight,
  children,
}: Props) => {
  const { css, join } = useStyles();
  const id = useId();
  const { ValidateSection, isValid } = useValidation();
  const { FormObserver } = useFormObserver();

  const style: CSSProperties = { width, height, minWidth, minHeight };

  return (
    <Flex tagName="wizard-inline" isVertical className={join(css.inlineShell, className)} style={style}>
      {(title != null || icon != null) && <Titlebar icon={icon} title={title} />}
      <UIState isLoading={isLoading}>
        <WindowValidationProvider onCheckIsValid={isValid}>
          <FormObserver>
            <ValidateSection id={`wizard-inline-validation-${id}`}>
              <WindowContext.Provider value={{ disableScrolling: true }}>
                <Tag name="wizard-inline-content" className={css.inlineContentWrapper}>
                  {children}
                </Tag>
              </WindowContext.Provider>
            </ValidateSection>
          </FormObserver>
        </WindowValidationProvider>
      </UIState>
    </Flex>
  );
});
