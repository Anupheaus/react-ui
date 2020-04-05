import * as enzyme from 'enzyme';
import './HTMLElement';

declare module 'enzyme' {

  // tslint:disable-next-line:class-name interface-name
  export interface ReactWrapper<P = {}, S = {}> {
    simulateEvent(eventName: string): void;
    simulateEvent(eventName: string, additionalEventData: Object): void;
  }

}

enzyme.ReactWrapper.prototype.simulateEvent = function simulateEvent(this: enzyme.ReactWrapper, eventName: string, eventData?: Object) {
  (this.getDOMNode() as HTMLElement).simulateEvent(eventName, eventData ?? {});
};
