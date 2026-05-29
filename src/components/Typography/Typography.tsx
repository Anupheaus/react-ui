import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';
import { is } from '@anupheaus/common';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import type { Function } from 'ts-toolbelt';
import type { TypographyTypes } from './Typographies';
import { LocalTypographicDefinitions } from './Typographies';
import { useUIState } from '../../providers/UIStateProvider';

function isEmptyContent(children: ReactNode): boolean {
  if (children == null || typeof children === 'boolean') return true;
  if (is.string(children) || is.number(children)) return is.empty(children);
  if (Array.isArray(children)) return children.every(isEmptyContent);
  return false;
}

const useStyles = createStyles({
  typography: {
    fontSize: 14,
    fontWeight: 400,
    display: 'inline-block',
    justifyContent: 'inherit',
    alignItems: 'inherit',
    cursor: 'inherit',
    userSelect: 'none',
  },
  fullWidth: {
    width: '100%',
  },
});

let augmentedTypographicDefinitions = LocalTypographicDefinitions as TypographyTypes;

interface Props<T extends TypographyTypes = typeof LocalTypographicDefinitions> {
  className?: string;
  tagName?: string;
  type?: keyof T;
  size?: number | string;
  weight?: number | string;
  name?: string;
  spacing?: number | string;
  shadow?: string | number | boolean;
  color?: string;
  opacity?: number;
  fullWidth?: boolean;
  disableGrow?: boolean;
  align?: CSSProperties['textAlign'];
  valign?: CSSProperties['verticalAlign'];
  style?: CSSProperties;
  children: ReactNode;
  disableWrap?: boolean;
  onClick?(): void;
}

const TypographyComponent = createComponent('Typography', ({
  className,
  tagName,
  type,
  size,
  weight,
  name,
  spacing,
  opacity,
  shadow,
  color,
  fullWidth,
  disableGrow = false,
  align,
  valign,
  style: providedStyle,
  disableWrap = false,
  children,
  onClick,
}: Props<typeof LocalTypographicDefinitions>) => {
  const { css, join } = useStyles();
  const { isLoading } = useUIState();
  const typeStyle = type != null ? augmentedTypographicDefinitions[type] : undefined;

  const style = useMemo<CSSProperties>(() => ({
    fontSize: size ?? typeStyle?.size,
    fontWeight: weight ?? typeStyle?.weight,
    fontFamily: name ?? typeStyle?.name,
    textTransform: typeStyle?.transform ?? 'none',
    color: color ?? typeStyle?.color,
    letterSpacing: spacing ?? typeStyle?.spacing,
    textShadow: ((result: string | boolean | number | undefined) =>
      typeof (result) === 'boolean' ? (result === true ? '0 0 2px rgba(0 0 0 / 50%)' : undefined)
        : typeof (result) === 'number' ? `0 0 ${result}px rgba(0 0 0 / 50%)`
          : result)(shadow ?? typeStyle?.shadow),
    textAlign: align,
    verticalAlign: valign,
    opacity: opacity ?? typeStyle?.opacity,
    whiteSpace: disableWrap ? 'nowrap' : 'normal',
    ...providedStyle,
  }), [typeStyle, align, valign, size, opacity, weight, name, spacing, shadow, color, providedStyle]);

  const hasNoContent = isEmptyContent(children);

  const skeletonStyle = useMemo<CSSProperties | undefined>(() => {
    if (!hasNoContent) return;
    return {
      ...style,
      ...(disableGrow ? undefined : { width: '100%' }),
    };
  }, [disableGrow, hasNoContent, style]);

  return (
    <Skeleton
      type="text"
      disableGrow={disableGrow}
      useRandomWidth={hasNoContent && disableGrow}
      wide={!hasNoContent && fullWidth === true && !disableGrow}
      style={skeletonStyle}
    >
      {hasNoContent ? (isLoading ? <span>&nbsp;</span> : null) : (
        <Tag name={tagName ?? 'typography'} className={join(css.typography, fullWidth === true && css.fullWidth, className)} style={style} onClick={onClick}>
          {children}
        </Tag>
      )}
    </Skeleton>
  );
});

class AugmentedTypographyComponent<T extends TypographyTypes> { public getAugmentedTypographicType(): (props: Props<T & typeof LocalTypographicDefinitions>) => JSX.Element { return null as any; } }
const Typography = TypographyComponent as typeof TypographyComponent & {
  augmentWith<T extends TypographyTypes>(typographicDefinitions: T): ReturnType<AugmentedTypographyComponent<T>['getAugmentedTypographicType']>;
};

Typography.augmentWith = ((newTypographicDefinitions: Function.Narrow<TypographyTypes>) => {
  augmentedTypographicDefinitions = {
    ...augmentedTypographicDefinitions,
    ...newTypographicDefinitions,
  };
  return Typography;
}) as typeof Typography.augmentWith;

export { Typography };
