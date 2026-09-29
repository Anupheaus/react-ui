import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useMemo } from 'react';
import { to } from '@anupheaus/common';
import type { PromiseMaybe } from '@anupheaus/common';
import { useLocale } from '../../providers';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Skeleton } from '../Skeleton';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { Badge } from '../Badge';
import { useDialog } from '../Dialog/useDialog';
import { useBound } from '../../hooks';
import { ListFilterDialog, type ListFilter } from './ListFilterDialog';

const useStyles = createStyles((theme) => {
  const { error } = theme;
  const { toolbar: { normal: toolbar } } = theme;

  return {
    footer: {
      flex: 'none',
      userSelect: 'none',
      ...toolbar,
      boxShadow: 'none',
    },
    errorContent: {
      color: error.color,
    },
    filter: {
      // Room for the active-count badge, which sits over the button's top-right corner, before the count.
      marginRight: 12,
    },
    filterButtonText: {
      whiteSpace: 'nowrap',
    },
    // With a badge, the button keeps the badge clear of the word "Filter".
    filterButtonWithBadge: {
      paddingRight: '14px !important',
    },
  };
});

export interface InternalListFooterProps {
  total?: number;
  unitName?: string;
  error?: Error;
  summary?: ReactNode;
  hideRecordCount?: boolean;
  /** Words after the record count — "12 tasks" + " assigned to you", "3 appointments" + " (1 cancelled)". */
  totalSuffix?: ReactNode;
  onAdd?(event: MouseEvent | KeyboardEvent): PromiseMaybe<void>;
  addLabel?: string;
  addTooltip?: ReactNode;
  /**
   * Filtering with fields the List/Table shows in its own dialog (Apply, Clear, Cancel). Shows the footer's Filter
   * button.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: ListFilter<any>;
  /** Called when the Filter button is pressed — for a screen that opens its own filter dialog. Shows the button. */
  onFilter?(): PromiseMaybe<void>;
  /** The number on the Filter button's badge; no badge at 0. Defaults to `filter.countActive(filter.value)`. */
  activeFilterCount?: number;
  /** The Filter button's tooltip; "Filter" when absent. */
  filterTooltip?: ReactNode;
  footerClassName?: string;
}

export const InternalListFooter = createComponent('InternalListFooter', ({
  total,
  unitName,
  error,
  summary,
  hideRecordCount = false,
  totalSuffix,
  onAdd,
  addLabel,
  addTooltip,
  filter,
  onFilter,
  activeFilterCount: providedActiveFilterCount,
  filterTooltip = 'Filter',
  footerClassName,
}: InternalListFooterProps) => {
  const { css, join } = useStyles();
  const { formatNumber } = useLocale();
  const { openListFilterDialog } = useDialog(ListFilterDialog);

  const handleAdd = useBound((event: MouseEvent | KeyboardEvent) => onAdd?.(event));

  const handleFilter = useBound(async () => {
    await onFilter?.();
    if (filter != null) await openListFilterDialog(filter);
  });

  const addButton = useMemo(() => {
    if (onAdd == null) return null;
    const button = (
      <Button variant="hover" onSelect={handleAdd} size="small" iconOnly={addLabel == null} aria-label={addLabel ?? 'Add'}>
        <Icon name="add" size="small" />
        {addLabel}
      </Button>
    );
    return addTooltip != null ? <Tooltip content={addTooltip}>{button}</Tooltip> : button;
  }, [onAdd, handleAdd, addLabel, addTooltip]);

  const activeFilterCount = providedActiveFilterCount ?? (filter?.countActive?.(filter.value) ?? 0);

  const filterButton = useMemo(() => {
    if (filter == null && onFilter == null) return null;
    return (
      <Flex tagName="internal-list-footer-filter" disableGrow valign="center" className={css.filter}>
        <Badge content={activeFilterCount > 0 ? activeFilterCount : undefined}>
          <Tooltip content={filterTooltip}>
            <Button variant="hover" size="small" onSelect={handleFilter} testId="list-filter-button" className={activeFilterCount > 0 ? css.filterButtonWithBadge : undefined}>
              <Icon name="list-filter" size="small" />
              <span className={css.filterButtonText}>Filter</span>
            </Button>
          </Tooltip>
        </Badge>
      </Flex>
    );
  }, [filter, onFilter, activeFilterCount, filterTooltip, handleFilter]);

  return (
    <Flex tagName="internal-list-footer" className={join(css.footer, footerClassName)} valign="center" wide>

      {addButton}

      {error != null && (
        <Flex tagName="internal-list-footer-error" tooltip={error.message} className={css.errorContent} gap={8} valign="center" disableGrow>
          <Icon name="error" />
          Error loading data
        </Flex>
      )}

      <Flex tagName="internal-list-footer-spacer" />

      {summary != null && (
        <Flex tagName="internal-list-footer-summary" disableGrow valign="center">
          {summary}
        </Flex>
      )}

      {filterButton}

      {!hideRecordCount && unitName != null && (
        <Flex tagName="internal-list-footer-total" disableGrow valign="center">
          <Skeleton type="text">{formatNumber(total ?? 100)}</Skeleton>&nbsp;
          <Skeleton type="text">{to.plural(unitName, total ?? 100)}</Skeleton>
          {totalSuffix != null && <>&nbsp;<Skeleton type="text">{totalSuffix}</Skeleton></>}
        </Flex>
      )}

    </Flex>
  );
});
