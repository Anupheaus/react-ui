import { useLocale } from '../../providers';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { PromiseMaybe, to } from '@anupheaus/common';
import { Skeleton } from '../Skeleton';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useBound } from '../../hooks';

const useStyles = createStyles(({ toolbar: { normal: toolbar }, error }) => ({
  footer: {
    flex: 'none',
    userSelect: 'none',
    ...toolbar,
  },
  error: {
    color: error.color,
  },
}));

interface Props {
  totalRecords?: number;
  unitName: string;
  error?: Error;
  onAdd?(): PromiseMaybe<void>;
}

export const GridFooter = createComponent('GridFooter', ({
  totalRecords,
  unitName,
  error,
  onAdd,
}: Props) => {
  const { css } = useStyles();
  const { formatNumber } = useLocale();

  const handleAdd = useBound(() => onAdd?.());

  return (
    <Flex tagName="grid-footer" className={css.footer} valign="center">

      {/* add button */}
      {onAdd != null && (
        <Button variant="hover" onSelect={handleAdd} size="small">
          <Icon name="add" size="small" />
        </Button>
      )}

      {/* error */}
      {error != null && (
        <Flex tagName="grid-footer-error" tooltip={error.message} className={css.error} gap={8} valign="center" disableGrow>
          <Icon name="error" />
          Error loading data
        </Flex>
      )}

      {/* spacer */}
      <Flex tagName="grid-footer-spacer" />

      {/* total records */}
      <Flex tagName="grid-footer-total-records" disableGrow valign="center">
        <Skeleton type="text">{formatNumber(totalRecords ?? 100)}</Skeleton>&nbsp;
        <Skeleton type="text">{to.plural(unitName, totalRecords ?? 100)}</Skeleton>
      </Flex>

    </Flex>
  );
});