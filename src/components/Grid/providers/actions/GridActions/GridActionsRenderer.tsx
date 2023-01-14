import { AnyObject } from '@anupheaus/common';
import { Fragment, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useBound, useOnResize } from '../../../../../hooks';
import { ThemesProvider, TransitionTheme } from '../../../../../theme';
import { IconButtonTheme } from '../../../../Button';
import { createComponent } from '../../../../Component';
import { Tag } from '../../../../Tag';
import { GridTheme } from '../../../GridTheme';
import { GridActionsContext } from './GridActionsContext';

interface Props {
  isVisible: boolean;
}

export const GridActionsRenderer = createComponent({
  id: 'GridActionsRenderer',

  styles: ({ useTheme, createThemeVariant }) => {
    const { headers: { backgroundColor }, borders: { radius: borderRadius } } = useTheme(GridTheme);
    const transitionSettings = useTheme(TransitionTheme);
    return {
      styles: {
        gridActionsRenderer: {
          display: 'flex',
          position: 'absolute',
          top: 'calc(var(--header-actions-top, 0) - 50px)',
          right: -50,
          bottom: 'calc(100% - 30px)',
          //height: 'var(--header-actions-height, 30)',
          left: -50,
          overflow: 'hidden',
          pointerEvents: 'none',
        },
        gridActionsContainer: {
          display: 'flex',
          position: 'absolute',
          borderRadius,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          pointerEvents: 'all',
          bottom: 'var(--header-actions-top, 0)',
          right: 50,
          opacity: 0,
          backgroundColor,
          padding: 4,
          transitionProperty: 'opacity,bottom',
          ...transitionSettings,
        },
        isVisible: {
          bottom: 30,
          opacity: 1,
        },
      },
      variants: {
        iconButtonTheme: createThemeVariant(IconButtonTheme, {
          borderRadius: '4px',
          backgroundColor: 'transparent',
          activeBackgroundColor: 'rgba(0 0 0 / 20%)',
        }),
      },
    };
  },

  render({ isVisible }: Props, { css, variants, join }) {
    const { actions } = useContext(GridActionsContext);
    const [renderedActions, setRenderedActions] = useState<ReactNode>(null);
    const { target: resizeTarget, height } = useOnResize({ observeHeightOnly: true });

    const style = useMemo<AnyObject>(() => ({
      '--header-actions-top': `-${height}px`,
    }), [height]);

    const createRenderedActions = useBound(() => setRenderedActions(<>
      {actions.toArray()
        .map(({ ordinal, ...rest }, index) => ({ ...rest, ordinal: ordinal ?? index }))
        .orderBy(({ ordinal }) => ordinal)
        .map(({ id, label }) => <Fragment key={id}>{label}</Fragment>)}
    </>));

    useEffect(() => {
      createRenderedActions();
      return actions.onModified(createRenderedActions);
    }, []);

    return (
      <Tag name="grid-actions" className={css.gridActionsRenderer} style={style}>
        <Tag ref={resizeTarget} name="grid-actions-container" className={join(css.gridActionsContainer, renderedActions != null && isVisible && css.isVisible)}>
          <ThemesProvider themes={join(variants.iconButtonTheme)}>
            {renderedActions}
          </ThemesProvider>
        </Tag>
      </Tag>
    );
  },
});
