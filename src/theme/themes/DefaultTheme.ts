import Color from 'color';
import { createTheme } from '../createTheme';
import type { Theme } from './ThemeModel';

const primaryTextColor = '#000';

const defaultButtons: Theme['buttons']['default'] = {
  normal: {
    backgroundColor: 'rgba(0 0 0 / 15%)',
    borderColor: 'transparent',
    borderRadius: 4,
  },
  active: {
    backgroundColor: 'rgba(0 0 0 / 25%)',
    borderColor: 'transparent',
    borderRadius: 4,
  },
  readOnly: {
    backgroundColor: 'rgba(0 0 0 / 5%)',
    borderColor: 'transparent',
    borderRadius: 4,
  },
};

export const DefaultTheme: Theme = {
  assistiveLabel: {
    normal: {
      fontSize: 12,
      fontWeight: 400,
      color: Color(primaryTextColor).alpha(0.6).hexa(),
      errorTextColor: '#b71313',
    },
    active: {},
    readOnly: {},
  },
  buttons: {
    default: defaultButtons,
    bordered: {
      normal: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(0 0 0 / 15%)',
        borderRadius: 4,
      },
      active: {
        backgroundColor: 'rgba(0 0 0 / 10%)',
        borderColor: 'rgba(0 0 0 / 25%)',
        borderRadius: 4,
      },
      readOnly: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(0 0 0 / 5%)',
        borderRadius: 4,
      },
    },
    hover: {
      normal: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderRadius: 4,
      },
      active: {
        backgroundColor: 'rgba(0 0 0 / 10%)',
        borderColor: 'transparent',
        borderRadius: 4,
      },
      readOnly: {
        backgroundColor: '#e3f2fd',
        borderColor: 'transparent',
        borderRadius: 4,
        textColor: 'rgba(0 0 0 / 55%)',
      },
    },
  },
  text: {
    family: 'Roboto',
    size: 14,
    weight: 400,
    color: primaryTextColor,
  },
  error: {
    family: 'Roboto',
    size: 14,
    weight: 400,
    color: '#b71313',
  },
  fields: {
    label: {
      normal: {
        textWeight: 400,
      },
      active: {},
      readOnly: {},
    },
    content: {
      normal: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0 0 0 / 15%)',
        borderRadius: 4,
      },
      active: {},
      readOnly: {},
    },
    value: {
      normal: {},
      active: {},
      readOnly: {},
    },
  },
  gaps: {
    fields: 8,
  },
  windows: {
    window: {
      active: {
        backgroundColor: '#fff',
        borderRadius: 8,
        shadow: 'rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px',
        filter: 'brightness(95%)',

      },
      inactive: {
        filter: 'brightness(80%)',
      },
    },
    content: {
      active: {
        padding: 12,
      },
      inactive: {},
    },
  },
  transitions: {
    duration: 400,
    function: 'ease-in-out',
  },
  list: {
    normal: {
      gap: 4,
    },
    active: {},
    readOnly: {},

    item: {
      normal: {
        borderRadius: 4,
        borderWidth: 0,
        padding: '4px 8px',
      },
      active: {
        backgroundColor: 'rgba(0 0 0 / 10%)',
      },
      readOnly: {},
    },

    selectableItem: {
      normal: {
        padding: '4px 8px',
      },
      active: {
        backgroundColor: 'rgba(0 0 0 / 10%)',
      },
      readOnly: {},
    },

    draggableItem: {
      normal: {
        padding: '4px 8px',
      },
      active: {
        backgroundColor: 'rgba(0 0 0 / 10%)',
      },
      readOnly: {},
    },
  },
  pseudoClasses: {
    active: '&:not(.is-read-only):hover, &:not(.is-read-only):active, &:not(.is-read-only):focus, &:not(.is-read-only):focus-visible, &:not(.is-read-only).is-active',
    readOnly: '&.is-read-only',
    tablet: '@media(pointer: coarse)',
    mobile: '@media(pointer: coarse) and (max-width: 768px)',
  },
  dropDown: {
    normal: {
      gap: 4,
    },
    active: {},
    readOnly: {},
  },
  chips: {
    normal: {
      gap: 4,
    },
    active: {},
    readOnly: {},

    chip: {
      normal: {
        backgroundColor: 'rgba(0 0 0 / 15%)',
        borderRadius: 8,
        padding: '4px 8px',
      },
      active: {
        backgroundColor: 'rgba(0 0 0 / 25%)',
      },
      readOnly: {
        backgroundColor: 'rgba(0 0 0 / 5%)',
      },
    }
  },
  avatar: {
    normal: {
      backgroundColor: '#C9E7F5',
      shadow: true,
    },
    active: {},
    readOnly: {
      opacity: 0.7,
    },
  },
  shadows: {
    veryLight: inset => `${inset ? 'inset ' : ''}0 1px 2px rgba(0 0 0 / 10%), ${inset ? 'inset ' : ''}0 2px 4px rgba(0 0 0 / 7%)`,
    light: inset => `${inset ? 'inset ' : ''}0 1px 2px rgba(0 0 0 / 15%), ${inset ? 'inset ' : ''}0 3px 6px rgba(0 0 0 / 12%)`,
    medium: inset => `${inset ? 'inset ' : ''}0 1px 3px rgba(0 0 0 / 30%), ${inset ? 'inset ' : ''}0 6px 12px rgba(0 0 0 / 24%)`,
    heavy: inset => `${inset ? 'inset ' : ''}0 3px 6px rgba(0 0 0 / 25%), ${inset ? 'inset ' : ''}0 10px 20px rgba(0 0 0 / 20%)`,
    veryHeavy: inset => `${inset ? 'inset ' : ''}0 5px 9px rgba(0 0 0 / 30%), ${inset ? 'inset ' : ''}0 14px 28px rgba(0 0 0 / 25%)`,
    scroll: inset => `${inset ? 'inset ' : ''}0 0 8px 0 #000`,
  },
  icons: {
    normal: {
      opacity: 0.8,
    },
    active: {
      opacity: 1,
    },
    readOnly: {
      opacity: 0.7,
    },
  },
  configurator: {
    header: {
      backgroundColor: '#efefef',
      textColor: primaryTextColor,
    },
    item: {
      backgroundColor: '#d2d2d2',
      textColor: primaryTextColor,
    },
    subItem: {
      backgroundColor: '#bcbcbc',
      textColor: primaryTextColor,
    },
    slice: {
      backgroundColor: '#ada7fd',
    },
  },
  switch: {
    normal: {
      backgroundColor: 'rgba(0 0 0 / 25%)',
      thumbColor: 'rgba(255 255 255 / 85%)',
    },
    active: {
      backgroundColor: 'rgba(0 0 0 / 35%)',
      thumbColor: '#fff',
    },
    checked: {
      backgroundColor: '#22c115',
      thumbColor: '#fff',
    },
    readOnly: {
      backgroundColor: 'rgba(0 0 0 / 15%)',
      thumbColor: 'rgba(255 255 255 / 85%)',
    },
  },
  // datePicker: {
  //   popup: {
  //     header: {
  //       backgroundColor: 'blue',
  //     },
  //     content: {
  //       backgroundColor: 'red',
  //     },
  //     days: {
  //       selected: {
  //         backgroundColor: 'green',
  //       },
  //     },
  //   },
  // },


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
      color: primaryTextColor,
      borderColor: 'rgba(0 0 0 / 15%)',
      fontSize: 14,
      fontWeight: 400,
    },
    active: {
      backgroundColor: 'rgba(0 0 0 / 25%)',
      color: primaryTextColor,
      borderColor: 'transparent',
    },
    disabled: {
      backgroundColor: 'rgba(0 0 0 / 5%)',
      color: Color(primaryTextColor).alpha(0.45).hexa(),
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
        color: primaryTextColor,
        borderColor: 'transparent',
        padding: 8,
      },
      active: {
        backgroundColor: 'rgba(0 0 0 / 10%)',
        color: primaryTextColor,
        borderColor: 'transparent',
      },
      disabled: {},
    },
  },
  toolbar: {
    normal: {
      backgroundColor: 'rgba(0 0 0 / 5%)',
      color: primaryTextColor,
      borderColor: 'rgba(0 0 0 / 10%)',
      padding: '0 8px',
      gap: 8,
      minHeight: 32,
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
        fontWeight: 500,
      },
      active: {},
      disabled: {},
    },
    value: {
      normal: {
        backgroundColor: 'transparent',
        color: primaryTextColor,
        borderColor: 'rgba(0 0 0 / 15%)',
        fontSize: 12,
        fontWeight: 400,
        borderRadius: 4,
      },
      active: {
        backgroundColor: 'transparent',
        color: primaryTextColor,
        borderColor: 'rgba(0 0 0 / 25%)',
      },
      disabled: {
        backgroundColor: 'rgba(0 0 0 / 10%)',
        color: Color(primaryTextColor).alpha(0.65).hexa(),
        borderColor: 'rgba(0 0 0 / 15%)',
      },
    },
    assistiveText: {
      fontSize: 12,
      fontWeight: 400,
    },
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
        color: primaryTextColor,
        // fontFamily: 'Roboto',
        // fontSize: 14,
        // fontWeight: 400,
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
    color: Color(primaryTextColor).alpha(0.1).hexa(),
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
        height: 10,
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
