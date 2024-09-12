import { Logger } from '@anupheaus/common';
import { createContext } from 'react';

export const LoggerContext = createContext<Logger | undefined>(undefined);
