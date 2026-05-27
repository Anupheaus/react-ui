import { createStyles } from '../../theme';

export const useTableActionsColumnShadowStyles = createStyles(({ surface: { shadows: { light } } }) => ({
  tableActionsShadow: {
    position: 'absolute',
    left: -15,
    width: 15,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',

    '&::after': {
      content: '""',
      position: 'absolute',
      right: -15,
      width: 15,
      top: 0,
      bottom: 0,
      ...light,
    },
  },
}));
