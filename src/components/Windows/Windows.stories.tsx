import type { Meta, StoryObj } from '@storybook/react';
import { Windows } from './Windows';
import { StorybookComponent } from '../../Storybook';
import { useBound, useDelegatedBound } from '../../hooks';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { AnyFunction, PromiseMaybe } from '@anupheaus/common';
import { Button } from '../Button';
import { createWindow } from './createWindow';
import { useWindow } from './useWindow';
import { useLayoutEffect } from 'react';

const meta: Meta<typeof Windows> = {
  component: null as unknown as typeof Windows,
};
export default meta;

type Story = StoryObj<typeof Windows>;

const WindowType1 = createWindow('WindowType1', ({ Window, Content, id }) => () => {
  const onFocus = useDelegatedBound((isFocused: boolean) => {
    // eslint-disable-next-line no-console
    console.log(`Window "${id}" is focused: ${isFocused}`);
  });

  const onClosing = useBound((reason?: string) => {
    // eslint-disable-next-line no-console
    console.log(`Window "${id}" is closing because: ${reason}`);
  });

  const onClose = useBound((reason?: string) => {
    // eslint-disable-next-line no-console
    console.log(`Window "${id}" has closed because: ${reason}`);
  });

  return (
    <Window title={`Window Type 1 with id ${id}`} onFocus={onFocus} onClosing={onClosing} onClosed={onClose}>
      <Content>
        This is window type 1
      </Content>
    </Window>
  );
});

const WindowType2 = createWindow('WindowType2', ({ Window, Content, id }) => () => {
  const onFocus = useBound((isFocused: boolean) => {
    // eslint-disable-next-line no-console
    console.log(`Window "${id}" is focused: ${isFocused}`);
  });

  const onClosing = useBound((reason?: string) => {
    // eslint-disable-next-line no-console
    console.log(`Window "${id}" is closing because: ${reason}`);
  });

  const onClose = useBound((reason?: string) => {
    // eslint-disable-next-line no-console
    console.log(`Window "${id}" has closed because: ${reason}`);
  });

  return (
    <Window title={`Window Type 2 with id ${id}`} onFocus={onFocus} onClosing={onClosing} onClosed={onClose}>
      <Content>
        This is window type 2
      </Content>
    </Window>
  );
});

const WindowActions = createComponent('WindowActions', () => {
  const { openWindowType1, closeWindowType1, focusWindowType1, restoreWindowType1, maximizeWindowType1 } = useWindow(WindowType1, 'abc');
  const { openWindowType2, closeWindowType2, focusWindowType2, restoreWindowType2, maximizeWindowType2 } = useWindow(WindowType2);
  // const { openWindow, focusWindow, closeWindow, maximizeWindow, restoreWindow } = useWindows();

  const performTest = async (action: string, fn: () => PromiseMaybe<void>) => {
    const startTime = Date.now();
    await fn();
    // eslint-disable-next-line no-console
    console.log(`${action} took ${Date.now() - startTime}ms`);
  };

  const handleWindowAction = useDelegatedBound((name: string, fn: AnyFunction, id?: string) => () => performTest(name, () => fn(id)));

  return (
    <Flex gap={4} disableGrow valign="top" enableWrap>
      <Button onClick={handleWindowAction('open', openWindowType1)}>Open Type 1</Button>
      <Button onClick={handleWindowAction('focus', focusWindowType1)}>Focus Type 1</Button>
      <Button onClick={handleWindowAction('restore', restoreWindowType1)}>Restore Type 1</Button>
      <Button onClick={handleWindowAction('maximize', maximizeWindowType1)}>Maximize Type 1</Button>
      <Button onClick={handleWindowAction('close', () => closeWindowType1('custom'))}>Close Type 1</Button>
      <Button onClick={handleWindowAction('open', openWindowType2, 'def')}>Open Type 2.1</Button>
      <Button onClick={handleWindowAction('focus', focusWindowType2, 'def')}>Focus Type 2.1</Button>
      <Button onClick={handleWindowAction('restore', restoreWindowType2, 'def')}>Restore Type 2.1</Button>
      <Button onClick={handleWindowAction('maximize', maximizeWindowType2, 'def')}>Maximize Type 2.1</Button>
      <Button onClick={handleWindowAction('close', id => closeWindowType2(id, 'custom 2'), 'def')}>Close Type 2.1</Button>
      <Button onClick={handleWindowAction('open', openWindowType2, 'ghi')}>Open Type 2.2</Button>
      <Button onClick={handleWindowAction('focus', focusWindowType2, 'ghi')}>Focus Type 2.2</Button>
      <Button onClick={handleWindowAction('restore', restoreWindowType2, 'ghi')}>Restore Type 2.2</Button>
      <Button onClick={handleWindowAction('maximize', maximizeWindowType2, 'ghi')}>Maximize Type 2.2</Button>
      <Button onClick={handleWindowAction('close', id => closeWindowType2(id, 'custom 2.2'), 'ghi')}>Close Type 2.2</Button>
    </Flex>
  );
});

export const Default: Story = {
  render() {
    const { openWindowType1 } = useWindow(WindowType1);

    useLayoutEffect(() => {
      openWindowType1('hurry');
    }, []);

    return (
      <StorybookComponent width={1200} height={600} title={'Default'} showComponentBorders>
        <Flex isVertical>
          <WindowActions />
          <Windows /*localStorageKey="windows"*/>
            <WindowType1 />
            <WindowType2 />
          </Windows>
        </Flex>
      </StorybookComponent>
    );
  },
};
