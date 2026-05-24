import { useLocale } from '../../providers';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { PromiseMaybe } from '@anupheaus/common';
import type { ReactNode } from 'react';
import { to } from '@anupheaus/common';
import { Skeleton } from '../Skeleton';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useBound } from '../../hooks';
import { resolveTableTheme } from './resolveTableTheme';

const useStyles = createStyles((theme) => {
  const { error } = theme;
  const { toolbar: { normal: toolbar } } = theme;
  const { footerBackgroundColor } = resolveTableTheme(theme);

  return {
    footer: {
      flex: 'none',
      userSelect: 'none',
      ...toolbar,
      backgroundColor: footerBackgroundColor,
      boxShadow: 'none',
    },
    error: {
      color: error.color,
    },
  };
});

interface Props {
  totalRecords?: number;
  unitName: string;
  error?: Error;
  summary?: ReactNode;
  hideRecordCount?: boolean;
  onAdd?(): PromiseMaybe<void>;
  addLabel?: string;
}

export const TableFooter = createComponent('TableFooter', ({
  totalRecords,
  unitName,
  error,
  summary,
  hideRecordCount = false,
  onAdd,
  addLabel,
}: Props) => {
  const { css } = useStyles();
  const { formatNumber } = useLocale();

  const handleAdd = useBound(() => onAdd?.());

  return (
    <Flex tagName="table-footer" className={css.footer} valign="center" wide>

      {/* add button */}
      {onAdd != null && (
        <Button variant="hover" onSelect={handleAdd} size="small" aria-label={addLabel ?? 'Add'}>
          <Icon name="add" size="small" />
          {addLabel}
        </Button>
      )}

      {/* error */}
      {error != null && (
        <Flex tagName="table-footer-error" tooltip={error.message} className={css.error} gap={8} valign="center" disableGrow>
          <Icon name="error" />
          Error loading data
        </Flex>
      )}

      {/* spacer */}
      <Flex tagName="table-footer-spacer" />

      {/* summary */}
      {summary != null && (
        <Flex tagName="table-footer-summary" disableGrow valign="center">
          {summary}
        </Flex>
      )}

      {/* total records */}
      {!hideRecordCount && (
        <Flex tagName="table-footer-total-records" disableGrow valign="center">
          <Skeleton type="text">{formatNumber(totalRecords ?? 100)}</Skeleton>&nbsp;
          <Skeleton type="text">{to.plural(unitName, totalRecords ?? 100)}</Skeleton>
        </Flex>
      )}

    </Flex>
  );
});
