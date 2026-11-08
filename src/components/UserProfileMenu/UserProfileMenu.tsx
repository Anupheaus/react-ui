import type { ComponentProps } from 'react';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { Menu as MenuComponent, usePopupMenu } from '../Menu';
import { Avatar } from '../Avatar';
import type { ListItemClickEvent, ReactListItem } from '../../models';

interface Props extends Omit<ComponentProps<typeof Avatar>, 'initials'> {
  displayName: string;
  items: ReactListItem[];
  /** When true, shows only the Avatar without the display name text — useful in compact / mobile layouts. */
  iconOnly?: boolean;
  /** Where the menu opens relative to the button; defaults to hanging below it, right-aligned. Use bottomRight + bottomLeft to pop out beside it. */
  targetAnchorPosition?: ComponentProps<typeof MenuComponent>['targetAnchorPosition'];
  menuAnchorPosition?: ComponentProps<typeof MenuComponent>['menuAnchorPosition'];
  onClick?(event: ListItemClickEvent): void;
}

export const UserProfileMenu = createComponent('UserProfileMenu', ({
  displayName,
  items,
  iconOnly,
  targetAnchorPosition,
  menuAnchorPosition = 'topRight',
  onClick,
  ...props
}: Props) => {
  const { target, Menu, openMenu } = usePopupMenu();

  return (<>
    <Button ref={target} variant="hover" onClick={openMenu} size="small" testId="user-profile-menu-button">
      <Avatar {...props} displayName={displayName} />
      {!iconOnly && displayName}
    </Button>
    <Menu targetAnchorPosition={targetAnchorPosition} menuAnchorPosition={menuAnchorPosition} offsetPosition={0} useWidthOfTargetElement items={items} onClick={onClick} />
  </>);
});
