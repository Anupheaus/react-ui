import { useMemo, type ReactNode } from 'react';
import { createComponent } from '../Component';
import { FaderContext, type FaderContextProps } from './FaderContext';
import { useBound, useMap, useSyncState } from '../../hooks';
import { FadingOut } from './FadingOut';

interface FadeData {
  id: string;
  element: HTMLElement;
  content: string;
}

interface Props {
  duration?: number;
  children?: ReactNode;
}

export const FaderProvider = createComponent('FaderProvider', ({
  duration = 1000,
  children,
}: Props) => {
  const fadeData = useMap<string, FadeData>();
  const { state: fadingOutData, setState: setFadingOutData } = useSyncState<FadeData[]>(() => []);

  const context = useMemo<FaderContextProps>(() => ({
    isValid: true,
    duration,
    updateFadeData: (id, element) => {
      if (element.parentElement == null) throw new Error('Fader element must have a parent');
      fadeData.set(id, { id, element: element.parentElement, content: element.innerHTML });
    },
    fadeOut: id => {
      const data = fadeData.get(id);
      if (data == null) return;
      fadeData.delete(id);
      setFadingOutData(v => {
        if (v.findById(id) != null) return v;
        return [...v, data];
      });
    },
  }), [duration]);

  const onCompleted = useBound((id: string) => { setFadingOutData(v => v.removeById(id)); });

  const fadingOutChildren = useMemo(() => fadingOutData.map(data => (<FadingOut key={data.id} {...data} duration={duration} onCompleted={onCompleted} />)), [fadingOutData, duration]);

  return (
    <FaderContext.Provider value={context}>
      {children}
      {fadingOutChildren}
    </FaderContext.Provider>
  );
});
