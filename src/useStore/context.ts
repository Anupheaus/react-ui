import { createContext } from 'react';
import { IMap } from 'anux-common';

export interface IStoreContext extends IMap<string> { }

export const StoreContext = createContext<IStoreContext>({});
