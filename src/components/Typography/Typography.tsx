import { CSSProperties, ReactNode, useMemo } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { LocalTypographicDefinitions, TypographyTypes } from './Typographies';

const useStyles = createStyles({
  typography: {
    fontSize: 14,
    fontWeight: 400,
    display: 'inline-block',
    justifyContent: 'inherit',
    alignItems: 'inherit',
  },
  fullWidth: {
    width: '100%',
  },
});

let augmentedTypographicDefinitions = LocalTypographicDefinitions as TypographyTypes;

interface Props<T extends TypographyTypes = typeof LocalTypographicDefinitions> {
  className?: string;
  type?: keyof T;
  size?: number | string;
  weight?: number | string;
  color?: string;
  fullWidth?: boolean;
  align?: CSSProperties['textAlign'];
  children: ReactNode;
}

const TypographyComponent = createComponent('Typography', ({
  className,
  type,
  size,
  weight,
  color,
  fullWidth,
  align,
  children,
}: Props<typeof LocalTypographicDefinitions>) => {
  const { css, join } = useStyles();
  const typeStyle = type != null ? augmentedTypographicDefinitions[type] : undefined;

  const style = useMemo<CSSProperties>(() => ({
    fontSize: size ?? typeStyle?.size,
    fontWeight: weight ?? typeStyle?.weight,
    textTransform: typeStyle?.transform ?? 'none',
    color: color ?? typeStyle?.color,
    textAlign: align,
  }), [typeStyle, align, size, weight, color]);

  return (
    <Skeleton type="text">
      <Tag name="typography" className={join(css.typography, fullWidth === true && css.fullWidth, className)} style={style}>
        {children}
      </Tag>
    </Skeleton>
  );
});

class AugmentedTypographyComponent<T extends TypographyTypes> { public getAugmentedTypographicType(): (props: Props<T & typeof LocalTypographicDefinitions>) => JSX.Element { return null as any; } }
const Typography = TypographyComponent as typeof TypographyComponent & {
  augmentWith<T extends TypographyTypes>(typographicDefinitions: T): ReturnType<AugmentedTypographyComponent<T>['getAugmentedTypographicType']>;
};

Typography.augmentWith = ((newTypographicDefinitions: TypographyTypes) => {
  augmentedTypographicDefinitions = {
    ...augmentedTypographicDefinitions,
    ...newTypographicDefinitions,
  };
  return Typography;
}) as typeof Typography.augmentWith;

export { Typography };
