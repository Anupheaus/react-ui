import { PureComponent } from 'react';
import { showDiff } from './showDiff';

interface IProps {
  something: string;
}

class TestComponent extends PureComponent<IProps> {
}

it('test #1', () => {

  class A { }
  const instanceA = new A();
  const instanceB = new A();

  const a = [{
    a: 1, b: 'hey', c: 1, d: { a: 1 }, e: new Date(1531296643924), f: { a: (<TestComponent something="Hey" />), b: null, d: 'bar', e: {} },
    g: instanceA, i: instanceA, j: A, k: instanceA, l: () => 'Hey',
  }];
  const b = [{
    a: 2, b: 2, c: 1, d: [3], e: new Date(), f: { a: (<TestComponent something="else" />), b: null, c: 2, f: { a: true }, h: undefined },
    h: instanceA, i: instanceA, j: A, k: instanceB, l: () => 'Hey',
  }];

  showDiff(a, b);
});
