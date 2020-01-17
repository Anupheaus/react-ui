import { DeepPartial, bind, IMap } from 'anux-common';
import { stores } from './storesRegistry';
import { StoreCallback } from './models';

export class Store<TData extends IMap> {
  constructor(data: TData) {
    this._id = Math.uniqueId();
    this._data = data;
    this._callbacks = [];
    this._callbackInvocationId = null;
    this._currentCallback = null;
    stores[this._id] = this;
    this._hasDisposed = false;
  }

  //#region Variables

  private _id: string;
  private _data: TData;
  private _callbacks: StoreCallback<TData>[];
  private _callbackInvocationId: string;
  private _currentCallback: StoreCallback<TData>;
  private _hasDisposed: boolean;

  //#endregion

  //#region Properties

  protected get storeId() { return this._id; }

  //#endregion

  //#region Methods

  @bind
  protected updateData(update: DeepPartial<TData>): void {
    if (this._hasDisposed) { throw new Error('An attempt was made to update a store that has been disposed.'); }
    const newData = Object.merge({}, this._data, update);
    if (Reflect.areDeepEqual(this._data, newData)) { return; }
    this._data = newData;
    const callbacks = this._callbackInvocationId == null
      ? this._callbacks.clone()
      : this._callbacks.remove(this._currentCallback); // remove this current callback to prevent recursion
    this.invokeCallbacks(callbacks);
  }

  protected getData(): TData {
    if (this._hasDisposed) { throw new Error('An attempt was made to retrieve data from a store that has been disposed.'); }
    return this._data;
  }

  protected async load?(...args: any[]): Promise<void>;

  // @ts-ignore
  private dispose(): void {
    if (this._hasDisposed) { throw new Error('An attempt was made to dispose of a store that has already been disposed.'); }
    this._hasDisposed = true;
    delete stores[this._id];
    this._id = undefined;
    this._data = undefined;
    this._callbacks = undefined;
    this._callbackInvocationId = undefined;
    this._currentCallback = undefined;
  }

  // @ts-ignore
  private registerOnUpdateCallback(callback: StoreCallback<TData>): () => void {
    if (this._hasDisposed) { throw new Error('An attempt was made to register a callback on a store that has already been disposed.'); }
    this._callbacks.push(callback);
    return () => {
      if (this._hasDisposed) { return; }
      this._callbacks = this._callbacks.remove(callback);
    };
  }

  private invokeCallbacks(callbacks: StoreCallback<TData>[]): void {
    const callbackInvocationId = this._callbackInvocationId = Math.uniqueId();
    callbacks.forEach(callback => {
      if (callbackInvocationId !== this._callbackInvocationId) { return; } // check that we are still the right instance of callAllCallbacks
      if (!this._callbacks.includes(callback)) { return; } // check that the callback hasn't been removed from the global array
      this._currentCallback = callback;
      callback(this._data);
    });
    if (callbackInvocationId === this._callbackInvocationId) { this._callbackInvocationId = null; }
  }

  //#endregion

}
