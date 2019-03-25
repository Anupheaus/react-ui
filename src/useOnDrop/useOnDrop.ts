import { Omit } from 'anux-common';

enum DraggableTypes {
    File,
    Object,
}

interface IDraggable<TData = void> {
    type: DraggableTypes;
    data: TData;
}

interface IUseOnDropForConfig<TData> {
    validate(data: TData): boolean;
    onEntered(data: TData): void;
    onExited(data: TData): void;
    onDropped(data: TData): void;
}

interface IUseOnDropApi {
    for<TData>(config: IUseOnDropForConfig<TData>): IUseOnDropApi;
}

interface IUseOnDropConfig {

}

interface IUseOnDropInternalConfig extends IUseOnDropConfig {
    validate?(data: IDraggable<any>): boolean;
}

function createUseOnDropFactory(config: IUseOnDropInternalConfig): IUseOnDropApi {
    return {
        validate: delegate => createUseOnDropFactory({ ...config, validate: delegate }),
        onDropped: delegate=>createUseOnDropFactory({ ...config, });
    };
}

export function useOnDrop(config?: IUseOnDropConfig): IUseOnDropApi {
    return createUseOnDropFactory(config || {});
}
