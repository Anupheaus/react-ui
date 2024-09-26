// import { createComponent } from '../Component';
// import { useContext } from 'react';
// import { WindowManagerIdContext } from './WindowsContexts';
// import type { WindowDefinition } from './WindowsModels';
// import { WindowsManager } from './WindowsManager';
// import { useOnUnmount } from '../../hooks';

// interface Props<Args extends unknown[]> {
//   name: string;
//   definition: WindowDefinition<Args>;
// }

// export const WindowDefinitionRegister = createComponent('WindowDefinitionRegister', <Args extends unknown[]>({
//   name,
//   definition,
// }: Props<Args>) => {
//   const contextManagerId = useContext(WindowManagerIdContext);
//   const manager = WindowsManager.get(contextManagerId);

//   manager.registerDefinition(name, definition);

//   useOnUnmount(() => {
//     manager.unregisterDefinition(name);
//   });

//   return null;
// });