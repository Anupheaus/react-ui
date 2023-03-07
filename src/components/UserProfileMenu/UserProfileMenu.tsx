import { MD5 } from 'crypto-js';
import { ReactNode } from 'react';
import { useBooleanState } from '../../hooks';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { usePopupMenu } from '../Menu';

const useStyles = createStyles({
  gravatarImage: {
    maxWidth: 24,
    maxHeight: 24,
    borderRadius: '50%',
    overflow: 'hidden',
    boxShadow: '0 0 3px 1px rgba(0 0 0 / 0.4)',
    marginRight: 4,
    opacity: 0,
    transition: 'opacity 0.4s',
  },
  gravatarImageVisible: {
    opacity: 1,
  },

});

interface Props {
  emailAddress?: string;
  displayName: string;
  initials?: string;
  children: ReactNode;
}

export const UserProfileMenu = createComponent('UserProfileMenu', ({
  emailAddress,
  displayName,
  children,
}: Props) => {
  const { css, join } = useStyles();
  const [gravatarImageVisible, setGravatarImageVisible] = useBooleanState();
  const { target, PopupMenu, openMenu } = usePopupMenu();

  const gravatarImage = emailAddress ? (
    <img
      src={`https://www.gravatar.com/avatar/${MD5(emailAddress)}?s=24&d=mp`}
      className={join(css.gravatarImage, gravatarImageVisible && css.gravatarImageVisible)}
      onLoad={setGravatarImageVisible}
    />
  ) : undefined;

  return (<>
    <Button ref={target} onClick={openMenu}>{gravatarImage}{displayName}</Button>
    <PopupMenu menuAnchorPosition="topRight" offsetPosition={0} useWidthOfTargetElement>
      {children}
    </PopupMenu>
  </>);
});
