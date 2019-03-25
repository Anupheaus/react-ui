import { FunctionComponent, ReactElement, useCallback, useRef, MutableRefObject } from 'react';
import { is, ICoordinates } from 'anux-common';
import { useBound } from '../useBound';
import { ICreateDragDropConfig } from './createDragDrop';

interface IDraggableResult<TData> {
    setDraggableTarget(key: string): (element: HTMLElement) => HTMLElement;
    setDraggableTarget(key: string, data: TData): (element: HTMLElement) => HTMLElement;
    setDraggableTarget(element: HTMLElement): HTMLElement;
}

interface IOnDragStartData<TData> {
    dragTarget: HTMLElement;
    currentTarget: HTMLElement;
    coordinates: ICoordinates;
    data: TData;
}

interface IOnDragData<TData, TPassthroughData = never> extends IOnDragStartData<TData> {
    passthroughData: TPassthroughData;
}

interface IOnDragEndData<TData, TPassthroughData = never> extends IOnDragData<TData, TPassthroughData> { }

export interface IDraggableProps<TData, TPassthroughData> {
    onDragStart?(event: IOnDragStartData<TData>): TPassthroughData;
    onDrag?(event: IOnDragData<TData>): TPassthroughData;
    onDragEnd?(event: IOnDragEndData<TData, TPassthroughData>): void;
    children(result: IDraggableResult<TData>): ReactElement;
}

interface IObservedTarget<TData> {
    id: string;
    element: HTMLElement;
    data: TData;
    dragHandler(event: MouseEvent): void;
}

function onDragStart<TData>(observedTarget: IObservedTarget<TData>, config: ICreateDragDropConfig, event: MouseEvent): void {
    const { dragging: { threshold }, onDragStart, onDragging, onDragEnd } = config;
    if (event.button !== 0) { return; }
    event.stopPropagation();
    const coordinates: ICoordinates = { x: event.clientX, y: event.clientY };
    const currentTarget = event.target as HTMLElement;
    let data = null;
    let startedDragging = false;

    const dragHandler = (dragEvent: MouseEvent) => {
        if (config.isUnmounted) { removeHandlers(); return; }
        dragEvent.stopPropagation();
        const coordinatesDiff = getCoordinatesDiff(dragEvent, coordinates);
        if (!startedDragging) {
            if (Math.abs(coordinatesDiff.x) <= threshold && Math.abs(coordinatesDiff.y) <= threshold) { return; }
            startedDragging = true;
            setIsDragging(true);
            data = onDragStart({ target, currentTarget, coordinates });
        }
        data = onDragging({ target, currentTarget, coordinates, coordinatesDiff, data });
    };

    const dragEndHandler = (dragEndEvent: MouseEvent) => {
        if (config.isUnmounted) { removeHandlers(); return; }
        const coordinatesDiff = getCoordinatesDiff(dragEndEvent, coordinates);
        try {
            onDragEnd({ target, currentTarget, coordinates, coordinatesDiff, data });
        } catch (error) {
            throw error;
        } finally {
            data = null;
            removeHandlers();
            startedDragging = false;
            setIsDragging(false);
        }
    };

    const removeHandlers = () => {
        document.removeEventListener('mousemove', dragHandler);
        document.removeEventListener('mouseup', dragEndHandler);
    };

    document.addEventListener('mousemove', dragHandler);
    document.addEventListener('mouseup', dragEndHandler);
}

function enableEventsFor<TData>(observedTargetRefs: MutableRefObject<IObservedTarget<TData>[]>, config: ICreateDragDropConfig)
    : (element: HTMLElement, id: string, data: TData) => void {
    return (element, id, data) => {
        let observedTarget = observedTargetRefs.current.findById(id);
        let addEventListener = false;
        if (observedTarget) {
            if (observedTarget.element !== element && observedTarget.element) {
                observedTarget.element.removeEventListener('mousedown', observedTarget.dragHandler);
                addEventListener = true;
            }
            observedTarget.element = element;
            observedTarget.data = data;
        } else {
            observedTarget = {
                id,
                element,
                data,
                dragHandler: event => onDragStart(observedTarget, config, event),
            };
            observedTargetRefs.current.push(observedTarget);
            addEventListener = true;
        }
        if (addEventListener && observedTarget.element) {
            observedTarget.element.addEventListener('mousedown', observedTarget.dragHandler);
        }
    };
}

function createSetDraggableTarget<TData>(enableEvents: ReturnType<typeof enableEventsFor>): IDraggableResult<TData>['setDraggableTarget'] {
    const keyRef = useRef(Math.uniqueId());
    return (keyOrElement: string | HTMLElement, data?: TData): any => {
        if (is.string(keyOrElement)) {
            return (element: HTMLElement) => {
                enableEvents(element, keyOrElement, data);
                return element;
            };
        } else {
            enableEvents(keyOrElement, keyRef.current, null);
            return keyOrElement;

        }
    };
}

export function createDraggable<TData>(config: ICreateDragDropConfig) {
    function DraggableComponent<TPassthroughData>({onDragStart, onDrag, onDragEnd, children }: IDraggableProps<TData, TPassthroughData>) {
        const observedTargetRefs = useRef<IObservedTarget<TData>[]>([]);
        const enableEvents = useBound(enableEventsFor(observedTargetRefs, config));
        const setDraggableTarget = useCallback<IDraggableResult<TData>['setDraggableTarget']>(createSetDraggableTarget(enableEvents), []);
        return children({ setDraggableTarget });
    }
    return DraggableComponent;
}
