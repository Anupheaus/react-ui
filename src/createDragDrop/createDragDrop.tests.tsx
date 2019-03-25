import { mount } from "enzyme";
import { createDragDrop } from './createDragDrop';

interface ITestData {

}

describe('createDragDrop', () => {

    it('works', () => {
        const TestDragDrop = createDragDrop<ITestData>();

        const component = mount((
            <TestDragDrop.Draggable<number>  >
                {({ setDraggableTarget }) => (
                    <div ref={setDraggableTarget}></div>
                )}
            </TestDragDrop.Draggable>
        ));

    });

});