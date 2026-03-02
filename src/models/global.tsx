import type { ListItem } from '@anupheaus/common';
import { is as isCommon } from '@anupheaus/common';
import type { MouseEvent, SyntheticEvent, ReactNode } from 'react';
import type { IconName } from '../components/Icon/Icons';
import { Skeleton } from '../components/Skeleton';

export interface ListItemEvent<T = void> extends SyntheticEvent {
  id: string;
  item: ReactListItem<T>;
  data: T;
  ordinal?: number;
}

export interface ListItemClickEvent<T = void> extends Omit<ListItemEvent<T>, 'nativeEvent'>, MouseEvent { }

export type ReactListItem<DataType = any, SubItemType extends ReactListItem = ReactListItem<any, any>> = ListItem & {
  label?: ReactNode;
  iconName?: IconName;
  tooltip?: ReactNode;
  help?: ReactNode;
  className?: string;
  isSelected?: boolean;
  isSelectable?: boolean;
  isExpanded?: boolean;
  subItems?: SubItemType[];
  disableRipple?: boolean;
  actions?: ReactNode;
  isDeletable?: boolean;
  data?: DataType | Promise<DataType>;
  onClick?(event: ListItemClickEvent<DataType>): void;
  onDelete?(event: ListItemEvent<DataType>): void;
  onSelectChange?(event: ListItemEvent<DataType>, isSelected: boolean): void;
  onActiveChange?(event: ListItemEvent<DataType>, isActive: boolean): void;
  render?(event: ListItemEvent<DataType>): ReactNode;
  renderLoading?(event: ListItemEvent<DataType>): ReactNode;
  renderError?(event: ListItemEvent<DataType>): ReactNode;
  renderItem?(event: ListItemEvent<DataType>): ReactNode;
};

export namespace ReactListItem {

  export function render<T extends ReactListItem>(item: T | Promise<T> | undefined): ReactNode {
    if (item != null && !isCommon.promise(item)) {
      if (item.label != null) return item.label;
      if (isCommon.not.empty(item.text)) return item.text;
    }
    return <Skeleton type="text" useRandomWidth isVisible />;
  }

  export function from(item: ListItemType): ReactListItem {
    if (isCommon.string(item)) return { id: item, text: item };
    if (isCommon.record(item)) return { id: item.id, text: item.id };
    return item;
  }

  export function is(item: unknown): item is ReactListItem {
    return isCommon.plainObject(item)
      && isCommon.not.empty(item.id)
      && isCommon.string(item.text);
  }

  export function createClickEvent<T = void>(event: MouseEvent, item: ReactListItem<T>, index?: number): ListItemClickEvent<T> {
    const localEvent = event as ListItemClickEvent<T>;
    localEvent.id = item.id;
    localEvent.item = item;
    localEvent.data = item.data as T;
    localEvent.ordinal = index ?? item.ordinal;
    return localEvent;
  }

  const createSyntheticEvent = <T extends Element, E extends Event>(event: E): React.SyntheticEvent<T, E> => {
    let isDefaultPrevented = false;
    let isPropagationStopped = false;
    const preventDefault = () => {
      isDefaultPrevented = true;
      event.preventDefault();
    };
    const stopPropagation = () => {
      isPropagationStopped = true;
      event.stopPropagation();
    };
    return {
      nativeEvent: event,
      currentTarget: event.currentTarget as EventTarget & T,
      target: event.target as EventTarget & T,
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      defaultPrevented: event.defaultPrevented,
      eventPhase: event.eventPhase,
      isTrusted: event.isTrusted,
      preventDefault,
      isDefaultPrevented: () => isDefaultPrevented,
      stopPropagation,
      isPropagationStopped: () => isPropagationStopped,
      persist: () => { },
      timeStamp: event.timeStamp,
      type: event.type,
    };
  };

  export function createEvent<T = void>(item: ReactListItem<T>): ListItemEvent<T> {
    const event = (createSyntheticEvent(new Event('ListItemEvent'))) as ListItemEvent<T>;
    event.id = item.id;
    event.item = item;
    event.data = item.data as T;
    event.ordinal = item.ordinal;
    return event;
  }
}

export type ListItemType = string | ListItem | ReactListItem;
