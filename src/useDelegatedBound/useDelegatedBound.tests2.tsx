import { mount } from 'enzyme';
import { useDelegatedBound } from './useDelegatedBound';
import { anuxFC } from '../anuxComponents';

interface Props {
  value: number;
  onGetValue(getValue: (provided: string) => () => [number, string]): void;
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
  getValue(provided: string): () => [number, string];
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
    const firstGetFunc = props.getValue('hey');
    expect(firstGetFunc()).to.eql([0, 'hey']);
    expect(props.renderCount).to.eq(1);
    props.setValue(1);

    const secondGetFunc = props.getValue('hey');
    expect(secondGetFunc()).to.eql([1, 'hey']);
    expect(props.renderCount).to.eq(2);
    expect(secondGetFunc).to.eq(firstGetFunc);

    const thirdGetFunc = props.getValue('boo');
    expect(thirdGetFunc()).to.eql([1, 'boo']);
    expect(props.renderCount).to.eq(2);
    expect(thirdGetFunc).not.to.eq(firstGetFunc);
  });

  it('can use react and circular referenced objects as arguments', () => {
    let savedElement: HTMLElement | null = null;

    const CircularTestComponent = anuxFC<{ onBound(element: HTMLElement | null): void }>('CircularTestComponent', ({ onBound }) => {
      const bound = useDelegatedBound((element: HTMLElement | null) => () => onBound(element));
      return (<div ref={element => bound(element)()}></div>);
    });

    mount(<CircularTestComponent onBound={element => { savedElement = element; }} />);

    expect(savedElement).not.to.null;
  })

});
