import { FunctionComponent, ReactElement } from 'react';
import { IMap } from 'anux-common';
import { useActions } from './useActions';
import { mount } from 'enzyme';

interface IProps {
  actions: IMap<Function>;
  children(actions: this['actions']): ReactElement;
}

const TestComponent: FunctionComponent<IProps> = ({ children, actions }) => {
  const proxiedActions = useActions(actions);
  return children(proxiedActions);
};

it('provides the same action instance even though the function content changes', () => {
  let renderCount = 0;
  const actions = {
    upsert(item: number): number {
      return item;
    },
  };

  let innerActions: typeof actions;
  const component = mount((
    <TestComponent actions={actions}>
      {(a: typeof actions) => {
        renderCount++;
        innerActions = a;
        return null;
      }}</TestComponent>
  ));

  expect(innerActions.upsert(5)).to.eq(5);
  const prevActions = innerActions;
  expect(renderCount).to.eq(1);

  const newActions: typeof actions = {
    upsert(item: number): number {
      return item * item;
    },
  };
  component.setProps({ actions: newActions });

  expect(renderCount).to.eq(2);
  expect(innerActions).to.eql(prevActions); // confirm that shallow equal is true
  expect(innerActions.upsert).to.eq(prevActions.upsert); // confirm the functions are identical
  expect(innerActions.upsert(5)).to.eq(25); // confirm original function is being used

  component.unmount();
});
