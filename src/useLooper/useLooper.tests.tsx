import { anuxPureFunctionComponent } from "../anuxComponents";
import { useLooper } from './useLooper';
import { mount, ReactWrapper } from 'enzyme';
import { useSharedHookState } from '../useSharedHookState';

interface ILooperData {
  key: string;
  index: number;
}

describe('useLooper', () => {

  function createTest() {
    const result = {
      results: [] as ILooperData[],
      mount(): ReactWrapper { throw new Error('This should not have been called.'); },
    };

    const TestComponent = anuxPureFunctionComponent('TestComponent', () => {
      const sharedHookState = useSharedHookState();
      const loop = useLooper(sharedHookState);
      const data1 = ['one', 'two', 'three', 'four'];
      const data2 = ['ten', 'nine', 'eight', 'seven'];

      return (
        <div>
          {loop(data1, (item1, key1, index1) => {
            result.results.push({ key: key1, index: index1 });
            return (
              <p key={key1}>{item1}-{index1}-{loop(data2, (item2, key2, index2) => {
                result.results.push({ key: key2, index: index2 });
                return (
                  <p key={key2}>{item2}-{index2}</p>
                );
              })}</p>
            );
          })}
        </div>
      )
    });

    result.mount = () => mount(<TestComponent />);

    return result;
  }

  it('provides correct functionality', () => {
    const test = createTest();
    expect(test.results).to.be.an('array').with.lengthOf(0);
    const component = test.mount();
    expect(test.results).to.be.an('array').with.lengthOf(20);
    const expectedIndexes = [0, 0, 1, 2, 3, 1, 0, 1, 2, 3, 2, 0, 1, 2, 3, 3, 0, 1, 2, 3];
    console.log(test.results[0].key.substr(0, 5));
    const keys = [test.results[0].key.substr(0, 5), test.results[1].key.substr(0, 5)];
    expect(keys[0]).not.to.eq(keys[1]);
    const expectedKeys = [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1].map(index => keys[index]);
    test.results.forEach((result, index) => {
      expect(result).to.have.property('key').and.be.a('string');
      expect(result.key.startsWith(expectedKeys[index])).to.be.true;
      expect(result).to.have.property('index').and.be.eq(expectedIndexes[index]);
    });
    expect(component.text()).to.eq('one-0-ten-0nine-1eight-2seven-3two-1-ten-0nine-1eight-2seven-3three-2-ten-0nine-1eight-2seven-3four-3-ten-0nine-1eight-2seven-3');
    component.unmount();
  });

});