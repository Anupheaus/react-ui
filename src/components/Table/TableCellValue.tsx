import type { DataFilterValueTypes } from '@anupheaus/common';
import { is, to } from '@anupheaus/common';
import { createComponent } from '../Component';
import { useMemo } from 'react';
import { useLocale, useUIState } from '../../providers';
import { DateTime } from 'luxon';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { Skeleton } from '../Skeleton';
import { createStyles } from '../../theme';

const useStyles = createStyles({
  booleanLoadingSkeleton: {
    width: 16,
    height: 16,
  },
});

interface InvalidValueProps {
  value: unknown;
  type: DataFilterValueTypes;
}

const InvalidValue = createComponent('InvalidValue', ({ value, type }: InvalidValueProps) => {
  return (
    <Tooltip content={<><span>{JSON.stringify(value)}</span><span>{type}</span></>}>
      <Icon name="error" />
    </Tooltip>
  );
});

interface Props {
  rowIndex?: number;
  columnIndex?: number;
  record?: unknown;
  field?: string;
  type?: DataFilterValueTypes;
  value: unknown;
}

export const TableCellValue = createComponent('TableCellValue', function ({
  type,
  value,
}: Props) {
  const { css } = useStyles();
  const { formatDate, formatCurrency } = useLocale();
  const { isLoading } = useUIState();

  const content = useMemo(() => {
    switch (type) {
      case 'date':
        if (isLoading) return <Skeleton type="text" useRandomWidth />;
        if (value instanceof Date || DateTime.isDateTime(value) || is.isISODateString(value)) return formatDate(value);
        return <InvalidValue value={value} type={type} />;
      case 'boolean':
        if (isLoading) return <Skeleton type="circle" className={css.booleanLoadingSkeleton}>{'\u00A0'}</Skeleton>;
        return <Icon name={value === true ? 'tick' : 'cross'} />;
      case 'currency':
        if (isLoading) return <Skeleton type="text" useRandomWidth />;
        return formatCurrency(to.number(value));
      case 'number':
        if (isLoading) return <Skeleton type="text" useRandomWidth />;
        return value;
      default:
        if (isLoading) return <Skeleton type="text" useRandomWidth />;
        return value;
    }
  }, [value, type, isLoading, formatDate, formatCurrency, css.booleanLoadingSkeleton]);

  return (
    <>{content}</>
  );
});
