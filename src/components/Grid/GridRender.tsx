// import { AnyObject } from '@anupheaus/common';
// import { CSSProperties, useMemo, useState } from 'react';
// import { useUIState } from '../../providers';
// import { createLegacyStyles, TransitionTheme } from '../../theme';
// import { createComponent } from '../Component';
// import { Scroller } from '../Scroller';
// import { Tag } from '../Tag';
// import { GridCell } from './GridCell';
// import { GridContexts } from './GridContexts';
// import { GridHeaderCell } from './GridHeaderCell';
// import { GridTheme } from './GridTheme';
// import { GridActionsRenderer } from './providers/actions/GridActions/GridActionsRenderer';
// import { useGridColumns } from './providers/columns/GridColumns/useGridColumns';
// import { useGridRecords } from './providers/records/GridRecords/useGridRecords';

// const loadingRecords = Array.ofSize(10).map((_, index) => ({ id: `loading-${index}` }));

// interface Props {
//   isActionsVisible: boolean;
// }

// const useStyles = createLegacyStyles(({ useTheme }) => {
//   const { borders: { radius: borderRadius }, headers: { backgroundColor } } = useTheme(GridTheme);
//   const transitionSettings = useTheme(TransitionTheme);

//   return {
//     styles: {
//       gridContainer: {
//         display: 'flex',
//         flex: 'auto',
//         borderRadius,
//         position: 'relative',
//         overflow: 'hidden',
//         transitionProperty: 'border-top-right-radius',
//         ...transitionSettings,
//       },
//       squareCorner: {
//         borderTopRightRadius: 0,
//       },
//       gridHeaderBackground: {
//         position: 'absolute',
//         inset: 0,
//         bottom: 'unset',
//         backgroundColor,
//         height: 'var(--header-height)',
//         pointerEvents: 'none',
//         zIndex: 1,
//       },
//       gridInsetShadow: {
//         position: 'absolute',
//         inset: 0,
//         top: 'var(--header-height)',
//         boxShadow: 'inset 0 0 6px rgba(0 0 0 / 24%)',
//         pointerEvents: 'none',
//       },
//       gridRender: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(var(--column-count), 1fr)',
//       },
//     },
//   };
// });

// export const GridRender = createComponent('GridRender', ({
//   isActionsVisible,
// }: Props) => {
//   const { css, join } = useStyles();
//   const { isLoading } = useUIState();
//   const { visibleColumns } = useGridColumns();
//   const { records } = useGridRecords();
//   const [headerHeight, setHeaderHeight] = useState<number>();

//   const style = useMemo<CSSProperties & AnyObject>(() => ({
//     '--column-count': visibleColumns.length,
//     '--header-height': `${headerHeight ?? 0}px`,
//   }), [visibleColumns.length, headerHeight]);

//   const headerCells = useMemo(() => visibleColumns.map((column, index) => (
//     <GridHeaderCell
//       key={column.id}
//       column={column}
//       columnIndex={index}
//     />
//   )), [visibleColumns]);

//   const rowCells = useMemo(() => {
//     const recordsToRender = isLoading ? (records.length > 0 ? records : loadingRecords) : records;
//     return recordsToRender
//       .map((record, rowIndex, recordsArray) => visibleColumns
//         .map((column, columnIndex) => (
//           <GridCell key={`${column.id}-${record.id}`} column={column} isLastRow={rowIndex === recordsArray.length - 1}>
//             {column.renderValue?.({ ...column, rowIndex, columnIndex, record }) ?? null}
//           </GridCell>
//         ))).flatten();
//   }, [visibleColumns, records]);

//   return (<>
//     <Tag name="grid-container" className={join(css.gridContainer, isActionsVisible && css.squareCorner)} style={style}>
//       <GridContexts.setHeaderHeight.Provider value={setHeaderHeight}>
//         <Tag name="grid-header-background" className={css.gridHeaderBackground} />
//         <Scroller disableShadows offsetTop={headerHeight}>
//           <Tag name="grid-render" className={css.gridRender} style={style}>
//             {headerCells}
//             {rowCells}
//           </Tag>
//         </Scroller>
//         <Tag name="grid-inset-shadow" className={css.gridInsetShadow} />
//       </GridContexts.setHeaderHeight.Provider>
//     </Tag>
//     <GridActionsRenderer isVisible={isActionsVisible} />
//   </>);
// });
