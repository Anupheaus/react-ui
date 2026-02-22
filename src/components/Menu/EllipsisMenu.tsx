import type { ComponentProps } from 'react';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { Icon } from '../Icon';
import type { ListItemClickEvent, ReactListItem } from '../../models';
import { usePopupMenu } from './usePopupMenu';

interface Props {
  buttonSize?: ComponentProps<typeof Button>['size'];
  items: ReactListItem[];
  onClick?(event: ListItemClickEvent): void;
}

export const EllipsisMenu = createComponent('EllipsisMenu', ({
  buttonSize,
  items,
  onClick,
}: Props) => {
  const { target, openMenu, Menu } = usePopupMenu();

  return (<>
    <Button ref={target} onSelect={openMenu} variant="hover" size={buttonSize}>
      <Icon name="ellipsis-menu" size="small" />
    </Button>
    <Menu offsetPosition={0} items={items} onClick={onClick} />
  </>);
});