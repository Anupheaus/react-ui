import { IRecord, DeepPartial } from 'anux-common';
import { useMemo, useRef } from 'react';
import { useForceUpdate } from '../useForceUpdate';

export type DataWithState<TData extends IRecord, TStateKey extends symbol, TState extends {}> = TData & Record<TStateKey, TState>;
export type RecordOf<TState extends {}> = TState & { id: string; };

export type SetDataStateAction<TData extends IRecord, TState extends {}> = (item: TData, partialState: DeepPartial<TState>) => void;

export function useDataState<TData extends IRecord, TStateKey extends symbol, TState extends {}>(items: TData, data: RecordOf<TState>, stateKey: TStateKey,
  delegate: (data: TState, item: TData) => TState): [DataWithState<TData, TStateKey, TState>, SetDataStateAction<TData, TState>, RecordOf<TState>];
export function useDataState<TData extends IRecord, TStateKey extends symbol, TState extends {}>(items: TData[], data: RecordOf<TState>[], stateKey: TStateKey,
  delegate: (data: TState, item: TData) => TState): [DataWithState<TData, TStateKey, TState>[], SetDataStateAction<TData, TState>, RecordOf<TState>[]];
export function useDataState<TData extends IRecord, TStateKey extends symbol, TState extends {}>(itemOrItems: TData | TData[], originalData: RecordOf<TState>[],
  stateKey: TStateKey, delegate: (data: TState, item: TData) => TState)
  : [((DataWithState<TData, TStateKey, TState>) | (DataWithState<TData, typeof stateKey, TState>[])), SetDataStateAction<TData, TState>, RecordOf<TState>[]] {
  const forceUpdate = useForceUpdate();

  const originalDataArray = originalData instanceof Array ? originalData : [originalData];

  const dataRef = useRef(originalDataArray);
  let data = dataRef.current;

  useMemo(() => {
    if (originalDataArray.equals(data)) { return; }
    data = originalDataArray;
    dataRef.current = data;
  }, [originalData]);

  return useMemo(() => {
    const items = itemOrItems instanceof Array ? itemOrItems : [itemOrItems];
    const results = items.map(item => {
      const { id, ...restOfState } = data.findById(item.id) || {} as RecordOf<TState>;
      const state: TState = restOfState as any;
      return {
        ...item,
        [stateKey]: delegate(state, item),
      } as DataWithState<TData, typeof stateKey, TState>;
    });
    const setState: SetDataStateAction<TData, TState> = (item, update) => {
      dataRef.current = data.upsert({ id: item.id, ...update } as any);
      forceUpdate();
    };
    return [itemOrItems instanceof Array ? results : results[0], setState, data] as any;
  }, [itemOrItems, data, stateKey, delegate]);
}
