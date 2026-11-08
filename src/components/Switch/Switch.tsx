import { Switch as MuiSwitch } from '@mui/material';
import { createComponent } from '../Component';
import { Field, type FieldProps } from '../Field';
import { Flex } from '../Flex';
import { AssistiveLabel } from '../AssistiveLabel';
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
  rightLabel: {
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
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

/** Where the label sits: `above` the switch (the field default) or `right` of it on the same line. */
export type SwitchLabelPosition = 'above' | 'right';

interface Props extends FieldProps {
  value?: boolean;
  onChange?(value: boolean): void;
  /** Defaults to `above`. `right` puts the label beside the switch; pressing it toggles the switch too. */
  labelPosition?: SwitchLabelPosition;
}

export const Switch = createComponent('Switch', ({
  value,
  onChange,
  labelPosition = 'above',
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const { isReadOnly } = useUIState();
  // Read-only has to be honoured here as well as visually: MuiSwitch has no idea about UIState, so without
  // this guard a disabled-looking switch still fires onChange (matches how Checkbox does it).
  const toggle = useBound(() => { if (isReadOnly) return; onChange?.(!value); });

  const { label, assistiveHelp, error } = props;

  const field = (fieldProps: FieldProps) => (
    <Field
      tagName="switch"
      {...fieldProps}
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

  if (labelPosition !== 'right' || label == null) return field(props);

  return (
    <Flex tagName="switch-with-label" isVertical disableGrow>
      <Flex tagName="switch-with-label-row" valign="center" gap={4} disableGrow>
        {field({ ...props, label: undefined, assistiveHelp: false, error: undefined })}
        <span className={css.rightLabel} onClick={toggle}>{label}</span>
      </Flex>
      {/* Under the switch and its label together, so the row stays centred and the text spans both. */}
      <AssistiveLabel error={error}>{assistiveHelp}</AssistiveLabel>
    </Flex>
  );
});
