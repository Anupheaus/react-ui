// import ReactObj, { ReactNode, FunctionComponent } from 'react';
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// (window as any).React = ReactObj;
// import { Meta } from '@storybook/react-webpack5';

// interface MetaConfig {
//   name: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   // component: ExoticComponent<any>;
//   title: ReactNode;
// }

// function createMeta({
//   name,
// }: MetaConfig): Meta {
//   return {
//     title: name,
//     component: () => null,
//   };
// }

// const useStyles = makeStyles({
//   '@global': {
//     'html, body': {
//       fontFamily: 'Roboto',
//     },
//   },
//   title: {
//     paddingBottom: 12,
//   },
//   componentTestArea: {
//     display: 'flex',
//     flex: 'none',
//     width: 'max-content',
//     position: 'relative',
//     padding: 10,

//     '&:before': {
//       content: '""',
//       display: 'block',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       borderStyle: 'solid',
//       borderWidth: '10px 0',
//       borderImage: 'repeating-linear-gradient(-75deg, yellow, yellow 10px, black 10px, black 20px) 20',
//       pointerEvents: 'none',
//     },

//     '&:after': {
//       content: '""',
//       display: 'block',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       borderStyle: 'solid',
//       borderWidth: '0 10px',
//       borderImage: 'repeating-linear-gradient(-12deg, yellow, yellow 10px, black 10px, black 20px) 20',
//       pointerEvents: 'none',
//     }
//   },
// });

// interface StoryConfig {
//   title: ReactNode;
//   component: FunctionComponent;
// }

// function setupFont() {
//   for (const item of Array.from(document.head.children)) {
//     if (item instanceof HTMLLinkElement && item.href.includes('Roboto')) return;
//   }
//   const link = document.createElement('link');
//   link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300&display=swap';
//   link.rel = 'stylesheet';
//   document.head.append(link);
// }

// const theme = createTheme({
//   palette: {
//     text: {
//       primary: '#000',
//       secondary: '#fff',
//     },
//   },
// });

// function createStory({
//   title,
//   component: Component,
// }: StoryConfig) {
//   setupFont();
//   return (args: never) => {
//     const classes = useStyles();
//     return (
//       <ThemeProvider theme={theme}>
//         <Typography className={classes.title} variant={'h5'}>{title}</Typography>
//         <div className={classes.componentTestArea}>
//           <Component {...args} />
//         </div>
//       </ThemeProvider>
//     );
//   };
// }

// export const storyUtils = {
//   createMeta,
//   createStory,
// };
