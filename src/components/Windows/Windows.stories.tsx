import { useBound, useStorage } from '../../hooks';
import { createStories, StorybookComponent } from '../../Storybook';
import { Button } from '../Button';
import { WindowsRenderer } from './WindowsRenderer';
import { WindowsProvider } from './WindowsProvider';
import { createComponent } from '../Component';
import { useWindows } from './useWindows';
import { Window } from './Window';
import { Flex } from '../Flex';
import { WindowState } from './WindowsModels';
import { useRef } from 'react';

const WindowsController = createComponent('WindowsController', () => {
  const { addWindow } = useWindows();
  const windowCounterRef = useRef(0);

  const handleAddWindow = useBound(() => {
    windowCounterRef.current += 1;
    addWindow(
      <Window id={`window_${windowCounterRef.current}`} title="My Test Window">
        This is the content of the window.
      </Window>
    );
  });

  return (
    <Flex fixedSize>
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
      component: props => {
        const { state, setState } = useStorage<WindowState[]>('windows', { type: 'local', defaultValue: () => [] });

        const handleSaveState = useBound((updates: WindowState[]) => {
          setState(updates);
          props.onSaveState?.(updates);
        });

        return (
          <StorybookComponent width={1000} height={600} title={'Default'} isVertical>
            <WindowsProvider {...props} state={state} onSaveState={handleSaveState}>
              <WindowsController />
              <WindowsRenderer />
            </WindowsProvider>
          </StorybookComponent>
        );
      },
    }),
  },
}));