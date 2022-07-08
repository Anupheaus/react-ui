import { is } from 'anux-common';
import { ComponentProps } from 'react';
import { CSSObject } from 'tss-react';
import { anuxPureFC } from '../anuxComponents';
import { Tag } from '../Tag';
import { CreateStyles } from './createStyles';
import { CreateStylesApi, ThemeStyles, ThemeUsing, ThemeValues } from './themeModels';

type TagProps = Omit<ComponentProps<typeof Tag>, 'name'>;

export function createStyledTag<TValues extends ThemeValues = {}, TStyles extends ThemeStyles = {}>(createStyles: CreateStyles<TValues, TStyles>) {
  return (tag: string, stylesOrDelegate: CSSObject | ((theme: ThemeUsing<TValues, TStyles>) => CSSObject)) => {
    const useStyles = createStyles(api => ({
      tag: is.function(stylesOrDelegate) ? stylesOrDelegate(api) : stylesOrDelegate,
    })) as unknown as CreateStylesApi<{ tag: CSSObject; }, {}>;

    return anuxPureFC<TagProps>(tag, ({
      className,
      children = null,
      ...props
    }) => {
      const { classes, join } = useStyles();

      return (
        <Tag name={tag} className={join(classes.tag, className)} {...props}>
          {children}
        </Tag>
      );
    });
  };
}