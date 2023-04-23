import { CSSProperties, ReactNode, useMemo } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { LocalTypographicDefinitions, TypographyTypes } from './Typographies';

const useStyles = createStyles({
  typography: {
    display: 'inline-block',
    justifyContent: 'inherit',
    alignItems: 'inherit',
  },
});

let augmentedTypographicDefinitions = LocalTypographicDefinitions as TypographyTypes;

interface Props<T extends TypographyTypes = typeof LocalTypographicDefinitions> {
  className?: string;
  type: keyof T;
  children: ReactNode;
}

const TypographyComponent = createComponent('Typography', ({
  className,
  type,
  children,
}: Props<typeof LocalTypographicDefinitions>) => {
  const { css, join } = useStyles();
  const typeStyle = augmentedTypographicDefinitions[type];

  const style = useMemo<CSSProperties>(() => ({
    fontSize: typeStyle?.size ?? 12,
    fontWeight: typeStyle?.weight ?? 400,
  }), [typeStyle]);

  return (
    <Tag name="typography" className={join(css.typography, className)} style={style}>
      {children}
    </Tag>
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
