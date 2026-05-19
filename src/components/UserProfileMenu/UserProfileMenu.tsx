import type { ComponentProps } from 'react';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { usePopupMenu } from '../Menu';
import { Avatar } from '../Avatar';
import type { ListItemClickEvent, ReactListItem } from '../../models';

interface Props extends Omit<ComponentProps<typeof Avatar>, 'initials'> {
  displayName: string;
  items: ReactListItem[];
  /** When true, shows only the Avatar without the display name text — useful in compact / mobile layouts. */
  iconOnly?: boolean;
  onClick?(event: ListItemClickEvent): void;
}

export const UserProfileMenu = createComponent('UserProfileMenu', ({
  displayName,
  items,
  iconOnly,
  onClick,
  ...props
}: Props) => {
  const { target, Menu, openMenu } = usePopupMenu();

  return (<>
    <Button ref={target} variant="hover" onClick={openMenu} size="small" testId="user-profile-menu-button">
      <Avatar {...props} displayName={displayName} />
      {!iconOnly && displayName}
    </Button>
    <Menu menuAnchorPosition="topRight" offsetPosition={0} useWidthOfTargetElement items={items} onClick={onClick} />
  </>);
});
