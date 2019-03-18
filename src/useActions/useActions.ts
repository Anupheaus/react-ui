import { useRef, useEffect } from 'react';
import { IMap } from 'anux-common';

interface IProxy {
  originalFunc: Function;
  stubFunc: Function;
}

export function useActions<TActions extends {}>(actions: TActions): TActions {
  const proxiesRef = useRef<IMap<IProxy>>({});
  const proxies = { ...proxiesRef.current };
  let allProxyKeys = Reflect.ownKeys(proxies) as string[];
  const proxiedActions = {} as TActions;

  useEffect(() => () => { // on unmount
    proxiesRef.current = {}; // no memory leaks
  }, []);

  Reflect.ownKeys(actions).forEach((key: string) => {
    allProxyKeys = allProxyKeys.remove(key);
    let proxy = proxies[key];
    if (!proxy) {
      proxy = { stubFunc: (...args: any[]): any => proxy.originalFunc(...args), originalFunc: undefined };
      proxies[key] = proxy;
    }
    proxy.originalFunc = actions[key];
    proxiedActions[key] = proxy.stubFunc;
  });

  allProxyKeys.forEach(key => { delete proxies[key]; });
  proxiesRef.current = proxies;
  return proxiedActions;
}
