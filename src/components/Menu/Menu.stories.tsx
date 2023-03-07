import { createStories, StorybookComponent } from '../../Storybook';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { Flex } from '../Flex';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { usePopupMenu } from './usePopupMenu';

const useStyles = createStyles({
  farSideMenu: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

const DemoableMenu = () => {
  return (
    <Flex fixedSize width={500} height={200}>
      <Menu>
        <MenuItem>Menu Item 1</MenuItem>
        <MenuItem>Menu Item 2</MenuItem>
        <MenuItem>Menu Item 3</MenuItem>
        <MenuItem>
          Menu Item 4
          <Menu>
            <MenuItem>Menu Item 4.1</MenuItem>
            <MenuItem>Menu Item 4.2</MenuItem>
            <MenuItem>Menu Item 4.3</MenuItem>
            <MenuItem>
              Menu Item 4.4
              <Menu>
                <MenuItem>Menu Item 4.4.1</MenuItem>
                <MenuItem>Menu Item 4.4.2</MenuItem>
                <MenuItem>Menu Item 4.4.3</MenuItem>
              </Menu>
            </MenuItem>
          </Menu>
        </MenuItem>
        <MenuItem>Menu Item 5</MenuItem>
        <MenuItem>Menu Item 6</MenuItem>
        <MenuItem>Menu Item 7</MenuItem>
        <MenuItem>Menu Item 8</MenuItem>
        <MenuItem>Menu Item 9</MenuItem>
        <MenuItem>Menu Item 10</MenuItem>
      </Menu>
    </Flex>
  );
};

const DemoablePopupMenu = () => {
  const { PopupMenu, target, openMenu } = usePopupMenu();

  return (
    <Flex fixedSize width={500} height={200} valign="top">
      <Button ref={target} onClick={openMenu}>Open Menu</Button>
      <PopupMenu>
        <MenuItem>Menu Item 1</MenuItem>
        <MenuItem>Menu Item 2</MenuItem>
        <MenuItem>Menu Item 3</MenuItem>
        <MenuItem>
          Menu Item 4
          <Menu>
            <MenuItem>Menu Item 4.1</MenuItem>
            <MenuItem>Menu Item 4.2</MenuItem>
            <MenuItem>Menu Item 4.3</MenuItem>
            <MenuItem>
              Menu Item 4.4
              <Menu>
                <MenuItem>Menu Item 4.4.1</MenuItem>
                <MenuItem>Menu Item 4.4.2</MenuItem>
                <MenuItem>Menu Item 4.4.3</MenuItem>
              </Menu>
            </MenuItem>
          </Menu>
        </MenuItem>
        <MenuItem>Menu Item 5</MenuItem>
        <MenuItem>Menu Item 6</MenuItem>
        <MenuItem>Menu Item 7</MenuItem>
        <MenuItem>Menu Item 8</MenuItem>
        <MenuItem>Menu Item 9</MenuItem>
        <MenuItem>Menu Item 10</MenuItem>
      </PopupMenu>
    </Flex>
  );
};

createStories(({ createStory }) => ({
  name: 'Components/Menu',
  module,
  stories: {
    ...generateUIStateStories(DemoableMenu),
    'Menu': createStory({
      wrapInStorybookComponent: false,
      component: () => {
        const { css } = useStyles();
        return (<>
          <StorybookComponent title={'Normal Menu'}>
            <DemoableMenu />
          </StorybookComponent>

          <StorybookComponent title={'Far Side Menu'} width={110} className={css.farSideMenu}>
            <DemoableMenu />
          </StorybookComponent>

          <StorybookComponent title={'Bottom Menu'} className={css.bottomMenu}>
            <DemoableMenu />
          </StorybookComponent>
        </>);
      },
    }),

    'usePopupMenu': createStory({
      wrapInStorybookComponent: false,
      component: () => {
        const { css } = useStyles();
        return (<>
          <StorybookComponent title={'Normal Popup Menu'}>
            <DemoablePopupMenu />
          </StorybookComponent>

          <StorybookComponent title={'Far Side Popup Menu'} width={110} className={css.farSideMenu}>
            <DemoablePopupMenu />
          </StorybookComponent>

          <StorybookComponent title={'Bottom Popup Menu'} className={css.bottomMenu}>
            <DemoablePopupMenu />
          </StorybookComponent>
        </>);
      },
    }),
  },
}));