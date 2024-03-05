import { useLocale } from '../../providers';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { to } from '@anupheaus/common';
import { Skeleton } from '../Skeleton';
import { Button } from '../Button';
import { Icon } from '../Icon';

const useStyles = createStyles(({ toolbar: { normal: toolbar } }) => ({
  footer: {
    flex: 'none',
    userSelect: 'none',
    ...toolbar,
  },
  totalRecords: {

  },
}));

interface Props {
  totalRecords?: number;
  unitName: string;
  onAdd?(): void;
}

export const GridFooter = createComponent('GridFooter', ({
  totalRecords,
  unitName,
  onAdd,
}: Props) => {
  const { css } = useStyles();
  const { formatNumber } = useLocale();

  return (
    <Flex tagName="grid-footer" className={css.footer} valign="center">

      {/* add button */}
      {onAdd != null && (
        <Button variant="hover" onSelect={onAdd} size="small">
          <Icon name="add" size="small" />
        </Button>
      )}

      {/* spacer */}
      <Flex tagName="grid-footer-spacer" />

      {/* total records */}
      <Flex tagName="grid-footer-total-records" className={css.totalRecords} disableGrow valign="center">
        <Skeleton type="text">{formatNumber(totalRecords ?? 100)}</Skeleton>&nbsp;
        <Skeleton type="text">{to.plural(unitName, totalRecords ?? 100)}</Skeleton>
      </Flex>

    </Flex>
  );
});