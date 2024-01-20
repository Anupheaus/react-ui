import Color from 'color';
import { createTheme } from '../createTheme';
import { Theme } from './ThemeModel';

export const DefaultTheme: Theme = {
  text: {
    primary: {
      fontFamily: 'Roboto',
      fontSize: 14,
      color: '#000',
    },
    secondary: {
      fontFamily: 'Roboto',
      fontSize: 14,
      color: '#000',
    },
  },
  animation: {
    animationDuration: '400ms',
    animationTimingFunction: 'ease',
  },
  transition: {
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease',
  },
  action: {
    normal: {
      backgroundColor: 'rgba(0 0 0 / 15%)',
      color: '#000',
      borderColor: 'rgba(0 0 0 / 15%)',
      fontSize: 14,
      fontWeight: 400,
    },
    active: {
      backgroundColor: 'rgba(0 0 0 / 25%)',
      color: '#000',
      borderColor: 'transparent',
    },
    disabled: {
      backgroundColor: 'rgba(0 0 0 / 5%)',
      color: 'rgba(0 0 0 / 45%)',
      borderColor: undefined as string | undefined,
    },
  },
  menu: {
    normal: {
      backgroundColor: '#fff',
    },
    disabled: {

    },

    menuItem: {
      normal: {
        backgroundColor: 'transparent',
        color: '#000',
        borderColor: 'transparent',
        padding: 8,
      },
      active: {
        backgroundColor: 'rgba(0 0 0 / 10%)',
        color: '#000',
        borderColor: 'transparent',
      },
      disabled: {},
    },
  },
  toolbar: {
    normal: {
      backgroundColor: 'rgba(0 0 0 / 5%)',
      color: '#000',
      borderColor: 'rgba(0 0 0 / 10%)',
      padding: '0 8px',
      gap: 8,
    },
    active: {
      borderColor: 'rgba(0 0 0 / 20%)',
    },
    disabled: {},
    title: {
      gap: 8,
    },
    content: {
      gap: 8,
    },
  },
  field: {
    label: {
      normal: {
        fontSize: 14,
        fontWeight: 600,
      },
      active: {},
      disabled: {},
    },
    value: {
      normal: {
        backgroundColor: 'transparent',
        color: '#000',
        borderColor: 'rgba(0 0 0 / 15%)',
        fontSize: 12,
        fontWeight: 400,
        borderRadius: 4,
      },
      active: {
        backgroundColor: 'transparent',
        color: '#000',
        borderColor: 'rgba(0 0 0 / 25%)',
      },
      disabled: {
        backgroundColor: 'rgba(0 0 0 / 10%)',
        color: 'rgba(0 0 0 / 65%)',
        borderColor: 'rgba(0 0 0 / 15%)',
      },
    },
    assistiveText: {
      fontSize: 12,
      fontWeight: 400,
    },
  },
  error: {
    backgroundColor: 'red',
    color: '#b71313',
  },
  surface: {
    general: {
      normal: {
        backgroundColor: 'transparent',
      },
      active: {},
      disabled: {},
    },
    asAContainer: {
      normal: {
        backgroundColor: '#f0f0f0',
        borderColor: '#ddd',
        color: '#000',
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: 400,
      },
      active: {},
      disabled: {},
    },
    titleArea: {
      normal: {
        backgroundColor: '#1e88e5',
        color: '#fff',
        borderColor: 'transparent',
        fontSize: 16,
        fontWeight: 400,
      },
      active: {},
      disabled: {},
    },
    shadows: {
      light: {
        boxShadow: '0 1px 2px rgba(0 0 0 / 15%), 0 3px 6px rgba(0 0 0 / 12%)',
      },
      medium: {
        boxShadow: '0 1px 3px rgba(0 0 0 / 30%), 0 6px 12px rgba(0 0 0 / 24%)',
      },
      heavy: {
        boxShadow: '0 3px 6px rgba(0 0 0 / 25%), 0 10px 20px rgba(0 0 0 / 20%)',
      },
    },
  },
  skeleton: {
    color: 'rgba(0 0 0 / 10%)',
  },
  icon: {
    normal: {
      opacity: 0.7,
    },
    active: {
      opacity: 1,
    },
    disabled: {},
  },
  scrollbars: {
    thumb: {
      normal: {
        backgroundColor: 'rgba(0 0 0 / 15%)',
        borderRadius: 8,
      },
      active: {},
      disabled: {},
    },
    track: {
      normal: {
        padding: 2,
        width: 10,
      },
      active: {},
      disabled: {},
    },
  },
  dataPaletteColors: ['#6929c4', '#1192e8', '#005d5d', '#9f1853', '#fa4d56', '#570408', '#198038', '#002d9c', '#ee538b', '#b28600', '#009d9a', '#012749', '#8a3800', '#a56eff']
    .map(color => Color(color).lighten(0.85).hexa()),
  activePseudoClasses: '&:hover, &:active, &:focus, &:focus-visible' as const,
};

export const ColorTheme = createTheme({
  id: 'ColorTheme',

  definition: {
    background: {
      action: {
        default: '#1e88e5',
        active: '#6ab7ff',
        disabled: '#e3f2fd',
      },
      surface: {
        default: 'transparent',
        asAContainer: '#ddd',
      },
    },
    // primary: {
    //   background: {
    //     main: '#1e88e5',
    //     light: '#6ab7ff',
    //     dark: '#005cb2',
    //   },
    //   text: {
    //     main: '#000',
    //     light: '#000',
    //     dark: '#fff',
    //   },
    //   border: {
    //     main: '#303F9F',
    //     light: '#303F9F',
    //     dark: '#303F9F',
    //   },
    // },
    // secondary: {
    //   background: {
    //     main: '#FF4081',
    //     light: '#FF80AB',
    //     dark: '#F50057',
    //   },
    //   text: {
    //     main: '#FFFFFF',
    //     light: '#FFFFFF',
    //     dark: '#FFFFFF',
    //   },
    //   border: {
    //     main: '#F50057',
    //     light: '#F50057',
    //     dark: '#F50057',
    //   },
    // },
    // background: {

    // }
  },
});
