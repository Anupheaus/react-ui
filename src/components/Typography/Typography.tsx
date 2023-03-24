import { CSSProperties, useMemo } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';

const useStyles = createStyles({
  typography: {
    display: 'inline-block',
    justifyContent: 'inherit',
    alignItems: 'inherit',
  },
});

export interface TypographyType {
  fontSize?: string | number;
  fontWeight?: string | number;
}

export type TypographyTypes = {
  [name: string]: TypographyType;
};

interface Props<T extends TypographyTypes> {
  className?: string;
  type: keyof T;
}

class GetTypographyTypes<T extends TypographyTypes> { public getTypes() { return createTypographyComponentUsing<T>(null as unknown as T); } }
export type TypographyComponent<T extends TypographyTypes> = ReturnType<GetTypographyTypes<T>['getTypes']>;

export type TypographyTypeIds<T extends TypographyComponent<TypographyTypes>> = T extends TypographyComponent<infer U> ? keyof U : never;

export function createTypographyComponentUsing<T extends TypographyTypes>(types: T) {
  const Typography = createComponent('Typography', ({
    className,
    type,
  }: Props<T>) => {
    const { css, join } = useStyles();
    const typeStyle = types[type];

    const style = useMemo<CSSProperties>(() => ({
      fontSize: typeStyle?.fontSize ?? 12,
      fontWeight: typeStyle?.fontWeight ?? 400,
    }), [typeStyle]);

    return (
      <Tag name="typography" className={join(css.typography, className)} style={style} />
    );
  });

  return Typography;
}

// const AC = createTypographyComponentUsing({
//   title: { fontSize: 14 },
//   heading: { },
// });

// const a = <AC type="" />

// type b = TypographyTypeIds<typeof AC>;
