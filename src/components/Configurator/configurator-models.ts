import type { AnyObject } from '@anupheaus/common';
import type { ReactListItem } from '../../models';
import type { ReactNode } from 'react';

export type ConfiguratorSubItem<DataType extends AnyObject = AnyObject, SliceDataType extends AnyObject = AnyObject> = Omit<ReactListItem<DataType>, 'subItems' | 'data'> & {
  data: DataType;
  renderCell(item: ConfiguratorSubItem<DataType, SliceDataType>, slice: ConfiguratorSlice<SliceDataType>): ReactNode;
};

export type ConfiguratorItem<DataType extends AnyObject = AnyObject, SubDataType extends AnyObject | never = AnyObject, SliceDataType extends AnyObject = AnyObject> =
  Omit<ReactListItem<DataType>, 'subItems' | 'data'> & {
    data: DataType;
    renderCell(item: ConfiguratorItem<DataType, SubDataType, SliceDataType>, slice: ConfiguratorSlice<SliceDataType>): ReactNode;
  } & (SubDataType extends AnyObject ? {
    subItems: ConfiguratorSubItem<SubDataType, SliceDataType>[];
  } : {});

export type ConfiguratorSlice<DataType extends AnyObject = AnyObject> = Omit<ReactListItem<DataType>, 'data'> & {
  data: DataType;
  isPinned?: boolean;
  isResizable?: boolean;
  aggregation?: 'sum' | 'count' | 'min' | 'max' | 'average';
  doNotApplySliceStyles?: boolean;
  minWidth?: number;
  maxWidth?: number;
};

export interface ConfiguratorFirstCell {
  label?: ReactNode;
  minWidth?: number;
  maxWidth?: number;
  isResizable?: boolean;
}
