import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { useContext, useMemo } from 'react';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { useId } from '../../../hooks';
import { UIState, useValidation } from '../../../providers';
import { Flex } from '../../Flex';
import { Tag } from '../../Tag';
import { useFormObserver } from '../../Form';
import type { WindowHeaderContextProps } from '../../Windows/WindowsContexts';
import { WindowContext, WindowHeaderContext, WindowRenderContext } from '../../Windows/WindowsContexts';
import { WindowHeader } from '../../Windows/Window/WindowHeader';
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

/** An inline wizard cannot be dragged, so its header gets no drag-handle props. */
const NO_DRAG_TARGET_PROPS: WindowHeaderContextProps['dragTargetProps'] = {};

interface Props {
  className?: string;
  /** The consumer's Header (lifted out of the Wizard's children); when omitted a default header is shown if there is a title or icon. */
  header?: ReactElement;
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
 * header (a WindowHeader with no buttons), but without any window chrome: no portal, no positioning, no drag/resize/maximize, and
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
  header,
  children,
}: Props) => {
  const { css, join } = useStyles();
  const id = useId();
  const { ValidateSection, isValid } = useValidation();
  const { FormObserver } = useFormObserver();
  const { title: runtimeTitle } = useContext(WindowRenderContext);
  const headerContext = useMemo<WindowHeaderContextProps>(() => ({ title, icon, endAdornment: null, dragTargetProps: NO_DRAG_TARGET_PROPS }), [title, icon]);
  const hasDefaultHeader = title != null || icon != null || runtimeTitle != null;

  const style: CSSProperties = { width, height, minWidth, minHeight };

  return (
    <Flex tagName="wizard-inline" isVertical className={join(css.inlineShell, className)} style={style}>
      <WindowHeaderContext.Provider value={headerContext}>
        {header ?? (hasDefaultHeader && <WindowHeader />)}
      </WindowHeaderContext.Provider>
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
