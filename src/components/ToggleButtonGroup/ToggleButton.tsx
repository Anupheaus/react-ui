import type { MouseEvent } from 'react';
import { useBound } from '../../hooks';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { createComponent } from '../Component';

const useStyles = createStyles({
  button: {
    borderRadius: '0px!important',
  },
});

interface Props {
  item: ReactListItem;
}

export const ToggleButton = createComponent('ToggleButton', ({
  item,
}: Props) => {
  const { css } = useStyles();

  const clicked = useBound((event: MouseEvent) => item.onClick?.(ReactListItem.createClickEvent(event, item)));

  return (
    <Button variant={item.isSelected ? 'default' : 'hover'} onClick={clicked} className={css.button}>
      {item.label ?? item.text}
    </Button>
  );
});