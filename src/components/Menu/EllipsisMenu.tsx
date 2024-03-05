import { ComponentProps, ReactNode } from 'react';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { Icon } from '../Icon';
import { usePopupMenu } from './usePopupMenu';

interface Props {
  buttonSize?: ComponentProps<typeof Button>['size'];
  children: ReactNode;
}

export const EllipsisMenu = createComponent('EllipsisMenu', ({
  buttonSize,
  children,
}: Props) => {
  const { target, openMenu, PopupMenu } = usePopupMenu();

  return (<>
    <Button ref={target} onSelect={openMenu} variant="hover" size={buttonSize}>
      <Icon name="ellipsis-menu" size="small" />
    </Button>
    <PopupMenu offsetPosition={0}>
      {children}
    </PopupMenu>
  </>);
});