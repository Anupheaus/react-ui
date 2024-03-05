import { createContext } from 'react';
import { LocaleSettings } from './LocaleModels';

export interface LocaleContextProps {
  settings: LocaleSettings;
  onChange?(settings: LocaleSettings): void;
}

export const LocaleContext = createContext<LocaleContextProps>({
  settings: {
    locale: 'en-US',
    currency: 'USD',
  },
});