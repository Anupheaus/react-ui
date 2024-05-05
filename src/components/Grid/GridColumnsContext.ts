import { createContext } from 'react';
import { GridColumn } from './GridModels';

export const GridColumnsContext = createContext<GridColumn[]>([]);