import { IMap, DeepPartial, bind } from 'anux-common';
import { StoreCallback, StoreActionsDelegate } from './models';
import { stores } from './stores';

export class Store<TData extends IMap = IMap, TActions extends IMap = IMap> {
  constructor(data: TData, actions: StoreActionsDelegate<TData, TActions>) {
    this._id = Math.uniqueId();
    this._data = data;
    this._actions = actions(this.update, () => this._data);
    this._callbacks = [];
    this._callbackInvocationId = null;
    this._currentCallback = null;
    stores[this._id] = this;
  }

  //#region Variables

  private _id: string;
  private _data: TData;
  private _actions: TActions;
  private _callbacks: StoreCallback<TData>[];
  private _callbackInvocationId: string;
  private _currentCallback: StoreCallback;

  //#endregion

  //#region Properties

  public get id() { return this._id; }

  public get data() { return this._data; }

  public get actions() { return this._actions; }

  //#endregion

  //#region Methods

  @bind
  public update(partialData: DeepPartial<TData>): void {
    if (!this._data && !this._callbacks) { throw new Error('An attempt was made to update a store that has been disposed.'); }
    const newData = Object.merge({}, this._data, partialData);
    if (Reflect.areDeepEqual(this._data, newData)) { return; }
    this._data = newData;
    const callbacks = this._callbackInvocationId == null
      ? this._callbacks.clone()
      : this._callbacks.remove(this._currentCallback); // remove this current callback to prevent recursion
    this.invokeCallbacks(callbacks);
  }

  public register(callback: StoreCallback<TData>): () => void {
    if (!this._callbacks) { return; }
    this._callbacks.push(callback);
    return () => {
      if (!this._callbacks) { return; }
      this._callbacks = this._callbacks.remove(callback);
    };
  }

  public dispose(): void {
    delete stores[this._id];
    this._id = undefined;
    this._data = undefined;
    this._actions = undefined;
    this._callbacks = undefined;
    this._callbackInvocationId = undefined;
    this._currentCallback = undefined;
  }

  private invokeCallbacks(callbacks: StoreCallback[]): void {
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
