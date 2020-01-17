// tslint:disable:max-classes-per-file
import { PureComponent } from 'react';
import { Children } from '..';

class Component1 extends PureComponent {
  public render() {
    return null;
  }
}

class Component2 extends PureComponent {
  public render() {
    return null;
  }
}

class Component3 extends PureComponent {
  public render() {
    return null;
  }
}

describe('children > separate', () => {

  it('can seperate children into the required types', () => {
    const a = (
      <>
        <Component1>
          test1
        </Component1>
        <Component2>
          test2
        </Component2>
        <Component1>
          test3
        </Component1>
        <div></div>
        test
    </>
    );
    const { component1s, component2s, component3s, others } = Children.separate(a.props.children, { component1s: Component1, component2s: Component2, component3s: Component3 });
    expect(component1s).to.have.lengthOf(2).and.to.eql([<Component1 key={'.0'}>test1</Component1>, <Component1 key={'.2'}>test3</Component1>]);
    expect(component2s).to.have.lengthOf(1).and.to.eql([<Component2 key={'.1'}>test2</Component2>]);
    expect(component3s).to.have.lengthOf(0);
    expect(others).to.have.lengthOf(2).and.to.eql([<div key={'.3'}></div>, 'test']);
  });

});
