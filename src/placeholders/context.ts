import { AnyObject } from 'anux-common';
import { createContext } from 'react';
import { AnuxFunctionComponent } from '../anuxComponents';
import { AnuxPlaceholderComponent } from './createPlaceholders';

export interface AnuxPlaceholderContextProps {
  isValid: boolean;
  usePlaceholder(id: string, type: AnuxPlaceholderComponent, content: AnuxFunctionComponent, props: AnyObject): void;
}

export const AnuxPlaceholderContext = createContext<AnuxPlaceholderContextProps>({
  isValid: false,
  usePlaceholder: () => void 0,
});