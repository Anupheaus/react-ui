import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { ConfiguratorItem, ConfiguratorSlice, ConfiguratorSubItem } from './configurator-models';
import { createStyles } from '../../theme';
import type { MouseEvent } from 'react';
import { useLayoutEffect, useMemo } from 'react';
import { useBound } from '../../hooks';
import { useConfiguratorColumnWidths } from './column-widths';
import { is } from '@anupheaus/common';
import { Icon } from '../Icon';
import { Tag } from '../Tag';
import { ReactListItem } from '../../models';

const useStyles = createStyles(({ configurator: { header, item, subItem, slice }, shadows: { scroll: shadow }, pseudoClasses }, { modifyColor, applyTransition }) => {

  const mixColours = (colour1: string, colour2: string | undefined, isOddItem: boolean, isOddSlice: boolean) => {
    let actualColour1 = modifyColor(colour1);
    if (isOddItem) actualColour1 = actualColour1.darken(0.03); else actualColour1 = actualColour1.lighten(0.03);
    if (colour2 == null) return actualColour1.hexa();
    const actualColour2 = modifyColor(colour2);
    return actualColour1.mix(actualColour2, isOddSlice ? 0.4 : 0.5).hexa();
  };

  return {
    configuratorCell: {
      minHeight: 'fit-content',
      contain: 'style', // so that the shadow container does not spread the background color to the next column

      '&.is-first-column': {
        position: 'sticky',
        left: 0,
        zIndex: 2,
      },

      '&.is-header, &.is-footer': {
        backgroundColor: header.backgroundColor,
        color: header.textColor,
        cursor: 'default',
        position: 'sticky',
        zIndex: 1,

        '&.is-odd-slice': {
          backgroundColor: mixColours(header.backgroundColor, slice?.backgroundColor, false, true),
        },

        '&.is-even-slice': {
          backgroundColor: mixColours(header.backgroundColor, slice?.backgroundColor, false, false),
        },
      },

      '&.is-pinned': {
        position: 'sticky',
        left: 0,
        zIndex: 1,
      },

      '&.is-pinned.is-header, &.is-pinned.is-footer': {
        zIndex: 2,
      },

      '&.is-first-column.is-header, &.is-first-column.is-footer': {
        zIndex: 3,
      },

      '&.is-sub-item.is-first-column': {
        paddingLeft: 16,
      },
    },

    configuratorCellRenderer: {

      '&.is-item': {
        color: item.textColor,
        cursor: 'default',

        '&.is-odd-item': {
          backgroundColor: mixColours(item.backgroundColor, undefined, true, false),
          '&.is-odd-slice': {
            backgroundColor: mixColours(item.backgroundColor, slice?.backgroundColor, true, true),
          },

          '&.is-even-slice': {
            backgroundColor: mixColours(item.backgroundColor, slice?.backgroundColor, true, false),
          },
        },

        '&.is-even-item': {
          backgroundColor: mixColours(item.backgroundColor, undefined, false, false),

          '&.is-odd-slice': {
            backgroundColor: mixColours(item.backgroundColor, slice?.backgroundColor, false, true),
          },

          '&.is-even-slice': {
            backgroundColor: mixColours(item.backgroundColor, slice?.backgroundColor, false, false),
          },
        },
      },

      '&.is-sub-item': {
        padding: 0,
        color: subItem?.textColor ?? item.textColor,
        cursor: 'default',
        overflow: 'hidden',

        '&.is-odd-item': {
          backgroundColor: mixColours(subItem?.backgroundColor ?? item.backgroundColor, undefined, true, false),

          '&.is-odd-slice': {
            backgroundColor: mixColours(subItem?.backgroundColor ?? item.backgroundColor, slice?.backgroundColor, true, true),
          },

          '&.is-even-slice': {
            backgroundColor: mixColours(subItem?.backgroundColor ?? item.backgroundColor, slice?.backgroundColor, true, false),
          },
        },

        '&.is-even-item': {
          backgroundColor: mixColours(subItem?.backgroundColor ?? item.backgroundColor, undefined, false, false),

          '&.is-odd-slice': {
            backgroundColor: mixColours(subItem?.backgroundColor ?? item.backgroundColor, slice?.backgroundColor, false, true),
          },

          '&.is-even-slice': {
            backgroundColor: mixColours(subItem?.backgroundColor ?? item.backgroundColor, slice?.backgroundColor, false, false),
          },
        },
      },

      '&.is-clickable': {
        cursor: 'pointer',
      },
    },
    configuratorCellContent: {
      padding: 8,

      '&.has-expand-button': {
        paddingLeft: 0,
      },

      [pseudoClasses.tablet]: {
        padding: 16,

        '&.has-expand-button': {
          paddingLeft: 0,
          marginLeft: -8,
        },
      },
    },
    expandButton: {
      zIndex: 1,
      padding: 8,

      [pseudoClasses.tablet]: {
        padding: 16,
      },
    },
    configuratorCellRightShadow: {
      position: 'absolute',
      right: -10,
      top: 0,
      width: 10,
      bottom: 0,
      opacity: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      ...applyTransition('opacity'),

      '&::after': {
        content: '""',
        position: 'absolute',
        left: -2,
        top: -10,
        bottom: -10,
        width: 2,
        boxShadow: shadow(false),
      },

      '&.is-visible': {
        opacity: 1,
      },
    },
  };
});

interface Props {
  columnIndex: number;
  item: ConfiguratorItem | ConfiguratorSubItem;
  slice?: ConfiguratorSlice<any>;
  isHeader?: boolean;
  isFooter?: boolean;
  isOddItem: boolean;
  isOddSlice?: boolean;
  isSubItem?: boolean;
  addShadowToRight?: boolean;
  onExpandItem?(item: ConfiguratorItem<any, any>): void;
  onSelect?(): void;
}

export const ConfiguratorCell = createComponent('ConfiguratorCell', ({
  columnIndex,
  item,
  slice,
  isHeader = false,
  isFooter = false,
  isOddItem,
  isOddSlice = false,
  isSubItem = false,
  addShadowToRight,
  onExpandItem,
  onSelect,
}: Props) => {
  const { css, join } = useStyles();
  const { elementRef, target, style } = useConfiguratorColumnWidths({ columnIndex, isHeader });
  const isFirstColumn = columnIndex === 0;

  const expandCell = useBound((event: MouseEvent) => {
    event.stopPropagation();
    if (!isFirstColumn || onExpandItem == null) return;
    onExpandItem({ ...item, isExpanded: !item.isExpanded });
  });

  const clickCell = useBound((event: MouseEvent) => {
    if (onSelect != null) {
      onSelect();
    } else if (slice != null && isHeader) {
      slice.onClick?.(ReactListItem.createClickEvent(event, slice, columnIndex));
    } else if (columnIndex === 0) {
      item.onClick?.(ReactListItem.createClickEvent(event, item));
    }
  });

  const value = useMemo(() => {
    const content = (() => {
      if (slice == null) return item.label ?? item.text;
      return is.function(item.renderCell) ? item.renderCell(item as ConfiguratorItem, slice as ConfiguratorSlice) : item.label ?? item.text;
    })();
    return (
      <>
        {onExpandItem != null && (
          <Icon name="dropdown" rotate={item.isExpanded ? 180 : 0} className={css.expandButton} onClick={expandCell} />
        )}
        <Flex tagName="configurator-cell-content" className={join(css.configuratorCellContent, onExpandItem != null && 'has-expand-button')} gap={'fields'} valign="center">
          {content}
        </Flex>
      </>
    );
  }, [slice, item, onExpandItem]);

  useLayoutEffect(() => {
    if (elementRef.current == null || slice?.isPinned !== true) return;
    elementRef.current.style.left = `${elementRef.current.offsetLeft}px`;
  }, [elementRef.current != null && slice?.isPinned === true]);

  const itemTypeClass = `is-${isHeader ? 'header' : isFooter ? 'footer' : isSubItem ? 'sub-item' : 'item'}`;
  const oddEvenClass = `is-${isOddItem ? 'odd' : 'even'}-item`;
  const sliceClass = slice != null && slice.doNotApplySliceStyles !== true && `is-${isOddSlice ? 'odd' : 'even'}-slice`;
  const classes = [
    itemTypeClass,
    oddEvenClass,
    sliceClass,
    isFirstColumn && 'is-first-column',
    slice?.isPinned && 'is-pinned',
    (onExpandItem != null || item.onClick != null) && 'is-clickable',
  ];

  return (
    <Flex
      ref={target}
      tagName="configurator-cell"
      className={join(
        css.configuratorCell,
        ...classes,
      )}
      style={style}
      onClick={clickCell}
      disableGrow
    >
      <Flex
        tagName="configurator-cell-renderer"
        className={join(
          css.configuratorCellRenderer,
          ...classes,
        )}
        valign="center"
      >
        {value}
      </Flex>
      {addShadowToRight != null && (<Tag name="configurator-cell-right-shadow" className={join(css.configuratorCellRightShadow, addShadowToRight && 'is-visible')} />)}
    </Flex>
  );
});