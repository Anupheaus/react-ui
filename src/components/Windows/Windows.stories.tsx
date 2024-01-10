import { Meta, StoryObj } from '@storybook/react';
import { Windows, Windows as WindowsType } from './Windows';
import { StorybookComponent2 } from '../../Storybook';
import { WindowsManager } from './WindowsManager';
import { Window } from './Window';
import { useBound } from '../../hooks';
import { WindowState } from './WindowsModels';

const meta: Meta<typeof WindowsType> = {
  component: WindowsType,
};
export default meta;

type Story = StoryObj<typeof WindowsType>;

export const Default: Story = {
  render() {
    const handleCreateNewWindow = useBound((data: WindowState) => (
      <Window id={data.id} title={'This is my new window'} />
    ));

    return (
      <StorybookComponent2 width={1200} height={600} title={'Default'} showComponentBorders>
        <WindowsManager>
          {/* <WindowActions /> */}
          <Windows onCreateNewWindowFromState={handleCreateNewWindow}>
            <Window id="1" title={'This is my title'} minHeight={200} />
            <Window id="2" title={'This is my dialog'} initialPosition={'center'} />
          </Windows>
        </WindowsManager>
      </StorybookComponent2>
    );
  },
};

// import { useBound } from '../../hooks';
// import { createStories, StorybookComponent } from '../../Storybook';
// import { Button } from '../Button';
// import { createComponent } from '../Component';
// import { useWindows } from './useWindows';
// import { Window } from './Window';
// import { Flex } from '../Flex';
// import { WindowState } from './WindowsModels';
// import { Windows } from './Windows';
// import { createStyles } from '../../theme';
// import { WindowsManager } from './WindowsManager';

// const useStyles = createStyles({
//   new: {
//     flex: 'auto',
//     boxSizing: 'border-box',
//   },
// });

// const WindowActions = createComponent('WindowActions', () => {
//   const { closeWindow, openWindow, addWindow } = useWindows();

//   const handleCloseWindow = useBound(() => {
//     closeWindow('3');
//     closeWindow('4');
//   });

//   const handleOpenWindow = useBound(() => {
//     openWindow({ id: '3' });
//   });

//   const handleAddWindow = useBound(() => {
//     addWindow(<Window id="4" title="This is my new window" />);
//   });

//   return (
//     <Flex fixedSize>
//       <Button onClick={handleCloseWindow}>Close Window</Button>
//       <Button onClick={handleOpenWindow}>Open Window</Button>
//       <Button onClick={handleAddWindow}>Add Window</Button>
//     </Flex>
//   );
// });

// interface Props {
//   onSaveState?(windowStates: WindowState[]): void;
// }

// createStories<Props>(({ createStory }) => ({
//   name: 'Components/Windows',
//   module,
//   props: {
//     onSaveState: { action: 'onSaveState' },
//   },
//   stories: {
//     'Default': createStory({
//       wrapInStorybookComponent: false,
//       component: () => {
//         const { css } = useStyles();

//         const handleCreateNewWindow = useBound((data: WindowState) => (
//           <Window id={data.id} title={'This is my new window'} />
//         ));

//         return (
//           <StorybookComponent width={'100%'} height={550} title={'Default'} className={css.new} isVertical>
//             <WindowsManager>
//               <WindowActions />
//               <Windows onCreateNewWindowFromState={handleCreateNewWindow}>
//                 <Window id="1" title={'This is my title'} minHeight={200} />
//                 <Window id="2" title={'This is my dialog'} initialPosition={'center'} />
//               </Windows>
//             </WindowsManager>
//           </StorybookComponent>
//         );
//       },
//     }),
//   },
// }));