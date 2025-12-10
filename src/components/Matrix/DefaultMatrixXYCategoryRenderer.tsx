import { useMemo } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { MatrixXYCategory } from './MatrixModels';
import { is } from '@anupheaus/common';

export interface MatrixXYCategoryRendererProps<T> {
  location: 'x' | 'y';
  value: MatrixXYCategory<T>;
  onChange(category: MatrixXYCategory<T>): void;
}


export const DefaultMatrixXYCategoryRenderer = createComponent('DefaultMatrixXYCategoryRenderer', function <T = unknown>({
  value,
}: MatrixXYCategoryRendererProps<T>) {

  const content = useMemo(() => {
    const actualValue = value.value;
    if (is.string(actualValue) || is.number(actualValue)) return actualValue.toString();
    if (is.boolean(actualValue)) return actualValue.toString();
    if (is.date(actualValue)) return actualValue.toISOString();
    return null;
  }, [value.value]);


  return (
    <Flex tagName="matrix-xy-category">
      {content}
    </Flex>
  );
});