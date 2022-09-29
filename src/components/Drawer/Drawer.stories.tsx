import { createStories } from '../../Storybook';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { useDrawer as useDrawerTest } from './useDrawer';

createStories(() => ({
  name: 'Components/Drawer',
  module,
  stories: {
    'Default': () => {
      const { Drawer, openDrawer } = useDrawerTest();
      return (
        <Tag name="drawer-test-container">
          <Button onClick={openDrawer}>Open</Button>
          <Drawer title="My Title" disableBackdropClick disableEscapeKeyDown>
            Hey
          </Drawer>
        </Tag>
      );
    },
  },
}));
