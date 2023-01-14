import { createTheme } from '../createTheme';

export const DefaultTheme = {
  action: {
    default: {
      backgroundColor: '#1e88e5',
      textColor: '#fff',
      borderColor: 'transparent',
      fontSize: 14,
      fontWeight: 400,
    },
    active: {
      backgroundColor: '#6ab7ff',
      textColor: '#fff',
      borderColor: 'transparent',
    },
    disabled: {
      backgroundColor: '#e3f2fd',
      textColor: '#90caf9',
    },
  },
  field: {
    default: {
      backgroundColor: '#fff',
      textColor: '#000',
      borderColor: '#ddd',
      fontSize: 14,
      fontWeight: 400,
      borderRadius: 4,
    },
    active: {
      backgroundColor: 'transparent',
      textColor: '#000',
      borderColor: '#ccc',
    },
    disabled: {
      backgroundColor: '#e3f2fd',
      textColor: '#90caf9',
      borderColor: '#bbb',
    },
  },
  error: {
    backgroundColor: 'red',
    textColor: '#b71313',
  },
  surface: {
    default: {
      backgroundColor: 'transparent',
    },
    asAContainer: {
      backgroundColor: '#f0f0f0',
      borderColor: '#ddd',
      textColor: '#000',
      fontSize: 14,
      fontWeight: 400,
    },
    titleArea: {
      backgroundColor: '#1e88e5',
      textColor: '#fff',
      borderColor: 'transparent',
      fontSize: 16,
      fontWeight: 600,
    },
  },
  skeleton: {
    color: 'rgba(0 0 0 / 10%)',
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
