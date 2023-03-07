import { useBound } from '../../hooks';
import { createStories, StorybookComponent } from '../../Storybook';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { useWindowActions } from './useWindowActions';
import { Window } from './Window';
import { Flex } from '../Flex';
import { WindowState } from './WindowsModels';
import { Windows } from './Windows';
import { createStyles } from '../../theme';
import { WindowsActionsProvider } from './WindowsActionsProvider';

const useStyles = createStyles({
  new: {
    flex: 'auto',
    boxSizing: 'border-box',
  },
});

const WindowActions = createComponent('WindowActions', () => {
  const { closeWindow, addWindow } = useWindowActions();

  const handleCloseWindow = useBound(() => {
    closeWindow('2');
  });

  const handleAddWindow = useBound(() => {
    addWindow({ id: '3' });
  });

  return (
    <Flex fixedSize>
      <Button onClick={handleCloseWindow}>Close Window</Button>
      <Button onClick={handleAddWindow}>Add Window</Button>
    </Flex>
  );
});

interface Props {
  onSaveState?(windowStates: WindowState[]): void;
}

createStories<Props>(({ createStory }) => ({
  name: 'Components/Windows',
  module,
  props: {
    onSaveState: { action: 'onSaveState' },
  },
  stories: {
    'Default': createStory({
      wrapInStorybookComponent: false,
      component: () => {
        const { css } = useStyles();

        const handleCreateNewWindow = useBound((data: WindowState) => (
          <Window id={data.id} title={'This is my new window'} />
        ));
        return (
          <StorybookComponent width={'100%'} height={550} title={'Default'} className={css.new} isVertical>
            <WindowsActionsProvider>
              <WindowActions />
              <Windows onCreateNewWindow={handleCreateNewWindow}>
                <Window id="1" title={'This is my title'} minHeight={200} />
                <Window id="2" title={'This is my dialog'} initialPosition={'center'} />
              </Windows>
            </WindowsActionsProvider>
          </StorybookComponent>
        );
      },
    }),
  },
}));