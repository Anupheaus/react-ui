// import type { GridColDef } from '@mui/x-data-grid-premium';
// import type { ConfiguratorFirstColumn, ConfiguratorSlice } from './configurator-models';

// export function createFirstColumn(firstColumn?: ConfiguratorFirstColumn): GridColDef {
//   return {
//     field: 'first-column',
//     headerName: firstColumn?.text ?? 'Item',
//     aggregable: false,
//     hideable: false,
//     minWidth: firstColumn?.minWidth,
//     resizable: firstColumn?.isResizable === true,
//     groupable: false,

//   };
// }

// export function convertSliceToColumn(slice: ConfiguratorSlice<any>): GridColDef {
//   return {
//     field: slice.id,
//     align: 'center',
//     headerAlign: 'center',
//     headerName: slice.text,
//     resizable: slice.isResizable === true,
//     minWidth: slice.minWidth,
//     groupable: false,
//     aggregable: false,
//     availableAggregationFunctions: slice.aggregation ? [slice.aggregation] : undefined,
//   };
// }

