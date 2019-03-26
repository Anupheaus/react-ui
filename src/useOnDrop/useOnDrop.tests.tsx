import { FunctionComponent, useCallback } from 'react';
import { mount } from 'enzyme';
import '../extensions';
import { IUseOnDropConfig } from './models';
import { useOnDrop } from './useOnDrop';
import { setDraggingData } from '../dragAndDropRegistry/registry';

describe('useOnDrop', () => {

  function createComponentWithDropTarget<TData, TPassthroughData>(config?: IUseOnDropConfig<TData, TPassthroughData>, useDropClassTarget: boolean = false) {
    const Component: FunctionComponent = () => {
      const { dropTarget, dropClassTarget } = useOnDrop(config);

      const consumeRef = useDropClassTarget ? useCallback((element: HTMLElement) => dropClassTarget(dropTarget(element)), []) : dropTarget;

      return (
        <div ref={consumeRef}></div>
      );
    };
    return Component;
  }

  it('can be entered', () => {
    let onEnteredData: any;
    const Component = createComponentWithDropTarget({
      onEntered: data => onEnteredData = data,
    });
    const component = mount(<Component />);
    const div = component.find('div');
    expect(onEnteredData).to.be.undefined;
    setDraggingData([{ something: 'else' }]);
    div.simulateEvent('mouseenter', { which: 1 });
    expect(onEnteredData).to.be.instanceOf(Array).and.to.eql([{ something: 'else' }]);
    component.unmount();
  });

  it('can be left', () => {
    let onExitedData: any;
    const Component = createComponentWithDropTarget({
      onExited: data => onExitedData = data,
    }, true);
    const component = mount(<Component />);
    const div = component.find('div');
    expect(onExitedData).to.be.undefined;
    setDraggingData([{ something: 'else' }]);
    div.simulateEvent('mouseenter', { which: 1 });
    div.simulateEvent('mouseleave', { which: 1 });
    expect(onExitedData).to.be.instanceOf(Array).and.to.eql([{ something: 'else' }]);
    component.unmount();
  });

  it('can be dropped', () => {
    let onDroppedData: any;
    const Component = createComponentWithDropTarget({
      onDropped: data => onDroppedData = data,
    });
    const component = mount(<Component />);
    const div = component.find('div');
    expect(onDroppedData).to.be.undefined;
    setDraggingData([{ something: 'else' }]);
    div.simulateEvent('mouseenter', { which: 1 });
    div.simulateEvent('mouseup');
    expect(onDroppedData).to.be.instanceOf(Array).and.to.eql([{ something: 'else' }]);
    component.unmount();
  });

  it('cannot be dropped twice', () => {
    let onDropCount = 0;
    const Component = createComponentWithDropTarget({
      onDropped: () => { onDropCount++; },
    });
    const component = mount(<Component />);
    const div = component.find('div');
    expect(onDropCount).to.eq(0);
    setDraggingData([{ something: 'else' }]);
    div.simulateEvent('mouseenter', { which: 1 });
    div.simulateEvent('mouseup');
    expect(onDropCount).to.eq(1);
    div.simulateEvent('mouseup');
    expect(onDropCount).to.eq(1);
    component.unmount();
  });

  it('does not drop if left before being dropped', () => {
    let onDropCount = 0;
    const Component = createComponentWithDropTarget({
      onDropped: () => { onDropCount++; },
    });
    const component = mount(<Component />);
    const div = component.find('div');
    expect(onDropCount).to.eq(0);
    setDraggingData([{ something: 'else' }]);
    div.simulateEvent('mouseenter', { which: 1 });
    div.simulateEvent('mouseleave');
    div.simulateEvent('mouseup');
    expect(onDropCount).to.eq(0);
    component.unmount();
  });

  it('does not trigger if all the data is invalid', () => {
    let onEnteredCount = 0;
    let onLeftCount = 0;
    let onDropCount = 0;
    const Component = createComponentWithDropTarget({
      validate: () => false,
      onEntered: () => { onEnteredCount++; },
      onExited: () => { onLeftCount++; },
      onDropped: () => { onDropCount++; },
    });
    const component = mount(<Component />);
    const div = component.find('div');
    setDraggingData([{ something: 'else' }]);
    div.simulateEvent('mouseenter', { which: 1 });
    expect(onEnteredCount).to.eq(0);
    div.simulateEvent('mouseleave');
    expect(onLeftCount).to.eq(0);
    div.simulateEvent('mouseenter', { which: 1 });
    expect(onEnteredCount).to.eq(0);
    div.simulateEvent('mouseup');
    expect(onDropCount).to.eq(0);
    component.unmount();
  });

  it('does trigger with partially valid data', () => {
    let onEnteredCount = 0;
    let onLeftCount = 0;
    let onDropCount = 0;
    let enteredData;
    const Component = createComponentWithDropTarget({
      validate: data => data['something'] === 'more',
      onEntered: data => { enteredData = data; onEnteredCount++; },
      onExited: () => { onLeftCount++; },
      onDropped: () => { onDropCount++; },
    });
    const component = mount(<Component />);
    const div = component.find('div');
    setDraggingData([{ something: 'else' }, { something: 'more' }]);
    div.simulateEvent('mouseenter', { which: 1 });
    expect(onEnteredCount).to.eq(1);
    expect(enteredData).to.be.instanceOf(Array).and.have.lengthOf(1).and.to.eql([{ something: 'more' }]);
    div.simulateEvent('mouseleave');
    expect(onLeftCount).to.eq(1);
    div.simulateEvent('mouseenter', { which: 1 });
    expect(onEnteredCount).to.eq(2);
    div.simulateEvent('mouseup');
    expect(onDropCount).to.eq(1);
    component.unmount();
  });

  it('does not error with zero config', () => {
    const Component = createComponentWithDropTarget();
    const component = mount(<Component />);
    const div = component.find('div');
    setDraggingData([{ something: 'else' }]);
    div.simulateEvent('mouseenter', { which: 1 });
    div.simulateEvent('mouseup');
    component.unmount();
  });

});
