import { createContext } from 'react';
import type { TableColumn } from './TableModels';

export const TableColumnsContext = createContext<TableColumn[]>([]);