import { MD5 } from 'crypto-js';
import { useBooleanState } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { AnyObject } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { useMemo } from 'react';
import { Tag } from '../Tag';
import type { IconName } from '../Icon';
import { Icon } from '../Icon';
import { useUIState } from '../../providers';
import { NoSkeletons, Skeleton } from '../Skeleton';

const useStyles = createStyles(({ avatar: { normal, active, readOnly }, shadows, pseudoClasses }, { applyTransition }) => ({
  avatar: {
    borderRadius: '50%',
    boxShadow: normal.shadow === true ? shadows.medium(false) : normal.shadow === false ? undefined : normal.shadow,
    overflow: 'hidden',
    fontWeight: normal.textWeight,
    color: normal.textColor,
    backgroundColor: normal.backgroundColor,
    opacity: normal.opacity,
    containerType: 'inline-size',

    [pseudoClasses.active]: {
      fontWeight: active.textWeight ?? normal.textWeight,
      color: active.textColor ?? normal.textColor,
      backgroundColor: active.backgroundColor ?? normal.backgroundColor,
      opacity: active.opacity ?? normal.opacity,
    },

    [pseudoClasses.readOnly]: {
      fontWeight: readOnly.textWeight ?? normal.textWeight,
      color: readOnly.textColor ?? normal.textColor,
      backgroundColor: readOnly.backgroundColor ?? normal.backgroundColor,
      opacity: readOnly.opacity ?? normal.opacity,
    },

    '&.is-loading': {
      visibility: 'hidden',
    },

    '& initials': {
      display: 'inline-flex',
      fontSize: '52cqw',
    },
  },
  gravatarImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    ...applyTransition('opacity'),

    '&.is-visible': {
      opacity: 1,
    },
  },
  icon: {
    minWidth: '70%',
    minHeight: '70%',
    width: '70%',
    height: '70%',
  },
  skeleton: {
    width: '100%',
    height: '100%',
  },
}));

interface Props {
  displayName?: string;
  initials?: string;
  emailAddress?: string;
  iconName?: IconName;
  size?: 'small' | 'medium' | 'large' | number;
}

export const Avatar = createComponent('Avatar', ({
  emailAddress,
  displayName,
  initials: providedInitials,
  iconName = 'user',
  ...props
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();
  const { isLoading } = useUIState();
  const [gravatarImageVisible, setGravatarImageVisible] = useBooleanState();
  const initials = useMemo(() => {
    if (is.not.empty(providedInitials)) return providedInitials;
    const initialsFromDisplayName = displayName ? displayName.split(' ').map(part => part[0]).join('') : undefined;
    if (is.not.empty(initialsFromDisplayName)) return initialsFromDisplayName;
    return undefined;
  }, [(props as AnyObject).displayName, (props as AnyObject).initials]);

  const size = useMemo(() => {
    switch (props.size) {
      case 'large': return 34;
      case 'small': return 18;
      default: {
        if (is.number(props.size)) return props.size;
        return 28;
      }
    }
  }, [props.size]);

  const gravatarImage = emailAddress ? (
    <img
      src={`https://www.gravatar.com/avatar/${MD5(emailAddress)}?s=24&d=404`}
      className={join(css.gravatarImage, gravatarImageVisible && 'is-visible')}
      onLoad={setGravatarImageVisible}
    />
  ) : undefined;

  const style = useInlineStyle(() => ({
    width: size,
    height: size,
    maxWidth: size,
    maxHeight: size,
    minWidth: size,
    minHeight: size,
  }), [size]);

  return (
    <Flex tagName="avatar" className={join(css.avatar, isLoading && 'is-loading')} style={style} alignCentrally disableGrow>
      <Skeleton type="circle" className={css.skeleton}>
        <NoSkeletons>
          {gravatarImage}
          {is.not.empty(initials) ? (
            <Tag name="initials">{initials}</Tag>
          ) : (
            <Icon name={iconName} className={css.icon} />
          )}
        </NoSkeletons>
      </Skeleton>
    </Flex>
  );
});
