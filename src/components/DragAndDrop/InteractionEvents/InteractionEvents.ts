import { AnyObject } from '@anupheaus/common';

export interface MouseEnteredEvent<T extends AnyObject = AnyObject> extends MouseEvent {
  data?: T;
}

export interface MouseMoveEvent<T extends AnyObject = AnyObject> extends MouseEvent {
  data?: T;
  elementPctX: number;
  elementPctY: number;
}

export interface MouseLeaveEvent<T extends AnyObject = AnyObject> extends MouseEvent {
  data?: T;
}

export interface MouseUpEvent<T extends AnyObject = AnyObject> extends MouseEvent {
  data?: T;
}

export interface MouseDownEvent<T extends AnyObject = AnyObject> extends MouseEvent {
  data?: T;
}