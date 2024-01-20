import { createLegacyStyles } from '../../theme/createStyles';
import { to } from '@anupheaus/common';
import { CSSProperties, DOMAttributes, HTMLAttributes, ReactNode, Ref, useMemo } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';

const formatMaxWidthOrHeight = (maxDimension: number | string | boolean | undefined, maxBoth: boolean | undefined): string | number | undefined => {
  if (maxBoth === true || maxDimension === true) return '100%';
  if (maxDimension === false) return undefined;
  return maxDimension;
};

const useStyles = createLegacyStyles(() => ({
  styles: {
    flex: {
      position: 'relative',
      display: 'flex',
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 'auto',
      outline: 'none',
    },
    disableGrow: {
      flexGrow: 0,
    },
    disableShrink: {
      flexShrink: 0,
    },
    isVertical: {
      flexDirection: 'column',
    },
    enableWrap: {
      flexWrap: 'wrap',
    },
    inline: {
      display: 'inline-flex',
    },
    disableOverflow: {
      overflow: 'hidden',
    },
  },
}));

interface Props extends DOMAttributes<HTMLDivElement>, HTMLAttributes<HTMLDivElement> {
  className?: string;
  tagName?: string;
  disableGrow?: boolean;
  disableShrink?: boolean;
  fixedSize?: boolean;
  isVertical?: boolean;
  enableWrap?: boolean;
  width?: number | string;
  height?: number | string;
  size?: number | string;
  inline?: boolean;
  alignCentrally?: boolean;
  disableOverflow?: boolean;
  maxWidth?: number | string | boolean;
  maxHeight?: number | string | boolean;
  maxWidthAndHeight?: boolean;
  shadow?: number;
  align?: 'left' | 'center' | 'right' | 'space-around' | 'space-between' | 'space-evenly';
  valign?: 'top' | 'center' | 'bottom' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch';
  gap?: number;
  testId?: string;
  tooltip?: ReactNode;
  allowFocus?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export const Flex = createComponent('Flex', ({
  className,
  tagName = 'div',
  disableGrow = false,
  disableShrink = false,
  fixedSize = false,
  isVertical = false,
  enableWrap = false,
  alignCentrally = false,
  inline = false,
  disableOverflow = false,
  maxWidth,
  maxHeight,
  maxWidthAndHeight,
  shadow,
  width,
  height,
  size,
  gap,
  align: providedAlign,
  valign: providedVAlign,
  testId,
  tooltip,
  allowFocus,
  style: providedStyle,
  children = null,
  ref,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  if (alignCentrally) { providedAlign = providedAlign ?? 'center'; providedVAlign = providedVAlign ?? 'center'; }
  const align = providedAlign != null ? to.switchMap<Required<Props>['align'], Required<CSSProperties>['justifyContent']>(providedAlign, {
    left: 'flex-start',
    right: 'flex-end',
    '*': providedAlign,
  }) : undefined;
  const valign = providedVAlign != null ? to.switchMap<Required<Props>['valign'], Required<CSSProperties>['alignItems']>(providedVAlign, {
    top: 'flex-start',
    bottom: 'flex-end',
    '*': providedVAlign,
  }) : undefined;

  if (size != null) { width = width ?? size; height = height ?? size; }

  const style = useMemo<CSSProperties>(() => ({
    gap,
    width,
    height,
    maxWidth: formatMaxWidthOrHeight(maxWidth, maxWidthAndHeight),
    maxHeight: formatMaxWidthOrHeight(maxHeight, maxWidthAndHeight),
    boxShadow: shadow != null ? `0 0 0 ${Math.floor(shadow / 2)}px rgba(63,63,68,0.05), 0 0 ${shadow}px ${Math.floor(shadow / 2)}px rgba(63,63,68,0.15)` : undefined,
    ...(align != null ? (isVertical ? { alignItems: align } : { justifyContent: align }) : {}),
    ...(valign != null ? (isVertical ? { justifyContent: valign } : { alignItems: valign }) : {}),
    ...providedStyle,
  }), [gap, width, height, isVertical, valign, align, providedStyle, maxWidth, maxHeight, maxWidthAndHeight, shadow]);

  if (fixedSize) { disableGrow = true; disableShrink = true; }

  return (
    <Tag
      name={tagName}
      {...props}
      ref={ref}
      className={join(
        css.flex,
        disableGrow && css.disableGrow,
        disableShrink && css.disableShrink,
        isVertical && css.isVertical,
        enableWrap && css.enableWrap,
        inline && css.inline,
        disableOverflow && css.disableOverflow,
        className,
      )}
      style={style}
      tabIndex={allowFocus === true ? 0 : allowFocus === false ? -1 : undefined}
    >
      {children}
    </Tag>
  );
});
