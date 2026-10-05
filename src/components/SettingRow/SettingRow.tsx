import type { ReactNode } from 'react';
import { createComponent } from '../Component';
import { createStyles } from '../../theme';

const useStyles = createStyles({
  settingRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    // Lets a long description wrap inside the row rather than push the control out of view.
    minWidth: 0,
    gap: 2,
  },
  name: {
    fontWeight: 500,
    overflowWrap: 'anywhere',
  },
  description: {
    opacity: 0.75,
    fontSize: 13,
    overflowWrap: 'anywhere',
  },
  control: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

interface Props {
  /** What the setting is called. Clicking it operates the control, because the whole row is one label. */
  label: ReactNode;
  /** Plain words underneath the name saying what the setting does. */
  description?: ReactNode;
  /** The control (for example a `Switch` with no label of its own), shown at the right, centred to the text. */
  children: ReactNode;
  className?: string;
}

/**
 * One setting: its name and description on the left, its control on the right, so a column of rows lines every
 * control up. The row is a native `label`, so the name is tied to the control (a click on it toggles it, and
 * assistive technology reads it as the control's name).
 */
export const SettingRow = createComponent('SettingRow', ({ label, description, children, className }: Props) => {
  const { css, join } = useStyles();

  return (
    <label className={join(css.settingRow, className)}>
      <span className={css.text}>
        <span className={css.name}>{label}</span>
        {description != null && <span className={css.description}>{description}</span>}
      </span>
      <span className={css.control}>{children}</span>
    </label>
  );
});
