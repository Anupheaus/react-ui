import { CSSProperties } from '@material-ui/styles';
import { ComponentProps } from 'react';
import { anuxPureFC } from '../anuxComponents';
import { styles } from '../styles';
import { Tag } from './tag';

type TagProps = Omit<ComponentProps<typeof Tag>, 'name'>;

export function createStyledTag(tag: string, jss: CSSProperties) {
  const useStyles = styles.make({
    tag: jss,
  });

  return anuxPureFC<TagProps>(tag, ({
    className,
    children = null,
    ...props
  }) => {
    const classes = useStyles();

    return (
      <Tag name={tag} className={classes.join(classes.tag, className)} {...props}>
        {children}
      </Tag>
    );
  });
}
