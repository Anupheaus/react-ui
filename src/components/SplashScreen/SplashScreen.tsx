import { createLegacyStyles } from '../../theme/createStyles';
import { ReactNode, useLayoutEffect, useRef } from 'react';
import { useDebounce } from '../../hooks';
import { useUIState } from '../../providers';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { SplashScreenTheme } from './SplashScreenTheme';

interface Props {
  className?: string;
  whenLoading?: ReactNode;
  children: ReactNode;
}
const useStyles = createLegacyStyles(({ useTheme }) => {
  const { backgroundColor, textColor } = useTheme(SplashScreenTheme);

  return {
    styles: {
      splashScreen: {
        display: 'flex',
        position: 'relative',
        flex: 'auto',
        width: '100%',
        height: '100%',
      },
      splashScreenRenderer: {
        display: 'flex',
        position: 'absolute',
        inset: 0,
        backgroundColor,
        color: textColor,
        opacity: 0,
        zIndex: 1000,
        pointerEvents: 'none',
        transition: 'opacity 1s ease',
        justifyContent: 'center',
        alignItems: 'center',
      },
      isVisible: {
        opacity: 1,
        pointerEvents: 'all',
      },
      splashScreenLoader: {
        display: 'flex',
        flex: 'none',
      },
    },
  };
});

export const SplashScreen = createComponent('SplashScreen', ({
  className,
  whenLoading,
  children,
}: Props) => {
  const { css, join } = useStyles();
  const { isLoading } = useUIState();
  const splashScreenElementRef = useRef<HTMLDivElement | null>(null);
  const childrenCloneRef = useRef<ChildNode[]>([]);

  const handleTransitionEnd = useDebounce(() => {
    const splashScreenElement = splashScreenElementRef.current;
    if (splashScreenElement == null) return;
    if (!isLoading) {
      childrenCloneRef.current = Array.from(splashScreenElement.cloneNode(true).childNodes).slice(0, -1);
    } else {
      (childrenCloneRef.current ?? []).forEach(child => splashScreenElement.removeChild(child));
      childrenCloneRef.current = [];
    }
  }, 200);

  useLayoutEffect(() => {
    if (childrenCloneRef.current == null || splashScreenElementRef.current == null) return;
    splashScreenElementRef.current.prepend(...childrenCloneRef.current);
  }, [isLoading]);

  return (
    <Tag ref={splashScreenElementRef} name="splash-screen" className={join(css.splashScreen, className)}>
      {!isLoading && children}
      <Tag name="splash-screen-renderer" className={join(css.splashScreenRenderer, isLoading && css.isVisible)} onTransitionEnd={handleTransitionEnd}>
        {whenLoading === undefined ? (
          <Tag name="splash-screen-loader" className={css.splashScreenLoader}>Loading, please wait...</Tag>
        ) : whenLoading}
      </Tag>
    </Tag>);
});
