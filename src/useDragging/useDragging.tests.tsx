import { FunctionComponent } from 'react';
import { mount } from 'enzyme';
import '../extensions';
import { IDragStartData, IDraggingData, IDragEndData, IUseDraggingConfig } from './models';
import { useDragging } from './useDragging';

describe('useDragging', () => {

  function createComponentWithDragging(config: IUseDraggingConfig, onDragStart: (data: IDragStartData) => any, onDrag: (data: IDraggingData) => void,
    onDragEnd: (data: IDragEndData) => void) {
    const Component: FunctionComponent = () => {
      const { dragTarget } = useDragging(config)
        .onDragStart(onDragStart)
        .onDragging(onDrag)
        .onDragEnd(onDragEnd);

      return (
        <div ref={dragTarget}></div>
      );
    };
    return Component;
  }

  it('can be dragged', () => {
    let dragStartData: any = null;
    let draggingData: any = null;
    let dragEndData: any = null;
    const Component = createComponentWithDragging(
      {}, // use defaults
      data => { dragStartData = data; return 'hey'; },
      data => { draggingData = data; return data.data; },
      data => { dragEndData = data; },
    );
    const component = mount(<Component />);
    const div = component.find('div');
    div.simulateEvent('mousedown', { clientX: 10, clientY: 10 });
    document.simulateEvent('mousemove', { clientX: 21, clientY: 10 }); // have to move by at least the threshold (currently 3) to kick off a dragStart event
    expect(dragStartData).to.be.an('object');
    expect(dragStartData).to.have.property('target').and.not.be.undefined;
    expect(dragStartData).to.have.property('currentTarget').and.not.be.undefined;
    expect(dragStartData).to.have.property('coordinates').and.to.eql({ x: 10, y: 10 });
    expect(dragStartData).not.to.have.property('data');
    expect(draggingData).to.be.an('object');
    expect(draggingData).to.have.property('target').and.not.be.undefined;
    expect(draggingData).to.have.property('currentTarget').and.not.be.undefined;
    expect(draggingData).to.have.property('coordinates').and.to.eql({ x: 10, y: 10 });
    expect(draggingData).to.have.property('coordinatesDiff').and.to.eql({ x: 11, y: 0 });
    expect(draggingData).to.have.property('data', 'hey');
    document.simulateEvent('mousemove', { clientX: 25, clientY: 15 });
    expect(draggingData).to.have.property('coordinatesDiff').and.to.eql({ x: 15, y: 5 });
    expect(draggingData).to.have.property('data', 'hey');
    document.simulateEvent('mouseup', { clientX: 30, clientY: 25 });
    expect(dragEndData).to.be.an('object');
    expect(dragEndData).to.have.property('target').and.not.be.undefined;
    expect(dragEndData).to.have.property('currentTarget').and.not.be.undefined;
    expect(dragEndData).to.have.property('coordinates').and.to.eql({ x: 10, y: 10 });
    expect(dragEndData).to.have.property('coordinatesDiff').and.to.eql({ x: 20, y: 15 });
    expect(dragEndData).to.have.property('data', 'hey');
    component.unmount();
  });

  it('stops firing events once mouse up has been received', () => {
    let dragStartCount = 0;
    let draggingCount = 0;
    let dragEndCount = 0;
    const Component = createComponentWithDragging(
      {},
      () => { dragStartCount++; },
      () => { draggingCount++; },
      () => { dragEndCount++; },
    );
    const component = mount(<Component />);
    const div = component.find('div');
    div.simulateEvent('mousedown', { clientX: 0, clientY: 0 });
    document.simulateEvent('mousemove', { clientX: 4, clientY: 4 });
    expect(dragStartCount).to.eq(1);
    expect(draggingCount).to.eq(1);
    expect(dragEndCount).to.eq(0);

    expect(dragStartCount).to.eq(1);
    expect(draggingCount).to.eq(1);
    expect(dragEndCount).to.eq(0);
    document.simulateEvent('mouseup', { clientX: 6, clientY: 6 });
    expect(dragStartCount).to.eq(1);
    expect(draggingCount).to.eq(1);
    expect(dragEndCount).to.eq(1);
    document.simulateEvent('mousemove', { clientX: 10, clientY: 10 });
    expect(dragStartCount).to.eq(1);
    expect(draggingCount).to.eq(1);
    expect(dragEndCount).to.eq(1);
    component.unmount();
  });

  it('doesn\'t fire after being unmounted', () => {
    let dragStartCount = 0;
    let draggingCount = 0;
    let dragEndCount = 0;
    const Component = createComponentWithDragging(
      {},
      () => { dragStartCount++; },
      () => { draggingCount++; },
      () => { dragEndCount++; },
    );
    const component = mount(<Component />);
    const div = component.find('div');
    div.simulateEvent('mousedown', { clientX: 0, clientY: 0 });
    document.simulateEvent('mousemove', { clientX: 4, clientY: 4 });
    expect(dragStartCount).to.eq(1);
    expect(draggingCount).to.eq(1);
    expect(dragEndCount).to.eq(0);

    expect(dragStartCount).to.eq(1);
    expect(draggingCount).to.eq(1);
    expect(dragEndCount).to.eq(0);
    component.unmount();
    document.simulateEvent('mouseup', { clientX: 6, clientY: 6 });
    expect(dragStartCount).to.eq(1);
    expect(draggingCount).to.eq(1);
    expect(dragEndCount).to.eq(0);
    document.simulateEvent('mousemove', { clientX: 10, clientY: 10 });
    expect(dragStartCount).to.eq(1);
    expect(draggingCount).to.eq(1);
    expect(dragEndCount).to.eq(0);
  });

});
