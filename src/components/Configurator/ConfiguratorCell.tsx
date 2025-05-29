import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { ConfiguratorItem, ConfiguratorSlice, ConfiguratorSubItem } from './configurator-models';
import { createStyles } from '../../theme';
import { useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { useBound } from '../../hooks';
import { ColumnWidthsContext } from './configurator-contexts';
import { is } from '@anupheaus/common';

const useStyles = createStyles(({ configurator: { header, item, subItem, slice } }, { modifyColor }) => {

  const mixColours = (colour1: string, colour2: string | undefined, isOddItem: boolean, isOddSlice: boolean) => {
    let actualColour1 = modifyColor(colour1);
    if (isOddItem) actualColour1 = actualColour1.darken(0.03); else actualColour1 = actualColour1.lighten(0.03);
    if (colour2 == null) return actualColour1.hexa();
    const actualColour2 = modifyColor(colour2);
    return actualColour1.mix(actualColour2, isOddSlice ? 0.4 : 0.5).hexa();
  };

  return {
    configuratorCell: {

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

      '&.is-item': {
        color: item.textColor,
        cursor: 'default',

        '&.is-first-column': {
          cursor: 'pointer',
        },

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

        '&.is-first-column': {
          marginLeft: 16,
          left: 16,
        },
      },
    },
    configuratorCellContent: {
      padding: 8,
    },
  };
});

interface Props {
  columnIndex: number;
  item: ConfiguratorItem<any, any, any> | ConfiguratorSubItem<any, any, any>;
  slice?: ConfiguratorSlice<any>;
  isHeader?: boolean;
  isFooter?: boolean;
  isOddItem: boolean;
  isOddSlice?: boolean;
  isSubItem?: boolean;
  onChangeItem?(item: ConfiguratorItem<any, any>): void;
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
  onChangeItem,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();
  const columnWidths = useContext(ColumnWidthsContext);
  const isFirstColumn = columnIndex === 0;
  const elementRef = useRef<HTMLDivElement>(null);

  const value = useMemo(() => {
    const content = (() => {
      if (!slice) return item.label ?? item.text;
      return is.function(item.renderCell) ? item.renderCell(item, slice) : item.label ?? item.text;
    })();
    return (
      <Flex tagName="configurator-cell-content" className={css.configuratorCellContent} valign="center">
        {content}
      </Flex>
    );
  }, [slice, item]);

  const handleOnClick = useBound(() => {
    if (!isFirstColumn) return;
    onChangeItem?.({ ...item, isExpanded: !item.isExpanded });
  });

  const style = useInlineStyle(() => ({
    width: Math.max(columnWidths[columnIndex] - (isSubItem && isFirstColumn ? 16 : 0), 0),
    left: slice?.isPinned ? columnWidths.slice(0, columnIndex).sum() : undefined,
  }), [columnWidths[columnIndex], isSubItem, slice?.isPinned]);

  useLayoutEffect(() => {
    if (elementRef.current == null || slice?.isPinned !== true) return;
    elementRef.current.style.left = `${elementRef.current.offsetLeft}px`;
  }, [elementRef.current != null && slice?.isPinned === true]);

  return (
    <Flex
      ref={elementRef}
      tagName="configurator-cell"
      className={join(
        css.configuratorCell,
        `is-${isHeader ? 'header' : isFooter ? 'footer' : isSubItem ? 'sub-item' : 'item'}`,
        `is-${isOddItem ? 'odd' : 'even'}-item`,
        slice != null && slice.doNotApplySliceStyles !== true && `is-${isOddSlice ? 'odd' : 'even'}-slice`,
        isFirstColumn && 'is-first-column',
        slice?.isPinned && 'is-pinned',
      )}
      style={style}
      onClick={handleOnClick}
    >
      {value}
    </Flex>
  );
});