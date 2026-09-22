import { InternalError } from '@anupheaus/common';
import type { ReactNode } from 'react';
import { useContext } from 'react';
import { createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Titlebar } from '../../Titlebar';
import { WindowHeaderContext, WindowRenderContext } from '../WindowsContexts';

const useStyles = createStyles({
  titlebar: {
    zIndex: 1,
  },
});

interface Props {
  /** Overrides the Window's `title`; a title set via `useWindow().setTitle` still takes precedence. */
  title?: ReactNode;
  /** Overrides the Window's `icon`. */
  icon?: ReactNode;
  className?: string;
  /** Content rendered between the title and the window buttons. */
  children?: ReactNode;
  /** Replaces how the title is rendered; receives the resolved title. */
  renderTitle?(title: ReactNode): ReactNode;
  /** Replaces how the icon is rendered; receives the resolved icon. */
  renderIcon?(icon: ReactNode): ReactNode;
}

/**
 * The header (titlebar) of a Window or Dialog. Declare it as a direct child of the Window/Dialog to customise the header;
 * when it is not declared, the Window renders a default one in its place.
 */
export const WindowHeader = createComponent('WindowHeader', ({
  title: providedTitle,
  icon: providedIcon,
  className,
  children,
  renderTitle,
  renderIcon,
}: Props) => {
  const { css, join } = useStyles();
  const headerContext = useContext(WindowHeaderContext);
  const { title: runtimeTitle } = useContext(WindowRenderContext);
  // The header context is only provided around the Window's header slot, so a Header nested anywhere else was never hoisted into it.
  if (headerContext == null) throw new InternalError('Header must be a direct child of a Window, Dialog or Wizard (a fragment is allowed); it was rendered elsewhere.');
  const { title: windowTitle, icon: windowIcon, endAdornment, dragTargetProps } = headerContext;
  const title = runtimeTitle ?? providedTitle ?? windowTitle;
  const icon = providedIcon ?? windowIcon;

  return (
    <Titlebar
      {...dragTargetProps}
      className={join(css.titlebar, className)}
      icon={renderIcon == null ? icon : renderIcon(icon)}
      title={title}
      renderTitle={renderTitle}
      endAdornment={endAdornment}
    >
      {children}
    </Titlebar>
  );
});
