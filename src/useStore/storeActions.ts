import { ConstructorOf, DeepPartial, IMap } from 'anux-common';
import { IStoreCreate, createCreateStore } from './createStore';
import { ConstructorOfActionsBase } from './models';

export class ActionsBase<TData extends IMap> {
  constructor(data: TData) {
    this._id = Math.uniqueId();
    this._data = data;
  }

  private _id: string;
  private _data: TData;

  public get id() { return this._id; }

  protected updateData(update: DeepPartial<TData>): void {
    return;
  }

  protected getData(): TData {
    return null;
  }

  protected async load?(params?: IMap): Promise<void>;

}

type OnLoadParamType<TActionsType extends ConstructorOfActionsBase> = Parameters<InstanceType<TActionsType>['load']>[0];

export interface IStoreActions<TData extends IMap> {
  actions<TActions extends ConstructorOfActionsBase>(delegate: (base: ConstructorOf<ActionsBase<TData>>) => TActions): IStoreCreate<TData, InstanceType<TActions>,
    OnLoadParamType<TActions>>;
}

export function createStoreActions<TData extends IMap>(data: TData): IStoreActions<TData> & IStoreCreate<TData, never, never> {
  type ActionsBaseType = ConstructorOf<ActionsBase<TData>>;
  // type ActionsResult<TActions extends ConstructorOfActionsBase> = IStoreCreate<TData, InstanceType<TActions>, OnLoadParamType<TActions>>;

  const storeCreate = createCreateStore<TData, never, never>(data);

  return {
    actions<TActionsType extends ConstructorOfActionsBase>(delegate: (base: ActionsBaseType) => TActionsType) {
      const actionsType = delegate(ActionsBase) as TActionsType;
      return createCreateStore<TData, TActionsType, OnLoadParamType<TActionsType>>(data, actionsType);
    },
    ...storeCreate,
  };
}
