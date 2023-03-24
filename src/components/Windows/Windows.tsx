import { AnyObject, is } from '@anupheaus/common';
import { Fragment, ReactNode, useContext, useMemo, useRef, useState } from 'react';
import { useBound } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { WindowsActionsContext, WindowsContext, WindowsContextProps } from './WindowsContexts';
import { WindowState } from './WindowsModels';

export const WindowsProviderId = '37dd6e84-1826-4694-8eaa-402492232672';

const useStyles = createStyles({
  windows: {

  },
});

interface Props {
  className?: string;
  children?: ReactNode;
  onStatesUpdated?(states: WindowState[]): void;
  onCreateNewWindow?(data: WindowState & AnyObject): ReactNode;
}

export const Windows = createComponent('Windows', ({
  className,
  children = null,
  onStatesUpdated,
  onCreateNewWindow,
}: Props) => {
  const { css, join } = useStyles();
  const { invoke, onAction } = useContext(WindowsActionsContext);
  const extraChildren = useRef(new Map<string, ReactNode>()).current;
  const [extraChildrenId, setExtraChildrenId] = useState('');

  const context = useMemo<WindowsContextProps>(() => ({
    isValid: true,
    states: [],
  }), []);

  const updateWindowsOrdinalPositions = useBound(async () => {
    await Promise.all(context.states.map(({ id }, index, arr) => invoke(id, 'updateOrdinal', index + 1, index === arr.length - 1)));
  });

  onAction(WindowsProviderId, 'open', config => {
    const extraChild = onCreateNewWindow?.(config);
    if (!extraChild) return;
    extraChildren.set(config.id, extraChild);
    setExtraChildrenId(Math.uniqueId());
  });

  onAction('focus', async id => {
    const stateIndex = context.states.findIndex(x => x.id === id);
    if (stateIndex === -1 || stateIndex === context.states.length - 1) return;
    context.states = context.states.move(stateIndex, context.states.length - 1);
    await updateWindowsOrdinalPositions();
    onStatesUpdated?.(context.states);
  });

  onAction('updateState', async (_id, state) => {
    const newStates = context.states.upsert(state);
    if (is.deepEqual(newStates, context.states)) return;
    const shouldUpdateWindowsOrdinalPositions = newStates.length !== context.states.length;
    context.states = newStates;
    if (shouldUpdateWindowsOrdinalPositions) await updateWindowsOrdinalPositions();
    onStatesUpdated?.(context.states);
  });

  onAction('closed', async id => {
    context.states = context.states.removeById(id);
    const extraChildrenCountBefore = extraChildren.size;
    extraChildren.delete(id);
    await updateWindowsOrdinalPositions();
    onStatesUpdated?.(context.states);
    if (extraChildrenCountBefore !== extraChildren.size) setExtraChildrenId(Math.uniqueId());
  });

  const renderedExtraChildren = useMemo(() => Array.from(extraChildren.entries()).map(([id, content]) => (
    <Fragment key={id}>{content}</Fragment>
  )), [extraChildrenId]);

  return (
    <Flex tagName="windows" className={join(css.windows, className)}>
      <WindowsContext.Provider value={context}>
        {children}
        {renderedExtraChildren}
      </WindowsContext.Provider>
    </Flex>
  );
});
