import { ConstructorOf, DeepPartial, IMap } from 'anux-common';
import { FunctionComponent } from 'react';

class ActionsBase<TData extends IMap> {

  protected updateData(update: DeepPartial<TData>): void {
    return;
  }

  protected getData(): TData {
    return null;
  }

  protected async load?(params?: IMap): Promise<void>;

}

type ProviderProps<TData extends IMap, TOnLoad extends IMap> = TOnLoad extends undefined ? IProviderProps<TData> : IProviderProps<TData> & IProviderOnLoadProps<TOnLoad>;

interface IProviderProps<TData extends IMap> {
  initialData?: TData;
}

interface IProviderOnLoadProps<TOnLoad extends IMap> {
  onLoad: TOnLoad;
}

interface IProvider<TData extends IMap, TActions extends IMap, TOnLoad extends IMap = any> extends FunctionComponent<ProviderProps<TData, TOnLoad>> {
  dataType: TData;
  actionsType: TActions;
}

interface IStoreCreate<TData extends IMap, TActions extends IMap, TOnLoad> {
  create(): IProvider<TData, TActions, TOnLoad>;
}

interface IStoreActions<TData extends IMap> {
  actions<TActions extends new (...args: any[]) => any>(delegate: (base: ConstructorOf<ActionsBase<TData>>) => TActions): IStoreCreate<TData, InstanceType<TActions>,
    Parameters<InstanceType<TActions>['load']>[0]>;
}

interface IStoreData {
  data<TData extends IMap>(data: TData): IStoreActions<TData> & IStoreCreate<TData, never, never>;
}

export function defineStore(): IStoreData {
  return null;
}

const Store = defineStore()
  .data({
    something: 'else',
  })
  .actions(base => class extends base {

    public changeSomethingTo(something: string): void {
      this.updateData({ something });
    }

    protected async load(): Promise<void> {
      const _data = this.getData();
    }

  })
  .create();

const a = (
  <Store initialData={{ something: 'blah' }}></Store>
);

function useStore<TData extends IMap, TActions extends IMap>(storeType: IProvider<TData, TActions>): [TData, TActions] {
  return [null, null];
}

const [data, { changeSomethingTo }] = useStore(Store);
changeSomethingTo('ds');

// import { IMap, is, ConstructorOf, TypeOf } from 'anux-common';
// import { FunctionComponent, useState, useContext } from 'react';
// import { Store } from './store';
// import { StoreContext } from './context';
// import { useOnUnmount } from '../useOnUnmount';
// import { StoreTypeId, IStore, IProviderProps, StoreActionsDelegate } from './models';
// import { useOnMount } from '../useOnMount';

// export function createStore<TData extends IMap, TActions extends IMap>(initialData: TData, actions: StoreActionsDelegate<TData, TActions>) {
//   const storeTypeId = Math.uniqueId();

//   const Provider: FunctionComponent<IProviderProps<TData, TActions>> = ({ children, initialData: providerInitialData, onChanged, onLoad, onLoading, onError }) => {
//     const actualInitialData = is.function(providerInitialData) ? providerInitialData(initialData) : (providerInitialData || initialData);
//     const store = new Store(actualInitialData, actions);
//     const currentContext = useContext(StoreContext);
//     const [isLoading, setIsLoading] = useState(is.function(onLoad));
//     const [error, recordError] = useState<Error>();

//     onError = onError || ((displayError: Error) => (<div>An error has occurred within this store: {displayError.message}</div>));

//     let unregisterOnChanged: () => void;
//     if (onChanged) {
//       unregisterOnChanged = store.register(onChanged);
//     }
//     const storeId = store.id;

//     useOnMount(async () => {
//       if (onLoad) {
//         try {
//           await onLoad(store.actions, store.data);
//         } catch (error) {
//           recordError(error);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     });

//     useOnUnmount(() => {
//       if (unregisterOnChanged) { unregisterOnChanged(); unregisterOnChanged = null; }
//       store.dispose();
//     });

//     const renderError = () => !is.null(error) && is.function(onError) ? onError(error) : null;
//     const renderIsLoading = () => !isLoading ? null : onLoading == null ? null : is.function(onLoading) ? onLoading() : onLoading;
//     const content = renderError() || renderIsLoading() || children || null;

//     return <StoreContext.Provider value={{ ...currentContext, [storeTypeId]: storeId }}>{content}</StoreContext.Provider>;
//   };

//   Provider[StoreTypeId] = storeTypeId;

//   return Provider as IStore<TData, TActions>;
// }

// interface IProviderProps<TData extends IMap> {
//   initialData: TData;
// }

// type GetDataFrom<T extends BaseStore<any>> = T extends BaseStore<infer U> ? U : never;

// class BaseStore<TData> {

//   public static get Provider() { return this.createProvider(); }

//   public static createProvider<U extends typeof BaseStore>(this: U) {
//     // @ts-ignore
//     const r: GetDataFrom<InstanceType<U>> = null;
//     return r;
//     // const Provider: FunctionComponent<IProviderProps<GetDataFrom<U>>> = () => {
//     //   return (<div></div>);
//     // };
//     // return Provider;
//   }

//   public something(): void {
//     return;
//   }

// }

// interface IData {
//   something: string;
// }

// class TestStore extends BaseStore<IData> {

// }

// const A = TestStore.createProvider();

// // const a = (
// //   <TestStore.Provider initialData={{}}>

// //   </TestStore.Provider>
// // );

// // // tslint:disable-next-line: max-classes-per-file
// // class Coll<T> {

// //   public static get Provider() { return Store.createProvider(); }

// //   public find(): T {
// //     return null as any; // dummy imeplmentation
// //   }
// // }

// // interface IABB {

// // }

// // // tslint:disable-next-line: max-classes-per-file
// // class ABB extends Coll<IABB> { }

// // type GetCollectionItem<T extends Coll<any>> = T extends Coll<infer U> ? U : never;

// // const h: GetCollectionItem<ABB> = null;
