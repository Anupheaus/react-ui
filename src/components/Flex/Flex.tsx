import { to } from 'anux-common';
import { CSSProperties, DOMAttributes, HTMLAttributes, ReactNode } from 'react';
import { anuxPureFC } from '../../anuxComponents';
import { Tag } from '../../Tag';
import { theme } from '../../theme';

type StyleProps = Omit<Props, 'align' | 'valign'> & { align: CSSProperties['justifyContent']; valign: CSSProperties['alignItems']; };
const useStyles = theme.createStyles((_theme, { gap, width, height, isVertical, align, valign }: StyleProps) => ({
  flex: {
    position: 'relative',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    overflow: 'hidden',
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
  optionalProps: {
    gap,
    width,
    height,
    ...(isVertical && height != null ? { flexBasis: height } : {}),
    ...(!isVertical && width != null ? { flexBasis: width } : {}),
  },
  align: isVertical ? {
    alignItems: align,
  } : {
    justifyContent: align,
  },
  valign: isVertical ? {
    justifyContent: valign,
  } : {
    alignItems: valign,
  },
  inline: {
    display: 'inline-flex',
  },
  allowOverflow: {
    overflow: 'unset',
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
  allowOverflow?: boolean;
  align?: 'left' | 'center' | 'right' | 'space-around' | 'space-between' | 'space-evenly';
  valign?: 'top' | 'center' | 'bottom' | 'space-around' | 'space-between' | 'space-evenly';
  gap?: number;
  testId?: string;
  tooltip?: ReactNode;
  allowFocus?: boolean;
}

export const Flex = anuxPureFC<Props>('Flex', ({
  className,
  tagName = 'div',
  disableGrow = false,
  disableShrink = false,
  fixedSize = false,
  isVertical = false,
  enableWrap = false,
  alignCentrally = false,
  inline = false,
  allowOverflow = false,
  width,
  height,
  size,
  gap,
  align: providedAlign,
  valign: providedVAlign,
  testId,
  tooltip,
  allowFocus,
  children = null,
  ...props
}) => {
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

  const { join, classes } = useStyles({ gap, width, height, align, valign, isVertical });

  if (fixedSize) { disableGrow = true; disableShrink = true; }

  return (
    <Tag
      name={tagName}
      {...props}
      className={join(
        classes.flex,
        classes.optionalProps,
        disableGrow && classes.disableGrow,
        disableShrink && classes.disableShrink,
        isVertical && classes.isVertical,
        enableWrap && classes.enableWrap,
        align != null && classes.align,
        valign != null && classes.valign,
        inline && classes.inline,
        allowOverflow && classes.allowOverflow,
        className,
      )}
      tabIndex={allowFocus === true ? 0 : allowFocus === false ? -1 : undefined}
    >
      {children}
    </Tag>
  );
});
