import { ISize } from 'anux-common';
import { useMemo, useRef } from 'react';
import { HTMLTargetDelegate, useDOMRef } from '../useDOMRef';
import { useForceUpdate } from '../useForceUpdate';
import { useOnUnmount } from '../useOnUnmount';

interface PartialConfig {

}

interface FullConfig extends PartialConfig {
  onResize(size: ISize): void;
}

const isFullConfig = (config: PartialConfig | FullConfig): config is FullConfig => 'onResize' in config;

export function useDimensions(config: PartialConfig): [Partial<ISize>, HTMLTargetDelegate];
export function useDimensions(config: FullConfig): HTMLTargetDelegate;
export function useDimensions(config: PartialConfig | FullConfig): [Partial<ISize>, HTMLTargetDelegate] | HTMLTargetDelegate {
  const size = useRef<Partial<ISize>>({ width: undefined, height: undefined });
  const forceUpdate = useForceUpdate();
  const resizeObserver = useMemo(() => new ResizeObserver(entries => {
    if (hasUnmounted.current) return;
    entries.forEach(entry => {
      size.current = { width: entry.contentBoxSize?.[0].inlineSize ?? entry.contentRect.width, height: entry.contentBoxSize?.[0].blockSize ?? entry.contentRect.height };
      if (isFullConfig(config)) config.onResize(size.current as ISize);
      else forceUpdate();
    });
  }), []);
  const hasUnmounted = useOnUnmount(() => resizeObserver.disconnect());
  const target = useDOMRef({
    connected: element => resizeObserver.observe(element),
    disconnected: element => resizeObserver.unobserve(element),
  });
  return isFullConfig(config) ? target : [size.current, target];
}