import { mount, ReactWrapper } from 'enzyme';
import { anuxPureFunctionComponent } from '../anuxComponents';
import { useLooper } from './useLooper';

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
      const loop = useLooper();
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
                  <span key={key2}>{item2}-{index2}</span>
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
    test.results.forEach((result, index) => {
      expect(result).to.have.property('key').and.be.a('string');
      expect(result).to.have.property('index').and.be.eq(expectedIndexes[index]);
    });
    const keys = test.results.map(item => item.key);
    expect(keys).to.be.an('array').with.lengthOf(20);
    keys.forEach((key, index) => keys.forEach((otherKey, otherIndex) => index === otherIndex ? null : expect(key).not.to.eq(otherKey)));
    expect(component.text()).to.eq('one-0-ten-0nine-1eight-2seven-3two-1-ten-0nine-1eight-2seven-3three-2-ten-0nine-1eight-2seven-3four-3-ten-0nine-1eight-2seven-3');
    component.unmount();
  });

});