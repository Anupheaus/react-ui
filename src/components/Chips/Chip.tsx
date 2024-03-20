import { useBound } from '../../hooks';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';

const useStyles = createStyles(({ chips: { chip }, pseudoClasses }, tools) => ({
  chip: {
    backgroundColor: chip.normal.backgroundColor,
    borderRadius: chip.normal.borderRadius,
    color: chip.normal.textColor,
    fontSize: chip.normal.textSize,
    fontWeight: chip.normal.textWeight,
    padding: chip.normal.padding,
    userSelect: 'none',
    cursor: 'pointer',
    ...tools.applyTransition('background-color'),

    [pseudoClasses.active]: {
      backgroundColor: chip.active.backgroundColor ?? chip.normal.backgroundColor,
      borderRadius: chip.active.borderRadius ?? chip.normal.borderRadius,
      color: chip.active.textColor ?? chip.normal.textColor,
      fontSize: chip.active.textSize ?? chip.normal.textSize,
      fontWeight: chip.active.textWeight ?? chip.normal.textWeight,
      padding: chip.active.padding ?? chip.normal.padding,
    },
  },
}));

interface Props {
  className?: string;
  id: string;
  value: ReactListItem | undefined;
  onDelete?(id: string): void;
}

export const Chip = createComponent('Chip', ({
  className,
  id,
  value,
  onDelete,
}: Props) => {
  const { css, join } = useStyles();

  const handleDelete = useBound(() => {
    onDelete?.(id);
  });

  return (
    <Flex tagName="chip" className={join(css.chip, className)} gap={6} valign="center" disableGrow>
      <span>{ReactListItem.render(value)}</span>
      {onDelete && (
        <Button variant="hover" size="small" iconOnly onSelect={handleDelete}><Icon name="chip-delete" size={16} /></Button>
      )}
    </Flex>
  );
});