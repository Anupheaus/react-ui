import type { AnyObject } from '@anupheaus/common';
import type { ReactListItem } from '../../models';
import type { ReactNode } from 'react';

// type GetAfterFirst<T extends AnyObject[]> = T extends [infer _, ...infer Rest] ? Rest : never;
// type HasMore<T extends AnyObject[]> = T extends [infer _, ...infer _Rest] ? true : false;

// export type ConfiguratorItem<DataType extends AnyObject[] = AnyObject[]> = ReactListItem & {
//   isExpanded?: boolean;
//   data: DataType[0];
// } & (HasMore<GetAfterFirst<DataType>> extends true ? {
//   subItems: ConfiguratorItem<GetAfterFirst<DataType>>[];
// } : {
//   subItems?: ConfiguratorItem<[DataType]>[];
// });

export interface ConfiguratorSubItem<DataType extends AnyObject = AnyObject, SubDataType extends AnyObject | never = AnyObject, SliceDataType extends AnyObject = AnyObject> extends ReactListItem {
  isExpanded?: boolean;
  data: DataType;
  renderCell(item: ConfiguratorItem<DataType, SubDataType, SliceDataType> | ConfiguratorSubItem<SubDataType, never, SliceDataType>, slice: ConfiguratorSlice<SliceDataType>): ReactNode;
}

export type ConfiguratorItem<DataType extends AnyObject = AnyObject, SubDataType extends AnyObject | never = AnyObject, SliceDataType extends AnyObject = AnyObject> =
  ConfiguratorSubItem<DataType, SubDataType, SliceDataType> & (SubDataType extends AnyObject ? {
    subItems: ConfiguratorSubItem<SubDataType, never, SliceDataType>[];
  } : {});

export interface ConfiguratorSlice<DataType extends AnyObject = AnyObject> extends ReactListItem {
  data: DataType;
  isPinned?: boolean;
  isResizable?: boolean;
  aggregation?: 'sum' | 'count' | 'min' | 'max' | 'average';
  minWidth?: number;
  doNotApplySliceStyles?: boolean;
}

export interface ConfiguratorFirstCell {
  label?: ReactNode;
  minWidth?: number;
  isResizable?: boolean;
}
