import { Meta, StoryObj } from '@storybook/react';
import { Windows, Windows as WindowsType } from './Windows';
import { StorybookComponent } from '../../Storybook';
import { Window } from './Window/Window';
import { useBound, useDelegatedBound } from '../../hooks';
import { WindowState } from './WindowsModels';
import { createComponent } from '../Component';
import { useWindows } from './useWindows';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { useState } from 'react';
import { is } from '@anupheaus/common';
import { Button } from '../Button';

const meta: Meta<typeof WindowsType> = {
  component: WindowsType,
};
export default meta;

type Story = StoryObj<typeof WindowsType>;

const WindowActions = createComponent('WindowActions', () => {
  const { openWindow, focusWindow, closeWindow, maximizeWindow, restoreWindow } = useWindows();
  const [id, setId] = useState<string>('');

  const performTest = async (action: string, callback: () => Promise<void>) => {
    // eslint-disable-next-line no-alert
    if (is.empty(id)) { window.alert('Please enter an id'); return; }
    const startTime = Date.now();
    await callback();
    // eslint-disable-next-line no-console
    console.log(`${action} took ${Date.now() - startTime}ms`);
  };

  const handleOpenWindow = useDelegatedBound((type: string) => () => performTest('Open', () => openWindow({ id, type })));
  const handleFocusWindow = useBound(() => performTest('Focus', () => focusWindow(id)));
  const handleCloseWindow = useBound(() => performTest('Close', () => closeWindow(id)));
  const handleMaximiseWindow = useBound(() => performTest('Maximise', () => maximizeWindow(id)));
  const handleRestoreWindow = useBound(() => performTest('Restore', () => restoreWindow(id)));

  return (
    <Flex gap={4} disableGrow valign="top">
      <Text value={id} onChange={setId} width={200} />
      <Button onClick={handleOpenWindow('window_type_1')}>Open Window Type 1</Button>
      <Button onClick={handleOpenWindow('window_type_2')}>Open Window Type 2</Button>
      <Button onClick={handleOpenWindow('window_type_3')}>Open Window Maximised</Button>
      <Button onClick={handleFocusWindow}>Focus Window</Button>
      <Button onClick={handleCloseWindow}>Close Window</Button>
      <Button onClick={handleMaximiseWindow}>Maximise Window</Button>
      <Button onClick={handleRestoreWindow}>Restore Window</Button>
    </Flex>
  );
});

export const Default: Story = {
  render() {

    const handleOnFocus = useDelegatedBound((id: string) => (isFocused: boolean) => {
      // eslint-disable-next-line no-console
      console.log(`Window "${id}" is focused: ${isFocused}`);
    });

    const handleCreateNewWindow = useBound((data: WindowState) => {
      switch (data.type) {
        case 'window_type_1': return <Window title={`This is window type 1 with id ${data.id}`} initialPosition="center" onFocus={handleOnFocus(data.id)} />;
        case 'window_type_2': return <Window title={`This is window type 2 with id ${data.id}`} onFocus={handleOnFocus(data.id)} />;
        case 'window_type_3': return <Window title={`This is window type 3 with id ${data.id}`} isMaximized onFocus={handleOnFocus(data.id)} />;
      }
    });

    return (
      <StorybookComponent width={1200} height={600} title={'Default'} showComponentBorders>
        <Flex isVertical>
          <WindowActions />
          <Windows localStorageKey="windows" onCreate={handleCreateNewWindow} />
        </Flex>
      </StorybookComponent>
    );
  },
};
