import { useState } from 'react';
import type { ReactNode } from 'react';
import Color from 'color';
import { Slider as MuiSlider } from '@mui/material';
import { createComponent } from '../Component';
import { Field, type FieldProps } from '../Field';
import { Tag } from '../Tag';
import { useBound } from '../../hooks';
import { createStyles } from '../../theme';

type SingleProps = {
  type: 'single';
  value?: number;
  onChange?(value: number): void;
};

type RangeProps = {
  type: 'range';
  value?: { min: number; max: number; };
  onChange?(value: { min: number; max: number; }): void;
};

type SliderOwnProps = {
  min?: number;
  max?: number;
  step?: number;
  showValue?: 'tooltip' | 'inline' | 'active' | 'none';
  showMarks?: boolean;
  orientation?: 'horizontal' | 'vertical';
  clampMin?: number;
  clampMax?: number;
  showScaleLabels?: boolean;
  minLabel?: ReactNode;
  maxLabel?: ReactNode;
};

type Props = FieldProps & (SingleProps | RangeProps) & SliderOwnProps;

const valueLabelDisplayMap = {
  tooltip: 'auto',
  inline: 'on',
  none: 'off',
} as const;

const defaultThumbBorderStyle = 'solid';
const haloOpacity = 0.16;
const hoverHaloSize = 8;
const activeHaloSize = 14;

// The greys are derived by flattening the (typically translucent) field border colour onto the
// window background at increasing strengths, giving a clear hierarchy: rail (lightest) < filled
// track (medium) < thumb (darkest, most prominent). Multipliers are applied to the border
// colour's own alpha so the scale tracks the theme rather than being hard-coded.
const railGreyStrength = 0.8;
const trackGreyStrength = 1.5;
const thumbGreyStrength = 2.7;

const flattenOntoBackground = (backgroundColor: string, color: string, strength: number): string => {
  const base = Color(color);
  return Color(backgroundColor).mix(base.alpha(1), Math.min(1, base.alpha() * strength)).rgb().string();
};

const useStyles = createStyles((
  {
    slider: { normal, active, hover, readOnly },
    assistiveLabel: { normal: assistiveLabel },
    fields: { content: { normal: fieldContent } },
    windows: { window: { active: windowActive } },
    pseudoClasses,
    text,
  },
  { applyTransition },
) => {
  // Defaults are derived from the field border colour flattened onto the window background (see
  // flattenOntoBackground above) so the slider stays cohesive with the rest of the theme while
  // keeping the rail, filled track and thumb visually distinct.
  const windowBackgroundColor = windowActive.backgroundColor;
  const railColor = normal.railColor ?? flattenOntoBackground(windowBackgroundColor, fieldContent.borderColor, railGreyStrength);
  const trackColor = normal.trackColor ?? flattenOntoBackground(windowBackgroundColor, fieldContent.borderColor, trackGreyStrength);
  const trackBorderColor = normal.trackBorderColor ?? trackColor;
  const thumbColor = normal.thumbColor ?? flattenOntoBackground(windowBackgroundColor, fieldContent.borderColor, thumbGreyStrength);
  const thumbBorderColor = normal.thumbBorderColor ?? fieldContent.borderColor;
  const thumbBorderWidth = normal.thumbBorderWidth ?? fieldContent.borderWidth;
  const thumbBorderStyle = normal.thumbBorderStyle ?? defaultThumbBorderStyle;
  const haloColor = normal.haloColor ?? Color(thumbColor).alpha(haloOpacity).string();
  const hoverHaloColor = hover?.haloColor ?? haloColor;
  const activeHaloColor = active.haloColor ?? hoverHaloColor;

  return ({
    slider: {
      '& .MuiSlider-track': {
        backgroundColor: trackColor,
        borderColor: trackBorderColor,
        ...applyTransition('background-color, border-color'),
      },
      '& .MuiSlider-rail': {
        backgroundColor: railColor,
        ...applyTransition('background-color'),
      },
      '& .MuiSlider-thumb': {
        backgroundColor: thumbColor,
        borderColor: thumbBorderColor,
        borderWidth: thumbBorderWidth,
        borderStyle: thumbBorderStyle,
        ...applyTransition('background-color, border-color, box-shadow'),
      },
      '& .MuiSlider-thumb:hover, & .MuiSlider-thumb.Mui-focusVisible': {
        backgroundColor: hover?.thumbColor ?? thumbColor,
        borderColor: hover?.thumbBorderColor ?? thumbBorderColor,
        boxShadow: `0 0 0 ${hoverHaloSize}px ${hoverHaloColor}`,
      },
      '& .MuiSlider-thumb.Mui-active': {
        boxShadow: `0 0 0 ${activeHaloSize}px ${activeHaloColor}`,
      },
      '& .MuiSlider-mark': {
        backgroundColor: normal.markColor ?? railColor,
      },
      '& .MuiSlider-valueLabel': {
        backgroundColor: normal.valueLabelBackgroundColor ?? 'rgba(0 0 0 / 75%)',
        color: normal.valueLabelTextColor ?? '#fff',
      },

      [pseudoClasses.active]: {
        '& .MuiSlider-track': {
          backgroundColor: active.trackColor ?? trackColor,
          borderColor: active.trackBorderColor ?? active.trackColor ?? trackBorderColor,
        },
        '& .MuiSlider-thumb': {
          backgroundColor: active.thumbColor ?? thumbColor,
        },
      },

      [pseudoClasses.readOnly]: {
        '& .MuiSlider-track': {
          backgroundColor: readOnly.trackColor ?? trackColor,
          borderColor: readOnly.trackBorderColor ?? readOnly.trackColor ?? trackBorderColor,
        },
        '& .MuiSlider-rail': {
          backgroundColor: readOnly.railColor ?? railColor,
        },
        '& .MuiSlider-thumb': {
          backgroundColor: readOnly.thumbColor ?? thumbColor,
          borderColor: readOnly.thumbBorderColor ?? thumbBorderColor,
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
    scaleLabelsHorizontal: {
      width: '100%',
    },
    scaleLabelsVertical: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    scaleLabelsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },
    scaleLabel: {
      fontSize: assistiveLabel.fontSize,
      fontWeight: assistiveLabel.fontWeight,
      color: assistiveLabel.color ?? text.color,
      cursor: 'default',
    },
  });
});

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
    showScaleLabels = false,
    minLabel,
    maxLabel,
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

  // 'active' shows the value label only while the thumb is being dragged, so it is driven by local
  // state rather than a static MUI display mode.
  const [isDragging, setIsDragging] = useState(false);

  const muiValue = props.type === 'range'
    ? [props.value?.min ?? min, props.value?.max ?? max] as [number, number]
    : props.value ?? min;

  const valueLabelDisplay = showValue === 'active'
    ? (isDragging ? 'on' : 'off')
    : valueLabelDisplayMap[showValue];

  const handleChange = useBound((_event: Event, newValue: number | number[]) => {
    setIsDragging(true);
    if (props.type === 'single') {
      const clamped = Math.max(effectiveClampMin, Math.min(effectiveClampMax, newValue as number));
      props.onChange?.(clamped);
    } else {
      const [newMin, newMax] = newValue as [number, number];
      props.onChange?.({
        min: Math.max(effectiveClampMin, newMin),
        max: Math.min(effectiveClampMax, newMax),
      });
    }
  });

  const handleChangeCommitted = useBound(() => setIsDragging(false));

  // showScaleLabels is a shortcut to show the default min/max numbers; an explicit minLabel/maxLabel is
  // always shown (and overrides the default), regardless of showScaleLabels.
  const hasScaleLabels = showScaleLabels || minLabel != null || maxLabel != null;
  const scaleMinLabel = minLabel ?? (showScaleLabels ? min : undefined);
  const scaleMaxLabel = maxLabel ?? (showScaleLabels ? max : undefined);

  const sliderTrack = (
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
        valueLabelDisplay={valueLabelDisplay}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
      />
    </div>
  );

  const scaleLabels = hasScaleLabels && orientation === 'vertical'
    ? (
      <div className={css.scaleLabelsVertical}>
        <Tag name="scale-label-max" className={css.scaleLabel} testId="scale-label-max">
          {scaleMaxLabel}
        </Tag>
        {sliderTrack}
        <Tag name="scale-label-min" className={css.scaleLabel} testId="scale-label-min">
          {scaleMinLabel}
        </Tag>
      </div>
    )
    : hasScaleLabels
      ? (
        <div className={css.scaleLabelsHorizontal}>
          {sliderTrack}
          <div className={css.scaleLabelsRow}>
            <Tag name="scale-label-min" className={css.scaleLabel} testId="scale-label-min">
              {scaleMinLabel}
            </Tag>
            <Tag name="scale-label-max" className={css.scaleLabel} testId="scale-label-max">
              {scaleMaxLabel}
            </Tag>
          </div>
        </div>
      )
      : sliderTrack;

  return (
    <Field
      tagName="slider"
      noContainer
      {...fieldProps}
    >
      {scaleLabels}
    </Field>
  );
});
