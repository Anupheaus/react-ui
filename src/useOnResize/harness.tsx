import { createHarness } from 'anux-package';
import { useState, ChangeEvent, ReactNode } from 'react';
import { ISize } from 'anux-common';
import { Switch, Button } from '@material-ui/core';
import { useOnResize } from './useOnResize';
import { useBound } from '../useBound';
import './harness.scss';

interface IState {
  isDisabled: boolean;
  full: ISize;
  prevFull: ISize;
  visible: ISize;
  prevVisible: ISize;
  content: ReactNode[];
}

export const onResizeHarness = createHarness({ name: 'useOnResize' }, () => {
  const [state, setState] = useState<IState>({
    isDisabled: false,
    full: { width: 0, height: 0 },
    prevFull: { width: 0, height: 0 },
    visible: { width: 0, height: 0 },
    prevVisible: { width: 0, height: 0 },
    content: [],
  });

  const resizeTarget = useOnResize({
    isDisabled: state.isDisabled,
    onFull(full, prevFull) {
      setState(s => ({ ...s, full, prevFull }));
    },
    onVisible(visible, prevVisible) {
      setState(s => ({ ...s, visible, prevVisible }));
    },
  });

  const handleChangeDisabledFlag = useBound((event: ChangeEvent) => setState(s => ({ ...s, isDisabled: event.target['checked'] })));

  const addContentToTarget = useBound(() => {
    setState(s => ({
      ...s,
      content: s.content.concat((<div key={`block-${s.content.length}`} className="block"></div>)),
    }));
  });

  return (
    <>
      <div id="resize-container">
        <div id="resize-target" ref={resizeTarget}>
          {state.content}
        </div>
      </div>
      <div id="resize-report">
        <span><span>isDisabled:</span><span><Switch checked={state.isDisabled} onChange={handleChangeDisabledFlag} /></span></span>
        <span><span>full:</span><span>{`{ width: ${state.full.width}px, height: ${state.full.height}px }`}</span></span>
        <span><span>visible:</span><span>{`{ width: ${state.visible.width}px, height: ${state.visible.height}px }`}</span></span>
        <span><span>previous full:</span><span>{`{ width: ${state.prevFull.width}px, height: ${state.prevFull.height}px }`}</span></span>
        <span><span>previous visible:</span><span>{`{ width: ${state.prevVisible.width}px, height: ${state.prevVisible.height}px }`}</span></span>
        <span><Button onClick={addContentToTarget}>Add Content</Button></span>
      </div>
    </>
  );
});
