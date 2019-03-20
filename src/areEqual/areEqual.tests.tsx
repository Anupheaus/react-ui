import { PureComponent } from 'react';
import '../global';
import { areDeepEqual, areShallowEqual } from './areEqual';

class Component1 extends PureComponent {
  public render() {
    return this.props.children || null;
  }
}

class Component2 extends PureComponent {
  public render() {
    return this.props.children || null;
  }
}

describe('areEqual', () => {
  it('can compare JSX elements correctly', () => {
    const a = {
      a: (
        <div>
          should pass
      </div>
      ),
    };
    const b = {
      a: (
        <div>
          should pass
      </div>
      ),
    };
    const c = {
      a: (
        <div>
          should fail
      </div>
      ),
    };
    expect(areDeepEqual(a, b)).to.be.true;
    expect(areDeepEqual(a, c)).to.be.false;
    expect(areShallowEqual(a, b)).to.be.true;
    expect(areShallowEqual(a, c)).to.be.false;
  });

  it('can compare custom React components correctly', () => {
    const a = {
      a: (
        <Component1>
          should pass
      </Component1>
      ),
    };
    const b = {
      a: (
        <Component1>
          should pass
      </Component1>
      ),
    };
    const c = {
      a: (
        <Component2>
          should fail
      </Component2>
      ),
    };
    expect(areDeepEqual(a, b)).to.be.true;
    expect(Reflect.areDeepEqual(a, b)).to.be.true;
    expect(areDeepEqual(a, c)).to.be.false;
    expect(areShallowEqual(a, b)).to.be.true;
    expect(Reflect.areShallowEqual(a, b)).to.be.false;
    expect(areShallowEqual(a, c)).to.be.false;
  });

  it('can compare a complex comparison correctly', () => {
    const a = {
      a: (
        <Component1>
          should pass
      </Component1>
      ),
    };
    const b = {
      a: 0,
    };
    const c = {
      a: null,
    };
    expect(areDeepEqual(a, b)).to.be.false;
    expect(areShallowEqual(a, b)).to.be.false;
    expect(areDeepEqual(a, c)).to.be.false;
    expect(areShallowEqual(a, c)).to.be.false;
  });
});
