import type { ReactNode } from 'react';
import { createComponent } from '../Component';
import { Tooltip } from '../Tooltip';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { Icon } from '../Icon';

const useStyles = createStyles({
  configuratorAddButton: {
    marginRight: 8,
  },
});

interface Props {
  addTooltip?: ReactNode;
  onAdd(): void;
}

export const ConfiguratorAddButton = createComponent('ConfiguratorAddButton', ({
  addTooltip,
  onAdd,
}: Props) => {
  const { css } = useStyles();

  return (
    <Tooltip content={addTooltip}>
      <Button variant="hover" iconOnly className={css.configuratorAddButton} onClick={onAdd}>
        <Icon name="add" />
      </Button>
    </Tooltip>
  );
});