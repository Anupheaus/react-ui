// import { Button } from '@mui/material';
// import { storyUtils } from '../../storybook';
// import { styles } from '../theme';
// import { Tag } from '../Tag';
// import { useDrawer as useDrawerTest } from './useDrawer';

// export default storyUtils.createMeta({
//   name: 'anux-react-utils/useDrawer',
//   title: 'useDrawer',
// });

// export const useDrawer = storyUtils.createStory({
//   title: 'useDrawer',
//   component: () => {
//     const classes = styles.usePreDefined();

//     const { Drawer, openDrawer } = useDrawerTest();
//     return (
//       <Tag name="drawer-test-container" className={classes.flexNone}>
//         <Button onClick={openDrawer}>Open</Button>
//         <Drawer title="My Title" disableBackdropClick disableEscapeKeyDown enableLogging="verbose">
//           Hey
//         </Drawer>
//       </Tag>
//     );
//   },
// });