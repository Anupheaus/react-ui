import { AnyObject, is } from '@anupheaus/common';
import { Fragment, ReactNode, useContext, useMemo, useRef, useState } from 'react';
import { useBound } from '../../hooks';
import { createStyles2 } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { WindowsManagerContext, WindowsContext, WindowsContextProps, WindowIdContext, WindowsManagerIdContext } from './WindowsContexts';
import { WindowState } from './WindowsModels';

const useStyles = createStyles2({
  windows: {

  },
});

interface Props {
  managerId?: string;
  className?: string;
  children?: ReactNode;
  onStatesUpdated?(states: WindowState[]): void;
  onCreateNewWindowFromState?(data: WindowState & AnyObject): ReactNode;
}

export const Windows = createComponent('Windows', ({
  managerId: providedManagerId,
  className,
  children = null,
  onStatesUpdated,
  onCreateNewWindowFromState,
}: Props) => {
  const { css, join } = useStyles();
  const managerContexts = useContext(WindowsManagerContext);
  const { id: managerId, invoke, onAction } = (providedManagerId ? managerContexts.get(providedManagerId) : Array.from(managerContexts.values()).last()) ?? {};
  if (managerId == null || invoke == null || onAction == null) {
    if (providedManagerId) throw new Error(`A WindowsManager component with id "${providedManagerId}" was not found.`);
    throw new Error('Windows component must be a child of a WindowsManager component.');
  }
  const extraChildren = useRef(new Map<string, ReactNode>()).current;
  const extraChildrenLinkedIds = useRef(new Map<string, string>()).current;
  const [extraChildrenId, setExtraChildrenId] = useState('');

  const context = useMemo<WindowsContextProps>(() => ({
    isValid: true,
    states: [],
  }), []);

  const updateWindowsOrdinalPositions = useBound(async () => {
    await Promise.all(context.states.map(({ id }, index, arr) => invoke(id, 'updateOrdinal', index + 1, index === arr.length - 1)));
  });

  onAction(managerId, 'open', config => {
    const extraChild = onCreateNewWindowFromState?.(config);
    if (extraChild === undefined)
      throw new Error('A window was requested to be opened from state, but no "onCreateNewWindowFromState" property was provided or it did not provide a valid window.');
    extraChildren.set(config.id, extraChild);
    setExtraChildrenId(Math.uniqueId());
  });

  onAction(managerId, 'add', (id, content) => {
    if (content == null) {
      extraChildren.delete(id);
    } else {
      extraChildren.set(id, (
        <WindowIdContext.Provider value={id}>
          {content}
        </WindowIdContext.Provider>
      ));
    }
    setExtraChildrenId(Math.uniqueId());
  });

  onAction('focus', async id => {
    const stateIndex = context.states.findIndex(x => x.id === id);
    if (stateIndex === -1 || stateIndex === context.states.length - 1) return;
    context.states = context.states.move(stateIndex, context.states.length - 1);
    await updateWindowsOrdinalPositions();
    onStatesUpdated?.(context.states);
  });

  onAction('link', (targetId, id, windowId) => { extraChildrenLinkedIds.set(id, windowId); });

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
    const extraChildId = extraChildrenLinkedIds.get(id) ?? id;
    extraChildren.delete(extraChildId);
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
        <WindowsManagerIdContext.Provider value={managerId}>
          {children}
          {renderedExtraChildren}
        </WindowsManagerIdContext.Provider>
      </WindowsContext.Provider>
    </Flex>
  );
});
