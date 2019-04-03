export type AnonymousFunction = (...args: any[]) => any;

export type UseBoundFunctionResult<T extends AnonymousFunction> = T & {
  whenUnmounted(delegate: T): UseBoundFunctionResult<T>;
  dispose(): void;
};

export interface IUseBoundConfig {
  whenUnmounted?(...args: any[]): any;
}

export type UseBoundFunction = <TFunc extends AnonymousFunction>(func: TFunc) => UseBoundFunctionResult<TFunc>;

export type UseBound = UseBoundFunction & {
  create(config: IUseBoundConfig): UseBoundFunction;
  disposeOf(boundFuncs: AnonymousFunction | AnonymousFunction[]): void;
};
