// tslint:disable:max-classes-per-file
import * as React from 'react';
import { Children } from '../..';

class Component1 extends React.PureComponent {
  public render() {
    return null;
  }
}

class Component2 extends React.PureComponent {
  public render() {
    return null;
  }
}

describe('children > filterBy > type', () => {

  it('can filter children by a specific type', () => {
    const a = (
      <>
        <Component1>
          test1
        </Component1>
        <Component2>
          <Component1>
            Blah
          </Component1>
        </Component2>
        <Component1>
          test3
        </Component1>
        <div></div>
        test
    </>
    );
    const deepResults = Children.filterBy.type(a.props.children, Component1, true);
    expect(deepResults).to.eql([<Component1 key={'.0'}>test1</Component1>, <Component1 key={'.0'}>Blah</Component1>, <Component1 key={'.2'}>test3</Component1>]);
    const shallowResults = Children.filterBy.type(a.props.children, Component1);
    expect(shallowResults).to.eql([<Component1 key={'.0'}>test1</Component1>, <Component1 key={'.2'}>test3</Component1>]);
  });

});
