import { AnyObject } from '@anupheaus/common';
import { createContext } from 'react';
import { AnuxFC } from '../anuxComponents';
import { AnuxPlaceholderComponent } from './createPlaceholders';

export interface AnuxPlaceholderContextProps {
  isValid: boolean;
  usePlaceholder(id: string, type: AnuxPlaceholderComponent, content: AnuxFC, props: AnyObject): void;
}

export const AnuxPlaceholderContext = createContext<AnuxPlaceholderContextProps>({
  isValid: false,
  usePlaceholder: () => void 0,
});