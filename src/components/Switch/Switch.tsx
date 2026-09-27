import { Switch as MuiSwitch } from '@mui/material';
import { createComponent } from '../Component';
import { Field, type FieldProps } from '../Field';
import { useBound } from '../../hooks';
import { createStyles } from '../../theme';
import { useUIState } from '../../providers';

const useStyles = createStyles(({ switch: { normal: switchNormal, active: switchActive, checked: switchChecked }, pseudoClasses }, { applyTransition }) => ({
  switch: {
    '& span.MuiSwitch-track': {
      backgroundColor: switchNormal.backgroundColor,
      ...applyTransition('background-color'),
    },
    '& span.MuiSwitch-thumb': {
      backgroundColor: switchNormal.thumbColor,
      ...applyTransition('background-color'),
    },
    [pseudoClasses.active]: {
      '& span.MuiSwitch-track': {
        backgroundColor: switchActive.backgroundColor,
      },
      '& span.MuiSwitch-thumb': {
        backgroundColor: switchActive.thumbColor,
      },
    },
  },
  isChecked: {
    '& span.MuiSwitch-track': {
      backgroundColor: `${switchChecked.backgroundColor} !important`,
    },
    '& span.MuiSwitch-thumb': {
      backgroundColor: `${switchChecked.thumbColor} !important`,
    },
    [pseudoClasses.active]: {
      '& span.MuiSwitch-track': {
        backgroundColor: `${switchChecked.backgroundColor} !important`,
      },
      '& span.MuiSwitch-thumb': {
        backgroundColor: `${switchChecked.thumbColor} !important`,
      },
    },
  },
}));

interface Props extends FieldProps {
  value?: boolean;
  onChange?(value: boolean): void;
}

export const Switch = createComponent('Switch', ({
  value,
  onChange,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const { isReadOnly } = useUIState();
  // Read-only has to be honoured here as well as visually: MuiSwitch has no idea about UIState, so without
  // this guard a disabled-looking switch still fires onChange (matches how Checkbox does it).
  const toggle = useBound(() => { if (isReadOnly) return; onChange?.(!value); });

  return (
    <Field
      tagName="switch"
      {...props}
      noContainer
    >
      <MuiSwitch
        checked={value ?? false}
        disabled={isReadOnly}
        onClickCapture={toggle}
        className={join(css.switch, value === true && css.isChecked)}
      />
    </Field>
  );
});
