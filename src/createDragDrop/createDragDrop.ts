import { createDraggable } from './createDraggable';
import { createDroppable } from './createDroppable';

export interface ICreateDragDropConfig {
    dragging?: {
        threshold?: number;
    };
}

export function createDragDrop<TData>(config?: ICreateDragDropConfig) {
    config = {
        ...config,
        dragging: {
            threshold: 3,
            ...(config || {}).dragging,
        },
    };

    return {
        Draggable: createDraggable<TData>(config),
        Droppable: createDroppable<TData>(),
    };
}
