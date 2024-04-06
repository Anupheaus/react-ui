import { ComponentProps, ReactNode } from 'react';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { usePopupMenu } from '../Menu';
import { Avatar } from '../Avatar';

interface Props extends Omit<ComponentProps<typeof Avatar>, 'initials'> {
  displayName: string;
  children: ReactNode;
}

export const UserProfileMenu = createComponent('UserProfileMenu', ({
  displayName,
  children,
  ...props
}: Props) => {
  const { target, PopupMenu, openMenu } = usePopupMenu();

  return (<>
    <Button ref={target} variant="hover" onClick={openMenu} size="small">{<Avatar {...props} displayName={displayName} />}{displayName}</Button>
    <PopupMenu menuAnchorPosition="topRight" offsetPosition={0} useWidthOfTargetElement>
      {children}
    </PopupMenu>
  </>);
});
