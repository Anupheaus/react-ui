import { Slider as MuiSlider } from '@mui/material';
import { createComponent } from '../Component';
import { Field, type FieldProps } from '../Field';
import { useBound } from '../../hooks';
import { createStyles } from '../../theme';

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
  clampMin?: number;
  clampMax?: number;
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
      borderColor: normal.thumbBorderColor,
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
  sliderContainer: {
    position: 'relative',
    width: '100%',
  },
  forbiddenOverlay: {
    position: 'absolute',
    height: 4,
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: normal.forbiddenRailColor ?? 'rgba(0 0 0 / 12%)',
    pointerEvents: 'none',
    zIndex: 1,
    borderRadius: 2,
  },
  forbiddenOverlayVertical: {
    position: 'absolute',
    width: 4,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: normal.forbiddenRailColor ?? 'rgba(0 0 0 / 12%)',
    pointerEvents: 'none',
    zIndex: 1,
    borderRadius: 2,
  },
}));

export const Slider = createComponent('Slider', (props: Props) => {
  const { css, useInlineStyle } = useStyles();

  const {
    min = 0,
    max = 100,
    step = 1,
    showValue = 'none',
    showMarks = false,
    orientation = 'horizontal',
    clampMin,
    clampMax,
    ...fieldProps
  } = props;

  const trackRange = max - min;
  const effectiveClampMin = clampMin ?? min;
  const effectiveClampMax = clampMax ?? max;

  const leftOverlayStyle = useInlineStyle(() => ({
    left: 0,
    width: trackRange > 0 && clampMin != null ? `${((clampMin - min) / trackRange) * 100}%` : '0%',
  }), [clampMin, min, trackRange]);

  const rightOverlayStyle = useInlineStyle(() => ({
    left: trackRange > 0 && clampMax != null ? `${((clampMax - min) / trackRange) * 100}%` : '100%',
    right: 0,
  }), [clampMax, min, trackRange]);

  const bottomOverlayStyle = useInlineStyle(() => ({
    bottom: 0,
    height: trackRange > 0 && clampMin != null ? `${((clampMin - min) / trackRange) * 100}%` : '0%',
  }), [clampMin, min, trackRange]);

  const topOverlayStyle = useInlineStyle(() => ({
    top: 0,
    height: trackRange > 0 && clampMax != null ? `${((max - clampMax) / trackRange) * 100}%` : '0%',
  }), [clampMax, max, trackRange]);

  const muiValue = props.type === 'range'
    ? [props.value?.min ?? min, props.value?.max ?? max] as [number, number]
    : props.value ?? min;

  const handleChange = useBound((_event: Event, newValue: number | number[]) => {
    if (props.type === 'single') {
      const clamped = Math.max(effectiveClampMin, Math.min(effectiveClampMax, newValue as number));
      props.onChange?.(clamped);
    } else {
      const [newMin, newMax] = newValue as number[];
      props.onChange?.({
        min: Math.max(effectiveClampMin, newMin),
        max: Math.min(effectiveClampMax, newMax),
      });
    }
  });

  return (
    <Field
      tagName="slider"
      noContainer
      {...fieldProps}
    >
      <div className={css.sliderContainer}>
        {clampMin != null && orientation === 'horizontal' && (
          <div data-testid="forbidden-overlay-min" className={css.forbiddenOverlay} style={leftOverlayStyle} />
        )}
        {clampMax != null && orientation === 'horizontal' && (
          <div data-testid="forbidden-overlay-max" className={css.forbiddenOverlay} style={rightOverlayStyle} />
        )}
        {clampMin != null && orientation === 'vertical' && (
          <div data-testid="forbidden-overlay-min" className={css.forbiddenOverlayVertical} style={bottomOverlayStyle} />
        )}
        {clampMax != null && orientation === 'vertical' && (
          <div data-testid="forbidden-overlay-max" className={css.forbiddenOverlayVertical} style={topOverlayStyle} />
        )}
        <MuiSlider
          className={css.slider}
          value={muiValue}
          min={min}
          max={max}
          step={step}
          marks={showMarks}
          orientation={orientation}
          valueLabelDisplay={valueLabelDisplayMap[showValue]}
          onChange={handleChange}
        />
      </div>
    </Field>
  );
});
