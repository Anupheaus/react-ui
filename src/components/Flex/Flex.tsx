import { to } from 'anux-common';
import { CSSProperties, DOMAttributes, HTMLAttributes, ReactNode, Ref, useMemo } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';

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
  ref?: Ref<HTMLDivElement>;
}

export const Flex = createComponent({
  id: 'Flex',

  styles: () => ({
    styles: {
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
      inline: {
        display: 'inline-flex',
      },
      allowOverflow: {
        overflow: 'unset',
      },
    },
  }),

  render({
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
    style: providedStyle,
    children = null,
    ref,
    ...props
  }: Props, { css, join }) {
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
      ...(align != null ? (isVertical ? { alignItems: align } : { justifyContent: align }) : {}),
      ...(valign != null ? (isVertical ? { justifyContent: valign } : { alignItems: valign }) : {}),
      ...providedStyle,
    }), [gap, width, height, isVertical, valign, align, providedStyle]);

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
          allowOverflow && css.allowOverflow,
          className,
        )}
        style={style}
        tabIndex={allowFocus === true ? 0 : allowFocus === false ? -1 : undefined}
      >
        {children}
      </Tag>
    );
  },
});
