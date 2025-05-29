// import { useGridApiRef } from '@mui/x-data-grid-premium';
// import type { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
// import type { MutableRefObject } from 'react';
// import { useEffect, useRef } from 'react';

// function updateShadowClasses(gridRef: React.RefObject<HTMLDivElement>, apiRef: MutableRefObject<GridApiPremium>) {
//   if (!gridRef.current || !apiRef.current) return;

//   const left = apiRef.current.getScrollPosition().left;
//   gridRef.current.classList.toggle('hasScrollToLeft', left > 0);

//   const { hasScrollX, rowWidth, root: { width } } = apiRef.current.getRootDimensions();
//   gridRef.current.classList.toggle('hasScrollToRight', hasScrollX && rowWidth - width > left);
// }

// export function useGridShadowsOnScroll() {
//   const apiRef = useGridApiRef();
//   const gridRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const subscription1 = apiRef.current.subscribeEvent('scrollPositionChange', () => updateShadowClasses(gridRef, apiRef));
//     const subscription2 = apiRef.current.subscribeEvent('columnResize', () => updateShadowClasses(gridRef, apiRef));
//     const subscription3 = apiRef.current.subscribeEvent('columnResizeStop', () => updateShadowClasses(gridRef, apiRef));

//     return () => {
//       subscription1();
//       subscription2();
//       subscription3();
//     };
//   }, [apiRef, gridRef]);

//   return {
//     gridRef,
//     apiRef,
//   };
// }