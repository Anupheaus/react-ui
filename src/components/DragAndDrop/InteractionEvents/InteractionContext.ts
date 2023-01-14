import { createContext } from 'react';

export const InteractionContext = createContext<(event: Event) => void>(() => void 0);
