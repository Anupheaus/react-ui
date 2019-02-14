import * as React from 'react';
import './createStyle';
import { IMap } from 'anux-common';

it('can return the requested style correctly', () => {
  const memory = {};
  const style = React.createStyle(memory, {
    'width': 200,
    'height': 300,
    '--background-color': 'red',
  });
  expect(style).to.eql({
    'width': 200,
    'height': 300,
    '--background-color': 'red',
  });
});

it('returns the same object if no style property has changed', () => {
  const memory = {};
  const styles: (React.CSSProperties & IMap)[] = [];
  const generateStyle = () => {
    const style: React.CSSProperties & IMap = {
      'width': 200,
      'height': 300,
      '--background-color': 'red',
    };
    styles.push(style);
    return React.createStyle(memory, style);
  };
  const style1 = generateStyle();
  const style2 = generateStyle();
  expect(style1).to.eq(style2);
  expect(styles).to.have.lengthOf(2);
  expect(styles[0]).not.to.eq(styles[1]);
});
