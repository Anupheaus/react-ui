import { ReactNode } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { Button } from '../Button';

const useStyles = createStyles(({ field: { value: { normal: field } } }) => ({
  toolbar: {
    border: field.border,
    borderColor: field.borderColor,
    borderStyle: 'solid',

    '& button': {
      borderRadius: 0,
      minHeight: '28px!important',
    },
  },
}));

interface Props {
  className?: string;
  children?: ReactNode;
}

export const Toolbar = createComponent('Toolbar', ({
  className,
  children,
}: Props) => {
  const { css, join } = useStyles();

  return (
    <Tag name="toolbar" className={join(css.toolbar, className)}>
      <Button.Overrides variant="hover">
        {children}
      </Button.Overrides>
    </Tag>
  );
});
