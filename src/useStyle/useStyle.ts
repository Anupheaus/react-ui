import { IMap } from 'anux-common';
import { useMemo } from 'react';

export function useStyle<T extends IMap>(style: T & React.CSSProperties): T & React.CSSProperties {
  return useMemo(() => style, [style]);
}
