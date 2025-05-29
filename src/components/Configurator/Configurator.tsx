import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Field } from '../Field';
import { Flex } from '../Flex';
import type { ConfiguratorFirstCell, ConfiguratorItem, ConfiguratorSlice } from './configurator-models';
import { ConfiguratorGrid } from './ConfiguratorGrid';

const useStyles = createStyles({
  configuratorContent: {
    overflow: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: 'auto transparent',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

interface Props {
  firstCell?: ConfiguratorFirstCell;
  items: ConfiguratorItem[];
  slices: ConfiguratorSlice<any>[];
  footer?: ConfiguratorItem;
}

export const Configurator = createComponent('Configurator', ({
  firstCell,
  items,
  slices,
  footer,
}: Props) => {
  const { css } = useStyles();

  return (
    <Field
      tagName="configurator"
      disableRipple
      noContainer
      wide
    >
      <Flex tagName="configurator-content" className={css.configuratorContent} maxWidthAndHeight>
        <ConfiguratorGrid firstCell={firstCell} items={items} slices={slices} footer={footer} />
      </Flex>
    </Field>
  );
});
