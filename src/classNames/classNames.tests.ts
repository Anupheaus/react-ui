import * as React from 'react';
import './classNames';

it('can take an array of class names and return them all correctly as a single string', () => {
  const value = React.classNames([
    'test1',
    'test2',
    'test3',
  ]);

  expect(value).to.eq('test1 test2 test3');
});

it('returns undefined if no values are specified or are empty', () => {
  const value = React.classNames([
    '',
    undefined,
    null,
  ]);

  expect(value).to.be.undefined;
});
