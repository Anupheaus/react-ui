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
import { useBound } from '../../hooks';

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
  };
});

export interface InternalListFooterProps {
  total?: number;
  unitName?: string;
  error?: Error;
  summary?: ReactNode;
  hideRecordCount?: boolean;
  onAdd?(event: MouseEvent | KeyboardEvent): PromiseMaybe<void>;
  addLabel?: string;
  addTooltip?: ReactNode;
  footerClassName?: string;
  /** Tag name used for the footer container element. Defaults to `internal-list-footer`. */
  tagName?: string;
}

export const InternalListFooter = createComponent('InternalListFooter', ({
  total,
  unitName,
  error,
  summary,
  hideRecordCount = false,
  onAdd,
  addLabel,
  addTooltip,
  footerClassName,
  tagName = 'internal-list-footer',
}: InternalListFooterProps) => {
  const { css, join } = useStyles();
  const { formatNumber } = useLocale();

  const handleAdd = useBound((event: MouseEvent | KeyboardEvent) => onAdd?.(event));

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

  return (
    <Flex tagName={tagName} className={join(css.footer, footerClassName)} valign="center" wide>

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

      {!hideRecordCount && unitName != null && (
        <Flex tagName="internal-list-footer-total" disableGrow valign="center">
          <Skeleton type="text">{formatNumber(total ?? 100)}</Skeleton>&nbsp;
          <Skeleton type="text">{to.plural(unitName, total ?? 100)}</Skeleton>
        </Flex>
      )}

    </Flex>
  );
});
