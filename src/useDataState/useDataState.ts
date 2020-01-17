import { IRecord, DeepPartial, is, Upsertable } from 'anux-common';
import { useMemo, useRef } from 'react';
import { useForceUpdate } from '../useForceUpdate';

export type DataWithState<TData extends IRecord, TStateKey extends symbol, TState extends {}> = TData & Record<TStateKey, TState>;
export type RecordOf<TState extends {}> = TState & { id: string };

export type SetDataStateAction<TData extends IRecord, TState extends {}> = (itemOrId: TData | string,
  partialStateOrUpdate: DeepPartial<TState> | ((state: TState) => TState)) => void;

export function useDataState<TData extends IRecord, TStateKey extends symbol, TState extends {}>(items: TData, data: RecordOf<TState>, stateKey: TStateKey,
  delegate: (data: TState, item: TData) => TState): [DataWithState<TData, TStateKey, TState>, SetDataStateAction<TData, TState>, RecordOf<TState>];
export function useDataState<TData extends IRecord, TStateKey extends symbol, TState extends {}>(items: TData[], data: RecordOf<TState>[], stateKey: TStateKey,
  delegate: (data: TState, item: TData) => TState): [DataWithState<TData, TStateKey, TState>[], SetDataStateAction<TData, TState>, RecordOf<TState>[]];
export function useDataState<TData extends IRecord, TStateKey extends symbol, TState extends {}>(itemOrItems: TData | TData[], originalData: RecordOf<TState>[],
  stateKey: TStateKey, delegate: (data: TState, item: TData) => TState): [((DataWithState<TData, TStateKey, TState>) | (DataWithState<TData, typeof stateKey, TState>[])),
    SetDataStateAction<TData, TState>, RecordOf<TState>[]] {
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
      const { id, ...restOfState } = data.findById(item.id) || {} as unknown as RecordOf<TState>;
      const state = restOfState as unknown as TState;
      return {
        ...item,
        [stateKey]: delegate(state, item),
      } as unknown as DataWithState<TData, typeof stateKey, TState>;
    });
    const setState: SetDataStateAction<TData, TState> = (itemOrId: TData | string, updateOrDelegate: (DeepPartial<TState>) | ((state: TState) => TState)): void => {
      const setStateDelegate = is.function<(state: TState) => TState>(updateOrDelegate, s => ({ ...s, ...updateOrDelegate }));
      const id = is.string(itemOrId) ? itemOrId : itemOrId.id;
      const state = data.findById(id);
      const update = setStateDelegate(state) as unknown as RecordOf<TState>;
      data = data.upsert(update);
      dataRef.current = data;
      forceUpdate();
    };
    return [itemOrItems instanceof Array ? results : results[0], setState, data] as any;
  }, [itemOrItems, data, stateKey, delegate]);
}
