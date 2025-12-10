import { Flex } from '../Flex';
import { createComponent } from '../Component';
import type { MatrixCell } from './MatrixModels';
import { useMemo } from 'react';
import { is } from '@anupheaus/common';

export interface MatrixCellRendererProps<T> {
  value: MatrixCell<T>;
  onChange(value: MatrixCell<T>): void;
}

export const MatrixCellRenderer = createComponent('MatrixCellRenderer', function <T = unknown>({
  value,
}: MatrixCellRendererProps<T>) {

  const content = useMemo(() => {
    const actualValue = value.value;
    if (is.string(actualValue) || is.number(actualValue)) return actualValue.toString();
    if (is.boolean(actualValue)) return actualValue.toString();
    if (is.date(actualValue)) return actualValue.toISOString();
    return null;
  }, [value.value]);

  return (
    <Flex tagName="matrix-cell">
      {content}
    </Flex>
  );
});