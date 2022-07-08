import { ThemeStyles } from './themeModels';

export const predefinedStyles = (<T extends ThemeStyles>(styles: T): T => styles)({
  flex: {
    auto: {
      display: 'flex',
      flex: 'auto',
    },
    none: {
      display: 'flex',
      flex: 'none',
      horizontal: {
        display: 'flex',
        flex: 'none',
        flexDirection: 'row',
      },
      vertical: {
        display: 'flex',
        flex: 'none',
        flexDirection: 'column',
      }
    },
  },
  cursor: {
    pointer: {
      cursor: 'pointer',
    },
  },
  // flexAutoVertical: {
  //   display: 'flex',
  //   flex: 'auto',
  //   flexDirection: 'column',
  // },
  // flexAutoHorizonal: {
  //   display: 'flex',
  //   flex: 'auto',
  //   flexDirection: 'row',
  // },
  // flexNoneVertical: {
  //   display: 'flex',
  //   flex: 'none',
  //   flexDirection: 'column',
  // },
  // flexNoneHorizonal: {
  //   display: 'flex',
  //   flex: 'none',
  //   flexDirection: 'row',
  // },
  // cursorPointer: {
  //   cursor: 'pointer',
  // },
  // cursorDefault: {
  //   cursor: 'default',
  // },  
});

export type PredefinedStyles = typeof predefinedStyles;