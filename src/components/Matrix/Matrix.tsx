import type { ReactNode } from 'react';
import { Fragment, useMemo } from 'react';
import type { ReactUIComponent } from '../Component';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { MatrixCell, MatrixXYCategory } from './MatrixModels';
import type { MatrixXYCategoryRendererProps } from './DefaultMatrixXYCategoryRenderer';
import { MatrixXYCategoryRenderer } from './MatrixXYCategoryRenderer';
import type { MatrixCellRendererProps } from './MatrixCellRenderer';
import { MatrixCellRenderer } from './MatrixCellRenderer';
import type { PromiseMaybe } from '@anupheaus/common';
import { createStyles } from '../../theme';
import { Tag } from '../Tag';
import { useBound } from '../../hooks';
import { AssistiveLabel } from '../AssistiveLabel';
import { DefaultMatrixXYCategoryRenderer } from './DefaultMatrixXYCategoryRenderer';

// TODO: replace with function that allows for changing the width and height cell values
const emptyFunc = () => void 0;

const useStyles = createStyles(({ fields: { content: { normal: { borderColor } } } }) => ({
  matrixCells: {
    display: 'grid',
    gap: 8,
  },
  xCategoryLabel: {
    alignItems: 'center',
    gap: 8,
    '&::before': {
      content: '""',
      display: 'block',
      width: '100%',
      height: '1px',
      backgroundColor: borderColor,
    },
    '&::after': {
      content: '""',
      display: 'block',
      width: '100%',
      height: '1px',
      backgroundColor: borderColor,
    },
  },
  yCategoryLabel: {
    alignItems: 'center',
    gap: 8,
  },
  yCategoryLabelLine: {
    height: '100%',
    width: '1px',
    backgroundColor: borderColor,
  },
  yCategoryLabelContent: {
    transform: 'rotate(-90deg)',
    aspectRatio: '1/1',
    alignContent: 'center',
  },
}));

interface Props<T> {
  className?: string;
  xCategoriesLabel?: ReactNode;
  xCategories: MatrixXYCategory<T>[];
  CategoryRenderer?: ReactUIComponent<(props: MatrixXYCategoryRendererProps<T>) => JSX.Element>;
  yCategoriesLabel?: ReactNode;
  yCategories: MatrixXYCategory<T>[];
  cells: MatrixCell<T>[];
  CellRenderer?: ReactUIComponent<(props: MatrixCellRendererProps<T>) => JSX.Element>;
  error?: ReactNode | Error;
  onChange?(xCategories: MatrixXYCategory<T>[], yCategories: MatrixXYCategory<T>[], cells: MatrixCell<T>[]): PromiseMaybe<void>;
  onAddXCategoryAt?(index: number): void;
  onAddYCategoryAt?(index: number): void;
}

export const Matrix = createComponent('Matrix', function <T = unknown>({
  className,
  xCategoriesLabel,
  xCategories,
  CategoryRenderer = DefaultMatrixXYCategoryRenderer<T>,
  yCategoriesLabel,
  yCategories,
  cells,
  CellRenderer = MatrixCellRenderer<T>,
  error,
  onChange,
  onAddXCategoryAt,
  onAddYCategoryAt,
}: Props<T>) {
  const { css, useInlineStyle } = useStyles();
  const isSingleDimension = yCategories.length === 1 && yCategories[0].value === null;

  // const onChangeWidthDimension = useDelegatedBound((oldWidth?: number) => (newWidth?: number) => {
  //   // onChange(value.map(cell => cell.width === oldWidth ? { ...cell, width } : cell));
  // });

  // const onChangeHeightDimension = useDelegatedBound((oldHeight?: number) => (newHeight?: number) => {
  //   // onChange(value.map(cell => cell.height === oldHeight ? { ...cell, height } : cell));
  // });

  const onChangeCell = useBound((newCell: MatrixCell<T>) => {
    onChange?.(xCategories, yCategories, cells.repsert(newCell));
  });

  const onInsertXCategoryBefore = useBound((xCategory: MatrixXYCategory<T>) => onAddXCategoryAt?.(xCategories.indexOf(xCategory)));
  const onInsertXCategoryAfter = useBound((xCategory: MatrixXYCategory<T>) => onAddXCategoryAt?.(xCategories.indexOf(xCategory) + 1));

  const onInsertYCategoryBefore = useBound((yCategory: MatrixXYCategory<T>) => onAddYCategoryAt?.(yCategories.indexOf(yCategory)));
  const onInsertYCategoryAfter = useBound((yCategory: MatrixXYCategory<T>) => onAddYCategoryAt?.(yCategories.indexOf(yCategory) + 1));

  const renderedXCategories = useMemo(() => xCategories.map((xCategory, index) => (
    <MatrixXYCategoryRenderer
      key={xCategory.id}
      renderer={CategoryRenderer}
      value={xCategory}
      onChange={emptyFunc}
      location="x"
      isLast={index === xCategories.length - 1}
      onInsertBefore={onInsertXCategoryBefore}
      onInsertAfter={onInsertXCategoryAfter}
    />
  )), [xCategories]);

  const renderedCells = useMemo(() => {
    return yCategories.map((yCategory, index) => {
      const internalCells = xCategories.map(xCategory => {
        const cell = cells.find(item => item.xCategoryId === xCategory.id && item.yCategoryId === yCategory.id) ?? {
          id: `${xCategory.id}-${yCategory.id}`,
          xCategoryId: xCategory.id,
          yCategoryId: yCategory.id,
        } as MatrixCell<T>;
        return (
          <CellRenderer key={cell.id} value={cell} onChange={onChangeCell} />
        );
      });
      return (
        <Fragment key={yCategory.id}>
          {!isSingleDimension && <MatrixXYCategoryRenderer
            renderer={CategoryRenderer}
            value={yCategory}
            onChange={emptyFunc}
            location="y"
            isLast={index === yCategories.length - 1}
            onInsertBefore={onInsertYCategoryBefore}
            onInsertAfter={onInsertYCategoryAfter}
          />}
          {internalCells}
        </Fragment>
      );
    });
  }, [xCategories, yCategories, cells, isSingleDimension]);

  const style = useInlineStyle(() => ({
    gridTemplateColumns: `${yCategoriesLabel != null ? '20px' : ''} repeat(${xCategories.length + (isSingleDimension ? 0 : 1)}, 1fr)`,
    gridTemplateRows: `${xCategoriesLabel != null ? '20px' : ''} repeat(${yCategories.length + 1}, 1fr)`,
  }), [xCategories.length, yCategories.length]);

  const xCategoriesLabelStyle = useInlineStyle(() => ({
    gridColumnStart: (isSingleDimension ? 1 : 2) + (yCategoriesLabel != null ? 1 : 0),
    gridColumnEnd: xCategories.length + (isSingleDimension ? 1 : 2) + (yCategoriesLabel != null ? 1 : 0),
  }), [xCategories.length, yCategoriesLabel]);

  const yCategoriesLabelStyle = useInlineStyle(() => ({
    gridColumnStart: 1,
    gridColumnEnd: 1,
    gridRowStart: 2 + (xCategoriesLabel != null ? 1 : 0),
    gridRowEnd: yCategories.length + 2 + (xCategoriesLabel != null ? 1 : 0),
  }), [yCategories.length, xCategoriesLabel]);

  const cornerCellStyle = useInlineStyle(() => ({
    gridColumnStart: 1,
    gridColumnEnd: 2 + (xCategoriesLabel != null ? 1 : 0),
    gridRowStart: 1,
    gridRowEnd: 2 + (yCategoriesLabel != null ? 1 : 0),
  }), [yCategoriesLabel, xCategoriesLabel]);

  return (
    <Flex
      tagName="matrix"
      className={className}
      isVertical
    >
      <Flex
        tagName="matrix-cells"
        className={css.matrixCells}
        style={style}
      >
        {xCategoriesLabel != null && <Flex tagName="matrix-x-categories-label" className={css.xCategoryLabel} disableGrow style={xCategoriesLabelStyle}>{xCategoriesLabel}</Flex>}
        {yCategoriesLabel != null && !isSingleDimension && (
          <Flex tagName="matrix-y-categories-label" isVertical className={css.yCategoryLabel} disableGrow style={yCategoriesLabelStyle}>
            <Tag name="matrix-y-category-label-line" className={css.yCategoryLabelLine} />
            <Tag name="matrix-y-category-label-content" className={css.yCategoryLabelContent}>
              {yCategoriesLabel}
            </Tag>
            <Tag name="matrix-y-category-label-line" className={css.yCategoryLabelLine} />
          </Flex>
        )}
        {!isSingleDimension && <Flex tagName="matrix-corner-cell" style={cornerCellStyle}></Flex>}
        {renderedXCategories}
        {renderedCells}
      </Flex>
      <AssistiveLabel error={error} />
    </Flex>
  );
});