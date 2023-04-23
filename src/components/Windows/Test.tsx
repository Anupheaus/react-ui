import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useCallbacks } from '../../hooks';
import { createComponent } from '../Component';

export const Test = createComponent('Test', () => {
  const [state, setState] = useState(0);
  const renderCount = useRef(0);
  const invokeCount = useRef(0);
  const { invoke, registerOutOfRenderPhaseOnly } = useCallbacks();

  renderCount.current++;

  invoke();

  registerOutOfRenderPhaseOnly(() => {
    invokeCount.current++;
    if (invokeCount.current > 3000) return;
    console.log({ renderCount: renderCount.current, invokeCount: invokeCount.current });
    setState(s => s + 1);
  });

  registerOutOfRenderPhaseOnly(() => {
    invokeCount.current++;
    if (invokeCount.current > 3000) return;
    console.log({ renderCount: renderCount.current, invokeCount: invokeCount.current });
    setState(s => s + 1);
  });

  registerOutOfRenderPhaseOnly(() => {
    invokeCount.current++;
    if (invokeCount.current > 3000) return;
    console.log({ renderCount: renderCount.current, invokeCount: invokeCount.current });
    setState(s => s + 1);
  });

  (() => {
    setTimeout(() => {
      invoke();
    }, Math.round((Math.random() * 1000) / 100));
    setTimeout(() => {
      invoke();
    }, Math.round((Math.random() * 1000) / 100));
    setTimeout(() => {
      invoke();
    }, Math.round((Math.random() * 1000) / 100));
  })();

  return null;
});