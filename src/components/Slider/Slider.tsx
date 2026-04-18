import { Slider as MuiSlider } from '@mui/material';
import { createComponent } from '../Component';
import { Field, type FieldProps } from '../Field';
import { useBound } from '../../hooks';
import { createStyles } from '../../theme';
import { useUIState } from '../../providers';

type SingleProps = {
  type: 'single';
  value?: number;
  onChange?(value: number): void;
};

type RangeProps = {
  type: 'range';
  value?: { min: number; max: number };
  onChange?(value: { min: number; max: number }): void;
};

type SliderOwnProps = {
  min?: number;
  max?: number;
  step?: number;
  showValue?: 'tooltip' | 'inline' | 'none';
  showMarks?: boolean;
  orientation?: 'horizontal' | 'vertical';
};

type Props = FieldProps & (SingleProps | RangeProps) & SliderOwnProps;

const valueLabelDisplayMap = {
  tooltip: 'auto',
  inline: 'on',
  none: 'off',
} as const;

const useStyles = createStyles(({ slider: { normal, active, readOnly }, pseudoClasses }, { applyTransition }) => ({
  slider: {
    '& .MuiSlider-track': {
      backgroundColor: normal.trackColor,
      borderColor: normal.trackColor,
      ...applyTransition('background-color, border-color'),
    },
    '& .MuiSlider-rail': {
      backgroundColor: normal.railColor,
      ...applyTransition('background-color'),
    },
    '& .MuiSlider-thumb': {
      backgroundColor: normal.thumbColor,
      borderColor: normal.thumbBorderColor ?? 'transparent',
      ...applyTransition('background-color'),
    },
    '& .MuiSlider-mark': {
      backgroundColor: normal.markColor ?? normal.railColor,
    },
    '& .MuiSlider-valueLabel': {
      backgroundColor: normal.valueLabelBackgroundColor ?? 'rgba(0 0 0 / 75%)',
      color: normal.valueLabelTextColor ?? '#fff',
    },

    [pseudoClasses.active]: {
      '& .MuiSlider-track': {
        backgroundColor: active.trackColor ?? normal.trackColor,
        borderColor: active.trackColor ?? normal.trackColor,
      },
      '& .MuiSlider-thumb': {
        backgroundColor: active.thumbColor ?? normal.thumbColor,
      },
    },

    [pseudoClasses.readOnly]: {
      '& .MuiSlider-track': {
        backgroundColor: readOnly.trackColor ?? normal.trackColor,
        borderColor: readOnly.trackColor ?? normal.trackColor,
      },
      '& .MuiSlider-rail': {
        backgroundColor: readOnly.railColor ?? normal.railColor,
      },
      '& .MuiSlider-thumb': {
        backgroundColor: readOnly.thumbColor ?? normal.thumbColor,
      },
    },
  },
}));

export const Slider = createComponent('Slider', (props: Props) => {
  const { css } = useStyles();
  const { isReadOnly } = useUIState();

  const {
    min = 0,
    max = 100,
    step = 1,
    showValue = 'none',
    showMarks = false,
    orientation = 'horizontal',
    label,
    isOptional,
    hideOptionalLabel,
    requiredMessage,
    help,
    assistiveHelp,
    error,
    wide,
    width,
    className,
  } = props;

  const muiValue = props.type === 'range'
    ? [props.value?.min ?? min, props.value?.max ?? max] as [number, number]
    : props.value ?? min;

  const handleChange = useBound((_event: Event, newValue: number | number[]) => {
    if (props.type === 'single') {
      props.onChange?.(newValue as number);
    } else {
      const [newMin, newMax] = newValue as number[];
      props.onChange?.({ min: newMin, max: newMax });
    }
  });

  return (
    <Field
      tagName="slider"
      noContainer
      label={label}
      isOptional={isOptional}
      hideOptionalLabel={hideOptionalLabel}
      requiredMessage={requiredMessage}
      help={help}
      assistiveHelp={assistiveHelp}
      error={error}
      wide={wide}
      width={width}
      className={className}
    >
      <MuiSlider
        className={css.slider}
        value={muiValue}
        min={min}
        max={max}
        step={step}
        marks={showMarks}
        orientation={orientation}
        valueLabelDisplay={valueLabelDisplayMap[showValue]}
        disabled={isReadOnly}
        onChange={handleChange}
      />
    </Field>
  );
});
