import { createTheme } from '../createTheme';

export const DefaultTheme = {
  text: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#000',
  },
  animation: {
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease',
  },
  action: {
    default: {
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
    backgroundColor: '#fff',

    menuItem: {
      default: {
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
    },
  },
  toolbar: {
    default: {
      backgroundColor: 'rgba(0 0 0 / 5%)',
      textColor: '#000',
      borderColor: 'rgba(0 0 0 / 10%)'
    },
    active: {
      backgroundColor: 'rgba(0 0 0 / 5%)',
      textColor: '#000',
      borderColor: 'rgba(0 0 0 / 20%)',
    },
  },
  field: {
    label: {
      fontSize: 14,
      fontWeight: 600,
    },
    value: {
      fontSize: 12,
      fontWeight: 400,
    },
    assistiveText: {
      fontSize: 12,
      fontWeight: 400,
    },
    default: {
      backgroundColor: 'transparent',
      color: '#000',
      borderColor: 'rgba(0 0 0 / 15%)',
      fontFamily: 'Roboto',
      fontSize: 13,
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
  error: {
    backgroundColor: 'red',
    color: '#b71313',
  },
  surface: {
    default: {
      backgroundColor: 'transparent',
    },
    asAContainer: {
      backgroundColor: '#f0f0f0',
      borderColor: '#ddd',
      color: '#000',
      fontFamily: 'Roboto',
      fontSize: 14,
      fontWeight: 400,
    },
    titleArea: {
      backgroundColor: '#1e88e5',
      color: '#fff',
      borderColor: 'transparent',
      fontSize: 16,
      fontWeight: 400,
    },
  },
  skeleton: {
    color: 'rgba(0 0 0 / 10%)',
  },
  icon: {
    default: {
      opacity: 0.7,
    },
    active: {
      opacity: 1,
    },
  },
  activePseudoClasses: '&:hover, &:active, &:focus, &:focus-visible' as const,
  vars: {
    ripple: '--ripple-color',
  },
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
