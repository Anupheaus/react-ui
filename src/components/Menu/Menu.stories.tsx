import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { Flex } from '../Flex';
import { Menu } from './Menu';
import type { ReactListItem } from '../../models';

const menuItems: ReactListItem[] = [
  { id: '1', text: 'Menu Item 1' },
  { id: '2', text: 'Menu Item 2' },
  { id: '3', text: 'Menu Item 3' },
  {
    id: '4',
    text: 'Menu Item 4',
    subItems: [
      { id: '4.1', text: 'Menu Item 4.1' },
      { id: '4.2', text: 'Menu Item 4.2' },
      { id: '4.3', text: 'Menu Item 4.3' },
      {
        id: '4.4',
        text: 'Menu Item 4.4',
        subItems: [
          { id: '4.4.1', text: 'Menu Item 4.4.1' },
          { id: '4.4.2', text: 'Menu Item 4.4.2' },
          { id: '4.4.3', text: 'Menu Item 4.4.3' },
        ],
      },
    ],
  },
  { id: '5', text: 'Menu Item 5' },
  { id: '6', text: 'Menu Item 6' },
  { id: '7', text: 'Menu Item 7' },
  { id: '8', text: 'Menu Item 8' },
  { id: '9', text: 'Menu Item 9' },
  { id: '10', text: 'Menu Item 10' },
];

const DemoableMenu = () => {
  return (
    <Flex fixedSize width={500} height={200}>
      <Menu items={menuItems} />
    </Flex>
  );
};

// const DemoablePopupMenu = () => {
//   const { PopupMenu, target, openMenu } = usePopupMenu();

//   return (
//     <Flex fixedSize width={500} height={200} valign="top">
//       <Button ref={target} onClick={openMenu}>Open Menu</Button>
//       <PopupMenu>
//         <MenuItem>Menu Item 1</MenuItem>
//         <MenuItem>Menu Item 2</MenuItem>
//         <MenuItem>Menu Item 3</MenuItem>
//         <MenuItem>
//           Menu Item 4
//           <Menu>
//             <MenuItem>Menu Item 4.1</MenuItem>
//             <MenuItem>Menu Item 4.2</MenuItem>
//             <MenuItem>Menu Item 4.3</MenuItem>
//             <MenuItem>
//               Menu Item 4.4
//               <Menu>
//                 <MenuItem>Menu Item 4.4.1</MenuItem>
//                 <MenuItem>Menu Item 4.4.2</MenuItem>
//                 <MenuItem>Menu Item 4.4.3</MenuItem>
//               </Menu>
//             </MenuItem>
//           </Menu>
//         </MenuItem>
//         <MenuItem>Menu Item 5</MenuItem>
//         <MenuItem>Menu Item 6</MenuItem>
//         <MenuItem>Menu Item 7</MenuItem>
//         <MenuItem>Menu Item 8</MenuItem>
//         <MenuItem>Menu Item 9</MenuItem>
//         <MenuItem>Menu Item 10</MenuItem>
//       </PopupMenu>
//     </Flex>
//   );
// };

const meta: Meta<typeof Menu> = {
  component: Menu,
};
export default meta;

type Story = StoryObj<typeof Menu>;

const config = {
  storyName: '',
  args: {

  },
  render: () => (
    <DemoableMenu />
  ),
} satisfies Story;

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.storyName = 'UI States';


// createStories(({ createStory }) => ({
//   name: 'Components/Menu',
//   module,
//   stories: {
//     ...generateUIStateStories(DemoableMenu),
//     'Menu': createStory({
//       wrapInStorybookComponent: false,
//       component: () => {
//         const { css } = useStyles();
//         return (<>
//           <StorybookComponent title={'Normal Menu'}>
//             <DemoableMenu />
//           </StorybookComponent>

//           <StorybookComponent title={'Far Side Menu'} width={110} className={css.farSideMenu}>
//             <DemoableMenu />
//           </StorybookComponent>

//           <StorybookComponent title={'Bottom Menu'} className={css.bottomMenu}>
//             <DemoableMenu />
//           </StorybookComponent>
//         </>);
//       },
//     }),

//     'usePopupMenu': createStory({
//       wrapInStorybookComponent: false,
//       component: () => {
//         const { css } = useStyles();
//         return (<>
//           <StorybookComponent title={'Normal Popup Menu'}>
//             <DemoablePopupMenu />
//           </StorybookComponent>

//           <StorybookComponent title={'Far Side Popup Menu'} width={110} className={css.farSideMenu}>
//             <DemoablePopupMenu />
//           </StorybookComponent>

//           <StorybookComponent title={'Bottom Popup Menu'} className={css.bottomMenu}>
//             <DemoablePopupMenu />
//           </StorybookComponent>
//         </>);
//       },
//     }),
//   },
// }));