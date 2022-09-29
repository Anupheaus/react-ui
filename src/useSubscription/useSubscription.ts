// import { Unsubscribe } from 'anux-common';
// import { useMemo, useRef } from 'react';
// import { useOnUnmount } from '../hooks/useOnUnmount';

// export function useSubscription(delegate: () => Unsubscribe, dependencies: unknown[] = []): void {
//   const unsubscribeRef = useRef<Unsubscribe>();

//   const unsubscribe = () => unsubscribeRef.current?.();
//   useOnUnmount(unsubscribe);

//   useMemo(() => {
//     unsubscribe();
//     unsubscribeRef.current = delegate();
//   }, dependencies);
// }