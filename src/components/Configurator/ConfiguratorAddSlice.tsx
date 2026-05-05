import type { ReactNode } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { Tooltip } from '../Tooltip';

const useStyles = createStyles({
  configuratorAddSlice: {
    padding: '0 8px',
  },
});

interface Props {
  addSliceTooltip?: ReactNode;
  onAddSlice(): void;
}

export const ConfiguratorAddSlice = createComponent('ConfiguratorAddSlice', ({
  addSliceTooltip,
  onAddSlice,
}: Props) => {
  const { css } = useStyles();

  if (onAddSlice == null) return null;

  return (
    <Flex tagName="configurator-add-slice" className={css.configuratorAddSlice} disableGrow valign="center">
      <Tooltip content={addSliceTooltip}>
        <Button iconOnly onClick={onAddSlice}>
          <Icon name="add" />
        </Button>
      </Tooltip>
    </Flex>
  );
});
