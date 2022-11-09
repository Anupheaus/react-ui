import { useContext, useRef, useState } from 'react';
import { createComponent } from '../components/Component';
import { StorybookContext } from './StorybookContext';

interface Props {
  hook(renderCount: number): void;
}

const StorybookHookExecutor = createComponent({
  id: 'StorybookHookExecutor',

  render({
    hook,
  }: Props) {
    const renderCount = useRef(0);
    renderCount.current += 1;
    hook(renderCount.current);
    return (
      <p>{renderCount.current} Render{renderCount.current === 1 ? '' : 's'}</p>
    );
  },
});

export const StorybookHookProfiler = createComponent({
  id: 'StorybookHookProfiler',

  render() {
    const { registerHookExecutor } = useContext(StorybookContext);
    const [delegate, setDelegate] = useState<(renderCount: number) => void>();
    const hasRegisteredExecutorRef = useRef(false);

    if (!hasRegisteredExecutorRef.current) {
      hasRegisteredExecutorRef.current = true;
      registerHookExecutor(del => setDelegate(() => del));
    }

    return (<>
      {delegate && <StorybookHookExecutor hook={delegate} />}
    </>);
  },
});
