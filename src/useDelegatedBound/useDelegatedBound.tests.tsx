import { mount } from 'enzyme';
import { useDelegatedBound } from './useDelegatedBound';
import { anuxFC } from '../anuxComponents';

interface Props {
  value: number;
  onGetValue(getValue: (key: string | number, provided: string) => () => [number, string]): void;
  onRendered(): void;
}

const TestComponent = anuxFC<Props>('TestComponent', ({
  value,
  onGetValue,
  onRendered,
}) => {
  const getValue = useDelegatedBound((provided: string) => (): [number, string] => [value, provided]);
  onGetValue(getValue);
  onRendered();

  return (
    <div></div>
  );
});

interface TestProps {
  renderCount: number;
  setValue(value: number): void;
  getValue(key: string | number, provided: string): () => [number, string];
  unmount(): void;
}

function test(name: string, delegate: (props: TestProps) => void): void {
  let hasUnmounted = false;
  it(name, () => {
    const props = { renderCount: 0 } as TestProps;
    const component = mount<Props>(<TestComponent
      value={0}
      onGetValue={newGetValue => { props.getValue = newGetValue; }}
      onRendered={() => props.renderCount++}
    />);
    props.setValue = value => component.setProps({ value });
    props.unmount = () => {
      hasUnmounted = true;
      component.unmount();
    };
    delegate(props);
    if (!hasUnmounted) { component.unmount(); }
  });
}

describe('useDelegatedBound', () => {

  test('returns the same function every time the same key is used but is different when a different key is used', props => {
    const firstGetFunc = props.getValue(0, 'hey');
    expect(firstGetFunc()).to.eql([0, 'hey']);
    expect(props.renderCount).to.eq(1);
    props.setValue(1);

    const secondGetFunc = props.getValue(0, 'there');
    expect(secondGetFunc()).to.eql([1, 'there']);
    expect(props.renderCount).to.eq(2);
    expect(secondGetFunc).to.eq(firstGetFunc);

    const thirdGetFunc = props.getValue(1, 'boo');
    expect(thirdGetFunc()).to.eql([1, 'boo']);
    expect(props.renderCount).to.eq(2);
    expect(thirdGetFunc).not.to.eq(firstGetFunc);
  });

  // test('continues to work even after unmounted by default', props => {
  //   props.setValue(100);
  //   props.unmount();
  //   expect(props.getValue()).to.eq(100);
  // });

});
