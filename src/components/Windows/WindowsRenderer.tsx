import { ReactNode, useContext, useMemo, useRef, useState } from 'react';
import { useBound, useDebounce } from '../../hooks';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Tag } from '../Tag';
import { WindowRenderer } from './WindowRenderer';
import { WindowsContexts, WindowsContextsRegisterWindow } from './WindowsContexts';
import { WindowState } from './WindowsModels';

interface WindowEntry {
  id: string;
  content: ReactNode;
}

export const WindowsRenderer = createComponent({
  id: 'WindowsRenderer',

  styles: () => ({
    styles: {
      renderer: {
        '& > window:not(:last-child)': {
          filter: 'blur(1.5px)',
        },
      },
      hidden: {
        display: 'none',
      },
    },
  }),

  render(props, { css }) {
    const rawWindows = useContext(WindowsContexts.windows);
    const updateWindowStates = useContext(WindowsContexts.stateUpdates);
    const initialStates = useContext(WindowsContexts.initialStates);
    const windowStates = useRef<Map<string, WindowState>>(new Map()).current;
    const [windows, setWindows] = useState<WindowEntry[]>([]);

    const invokeWindowStatesUpdate = useDebounce(() => {
      const newWindowStates = windows.map(({ id }) => windowStates.get(id)).removeNull();
      updateWindowStates(newWindowStates);
    }, 100);

    const registerWindow = useBound<WindowsContextsRegisterWindow>((windowProps, registerApi) => {
      const index = windows.length;
      const currentState: WindowState = {
        id: windowProps.id,
        x: index * 10,
        y: index * 10,
        isMaximized: windowProps.isMaximized ?? false,
        ...initialStates.findById(windowProps.id),
      };
      windowStates.set(windowProps.id, currentState);
      const handleClosed = () => {
        windowProps.onClosed?.();
        setWindows(currentWindows => currentWindows.removeById(windowProps.id));
      };
      const handleFocus = () => {
        setWindows(currentWindows => {
          const window = currentWindows.findById(windowProps.id);
          if (window == null) return currentWindows;
          return [...currentWindows.removeById(windowProps.id), window];
        });
        windowProps.onFocus?.();
      };
      setWindows(prevRenderedWindows => [...prevRenderedWindows, {
        id: windowProps.id, content: (<WindowRenderer
          key={windowProps.id}
          {...windowProps}
          onClosed={handleClosed}
          onFocus={handleFocus}
          registerApi={registerApi}
          initialState={currentState}
          onStateChange={newState => {
            windowStates.set(windowProps.id, newState);
            invokeWindowStatesUpdate();
          }}
        />)
      }]);
      invokeWindowStatesUpdate();
    });

    const renderedWindows = useMemo(() => windows.map(window => window.content), [windows]);

    return (
      <Flex tagName="windows-renderer" className={css.renderer}>
        <Tag name="windows-renderer-hidden" className={css.hidden}>
          <WindowsContexts.registerWindow.Provider value={registerWindow}>
            {rawWindows}
          </WindowsContexts.registerWindow.Provider>
        </Tag>
        {renderedWindows}
      </Flex>
    );
  },
});